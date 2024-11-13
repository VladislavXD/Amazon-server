import { Prisma } from "@prisma/client";
import { returnCategoryObject } from "src/category/category.object";
import { returnReviewObject } from "src/review/review.object";

export const productReturnObject: Prisma.ProductSelect = {
  images: true,
  description: true,
  id: true,
  name: true,
  price: true,
  createdAt: true,
  slug: true,
  category: {select: returnCategoryObject},
  reviews: {
    select: returnReviewObject
  }
}


export const productReturnObjectFullest: Prisma.ProductSelect = {
  ...productReturnObject,
}