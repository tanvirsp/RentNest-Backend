import { RentalRequestStatus } from "../../../generated/prisma/enums";

export interface IRentalRequest {
  propertyId: string;
  moveInDate: string;
  leaseMonths: number;
  message?: string;
}

export interface IPayload {
  status: RentalRequestStatus;
  page: number;
  limit: number;
}
