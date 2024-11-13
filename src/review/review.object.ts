import { Prisma } from "@prisma/client";
import { returnUserObject } from "src/user/user-object";

export const returnReviewObject:Prisma.ReviewSelect = {
  user:{
    select: returnUserObject
  },
  createdAt: true,
  text: true,
  rating: true,
  id: true
}