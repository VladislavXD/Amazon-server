import * as dotenv from 'dotenv';
import { Prisma, PrismaClient, Product } from '@prisma/client';
import { faker } from '@faker-js/faker';

dotenv.config();
const prisma = new PrismaClient();
console.log(faker.image);
const createProduct = async (quantity: number) => {
  const products: Product[] = [];

  for (let i = 0; i < quantity; i++) { // Изменил `products.length` на `quantity`
    const productName = faker.commerce.productName();
    const categoryName = faker.commerce.department();

    const product = await prisma.product.create({
      data: {
        name: productName,
        slug: faker.helpers.slugify(productName).toLowerCase(),
        description: faker.commerce.productDescription(),
        price: +faker.commerce.price({ min: 10, max: 999, dec: 0 }),
        images: Array.from({
          length: faker.number.int({ min: 2, max: 6 })
        }).map(() => faker.image.urlPicsumPhotos()),
        category: {
          create: {
            name: categoryName,
            slug: faker.helpers.slugify(categoryName).toLowerCase(),
          }
        },
        reviews: {
          create: [
            {
              rating: faker.number.int({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 1
                }
              }
            },
            {
              rating: faker.number.int({ min: 1, max: 5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 1
                }
              }
            }
          ]
        }
      }
    });
    products.push(product); // Добавляем продукт в массив
  }
};

async function main() {
  console.log('start seeding...');
  await createProduct(20);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
