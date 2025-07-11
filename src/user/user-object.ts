import { Prisma } from "@prisma/client";

export const returnUserObject: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  password: false,
  phone: true,
  description: true,
} 