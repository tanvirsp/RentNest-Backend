import { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { ILogin, IUpdatePayload, RegisterUserPayload } from "./auth.interface";
import bcrypt from "bcryptjs";

const registerUser = async (payload: RegisterUserPayload) => {
  const { email, password, name, phone, avatar, role } = payload;
  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_rounds),
  );

  const createUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      avatar,
      role,
    },
    omit: {
      password: true,
    },
  });

  return createUser;
};

const loginUser = async (payload: ILogin) => {
  const { email, password } = payload;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  if (user.status === "BAN") {
    throw new Error("Your account has been BANNED please contact support");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return { accessToken, refreshToken };
};

const getMyProfile = async (userId: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { id: userId },
    omit: {
      password: true,
    },
  });

  return user;
};

const updateProfile = async (userId: string, payload: IUpdatePayload) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: payload,
    omit: {
      password: true,
    },
  });

  return user;
};

export const authService = {
  registerUser,
  loginUser,
  getMyProfile,
  updateProfile,
};
