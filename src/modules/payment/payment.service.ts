import axios from "axios";
import config from "../../config";
import {
  SSLCommerzPaymentFailResponse,
  SSLCommerzSuccessPayload,
} from "./payment.interface";
import { prisma } from "../../lib/prisma";
import { JwtPayload } from "jsonwebtoken";

const initiatePayment = async (rentalRequestId: string, user: JwtPayload) => {
  //Find Rental Request

  const rentalRequest = await prisma.rentalRequest.findUnique({
    where: {
      id: rentalRequestId,
    },
  });

  if (rentalRequest?.status !== "APPROVED") {
    throw new Error(
      "Sorry your rental request is not approved, please contact the Landlord",
    );
  }

  //Find Property
  const property = await prisma.property.findUnique({
    where: {
      id: rentalRequest.propertyId,
      status: "AVAILABLE",
    },
  });

  if (!property) {
    throw new Error("Sorry is not available for rent");
  }

  // Total Ammount Calculate
  const totalAmount =
    Number(property.rentAmount) * Number(rentalRequest.leaseMonths);

  const tran_id = `TAN${Math.floor(1000000 + Math.random() * 9000000)}`;

  //Create Payment data
  await prisma.payment.create({
    data: {
      rentalRequestId,
      tenantId: user.id,
      amount: totalAmount,
      provider: "SSLCOMMERZ",
      transactionId: tran_id,
    },
  });

  //SSC Commerz Data
  const storeData = {
    store_id: config.ssl_commerz_store_id,
    store_passwd: config.ssl_commerz_store_password,
    total_amount: totalAmount,
    currency: "BDT",
    tran_id: tran_id,
    success_url: `${config.app_url}/api/payments/success`,
    fail_url: `${config.app_url}/api/payments/fail/`,
    cancel_url: `${config.app_url}/api/payments/cancel`,
    cus_name: user.name,
    cus_email: user.email,
    cus_add1: "N/A",
    cus_city: "N/A",
    cus_state: "N/A",
    cus_postcode: "N/A",
    cus_country: "N/A",
    cus_phone: "N/A",
  };

  const response = await axios.post(
    "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    storeData,
    {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    },
  );

  const data = await response.data;
  return data.GatewayPageURL;
};

const paymentSuccess = async (payload: SSLCommerzSuccessPayload) => {
  const { val_id, tran_id, amount, card_type } = payload;

  //Verify Payment
  const url =
    "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

  const response = await axios.get(
    `${url}?val_id=${val_id}&store_id=${config.ssl_commerz_store_id}&store_passwd=${config.ssl_commerz_store_password}&format=json`,
  );

  const veriryData = response.data;

  if (veriryData.status !== "VALID") {
    throw new Error("Payment validation failed");
  }

  const paymentData = await prisma.payment.findUnique({
    where: { transactionId: tran_id },
  });

  if (!paymentData) {
    throw new Error("Transition Id is not Matching with payment");
  }

  if (Number(amount) !== Number(paymentData.amount)) {
    throw new Error("Amount mismatch");
  }

  const transactionResult = await prisma.$transaction(async (tx) => {
    //update payment status
    await tx.payment.update({
      where: {
        transactionId: tran_id,
      },
      data: {
        status: "PAID",
        valId: val_id,
        paidAt: new Date(),
        paymentMethod: card_type,
      },
    });

    //update Rental Request status
    await tx.rentalRequest.update({
      where: {
        id: paymentData.rentalRequestId,
      },
      data: {
        status: "COMPLETED",
      },
    });

    //rollback end
  });
};

const paymentFail = async (payload: SSLCommerzPaymentFailResponse) => {
  const { tran_id, card_issuer } = payload;
  //update payment status
  await prisma.payment.update({
    where: {
      transactionId: tran_id,
    },
    data: {
      status: "FAILED",
      paymentMethod: card_issuer,
    },
  });
};

const paymentCancel = async (payload: SSLCommerzPaymentFailResponse) => {
  const { tran_id, card_issuer } = payload;
  //update payment status
  await prisma.payment.update({
    where: {
      transactionId: tran_id,
    },
    data: {
      status: "CANCELLED",
      paymentMethod: card_issuer,
    },
  });
};

export const paymentService = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
};
