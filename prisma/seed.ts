import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const cards = [
  {
    title: 'Lan Kwai Fong',
    description: 'The nightlife center of Hong Kong',
    imageUrl: 'https://wallpapers.com/images/hd/hong-kong-street-with-neon-sign-8nooro9nrpz141b1.jpg'
  },
  {
    title: 'Victoria Peak',
    description: 'The best viewing platform overlooking Hong Kong',
    imageUrl: 'https://wallpapercave.com/wp/wp13229853.jpg'
  },
  {
    title: 'Central',
    description: 'The financial center of Hong Kong',
    imageUrl: 'https://wallpapersok.com/images/hd/hong-kong-street-yellow-markings-859yvj4cz1lbzus9.jpg'
  },
  {
    title: 'Old Hong Kong Streets',
    description: 'A journey back to the memories of the 1970s',
    imageUrl: 'https://r1.ilikewallpaper.net/iphone-12-pro-max-wallpapers/download-118634/ID-264083-hong-kong-tones-4k.jpg'
  }
];

async function main() {
  console.log('Start seeding...');
  
  for (const card of cards) {
    const createdCard = await prisma.card.create({
      data: card
    });
    console.log(`Created card with id: ${createdCard.id}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 