import axios from "axios";
import config from "../../config";
import { SSLCommerzSuccessPayload } from "./payment.interface";
import { prisma } from "../../lib/prisma";

const initiatePayment = async (rentalRequestId: string, tenantId: string) => {
  let tran_id = `TAN${Math.floor(1000000 + Math.random() * 9000000)}`;

  const paymentData = {};

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

  const storeData = {
    store_id: config.ssl_commerz_store_id,
    store_passwd: config.ssl_commerz_store_password,
    total_amount: totalAmount,
    currency: "BDT",
    tran_id: tran_id,
    success_url: `${config.app_url}/api/payments/success`,
    fail_url: `${config.app_url}/api/payments/fail/`,
    cancel_url: `${config.app_url}/api/payments/cancel`,
    cus_name: "Customer Name",
    cus_email: " cust@yahoo.com",
    cus_add1: "Dhaka",
    cus_city: "Dhaka",
    cus_state: "Dhaka",
    cus_postcode: "1000",
    cus_country: "Bangladesh",
    cus_phone: "01711111111",
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

const paymentSuccess = async (payload: SSLCommerzSuccessPayload) => {};

export const paymentService = {
  initiatePayment,
  paymentSuccess,
};
