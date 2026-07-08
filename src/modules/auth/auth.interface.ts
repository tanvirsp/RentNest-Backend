import { Role } from "../../../generated/prisma/enums";

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role?: Role;
}

export interface ILogin {
  email: string;
  password: string;
}
