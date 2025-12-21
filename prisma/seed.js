const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Customers
  const alice = await prisma.customer.upsert({
    where: { publicId: "CUS-3001" },
    update: {},
    create: {
      publicId: "CUS-3001",
      name: "Aline M.",
      email: "aline@example.com",
      phone: "+250 788 000 001",
      segment: "vip",
      lastBooking: new Date("2025-12-10"),
    },
  });

  const john = await prisma.customer.upsert({
    where: { publicId: "CUS-3002" },
    update: {},
    create: {
      publicId: "CUS-3002",
      name: "John K.",
      email: "johnk@example.com",
      phone: "+250 788 000 014",
      segment: "new",
      lastBooking: new Date("2025-12-18"),
    },
  });

  const grace = await prisma.customer.upsert({
    where: { publicId: "CUS-3003" },
    update: {},
    create: {
      publicId: "CUS-3003",
      name: "Grace N.",
      email: "grace.n@example.com",
      phone: "+250 788 000 022",
      segment: "returning",
      lastBooking: new Date("2025-11-29"),
    },
  });

  // Packages
  const gorilla = await prisma.package.upsert({
    where: { publicId: "PKG-1001" },
    update: {},
    create: {
      publicId: "PKG-1001",
      title: "Volcano & Gorilla Trekking",
      location: "Ruhengeri, Rwanda",
      durationDays: 5,
      price: 650,
      maxGroup: 8,
      featured: true,
      status: "active",
    },
  });

  const akagera = await prisma.package.upsert({
    where: { publicId: "PKG-1002" },
    update: {},
    create: {
      publicId: "PKG-1002",
      title: "Akagera Big Five Safari",
      location: "Akagera, Rwanda",
      durationDays: 3,
      price: 480,
      maxGroup: 12,
      featured: false,
      status: "active",
    },
  });

  const nyungwe = await prisma.package.upsert({
    where: { publicId: "PKG-1003" },
    update: {},
    create: {
      publicId: "PKG-1003",
      title: "Nyungwe Chimpanzee Trek",
      location: "Nyungwe, Rwanda",
      durationDays: 2,
      price: 420,
      maxGroup: 10,
      featured: false,
      status: "draft",
    },
  });

  // Bookings
  await prisma.booking.upsert({
    where: { publicId: "BK-1024" },
    update: {},
    create: {
      publicId: "BK-1024",
      travelDate: new Date("2025-01-12"),
      travellers: 2,
      amount: 650,
      status: "confirmed",
      customerId: alice.id,
      packageId: gorilla.id,
    },
  });

  await prisma.booking.upsert({
    where: { publicId: "BK-1025" },
    update: {},
    create: {
      publicId: "BK-1025",
      travelDate: new Date("2025-01-15"),
      travellers: 4,
      amount: 480,
      status: "pending",
      customerId: john.id,
      packageId: akagera.id,
    },
  });

  await prisma.booking.upsert({
    where: { publicId: "BK-1026" },
    update: {},
    create: {
      publicId: "BK-1026",
      travelDate: new Date("2025-01-20"),
      travellers: 1,
      amount: 420,
      status: "cancelled",
      customerId: alice.id,
      packageId: nyungwe.id,
    },
  });

  await prisma.booking.upsert({
    where: { publicId: "BK-1027" },
    update: {},
    create: {
      publicId: "BK-1027",
      travelDate: new Date("2025-02-03"),
      travellers: 3,
      amount: 650,
      status: "confirmed",
      customerId: john.id,
      packageId: gorilla.id,
    },
  });

  await prisma.booking.upsert({
    where: { publicId: "BK-1028" },
    update: {},
    create: {
      publicId: "BK-1028",
      travelDate: new Date("2025-02-07"),
      travellers: 2,
      amount: 480,
      status: "pending",
      customerId: grace.id,
      packageId: akagera.id,
    },
  });

  // Blogs (Quill delta JSON)
  await prisma.blogPost.upsert({
    where: { publicId: "BLG-2001" },
    update: {},
    create: {
      publicId: "BLG-2001",
      title: "Top 7 Experiences in Rwanda",
      category: "Travel Guides",
      authorName: "Admin",
      status: "published",
      readTime: "6 min",
      content: {
        ops: [
          { insert: "Top 7 Experiences in Rwanda\n" },
          { attributes: { header: 2 }, insert: "\n" },
          {
            insert:
              "Write a short intro, then list the experiences with images and tips.\n",
          },
        ],
      },
    },
  });

  await prisma.blogPost.upsert({
    where: { publicId: "BLG-2002" },
    update: {},
    create: {
      publicId: "BLG-2002",
      title: "How to Prepare for Gorilla Trekking",
      category: "Adventure",
      authorName: "Admin",
      status: "draft",
      readTime: "8 min",
      content: {
        ops: [
          { insert: "How to Prepare for Gorilla Trekking\n" },
          { attributes: { header: 2 }, insert: "\n" },
          {
            insert:
              "Add essentials: clothing, fitness, permits, camera tips, and timing.\n",
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
