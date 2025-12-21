const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const packages = [
    {
      externalId: "PKG-1001",
      title: "Volcano & Gorilla Trekking",
      location: "Ruhengeri, Rwanda",
      durationDays: 5,
      price: 650,
      maxGroup: 8,
      featured: true,
      status: "active",
    },
    {
      externalId: "PKG-1002",
      title: "Akagera Big Five Safari",
      location: "Akagera, Rwanda",
      durationDays: 3,
      price: 480,
      maxGroup: 12,
      featured: false,
      status: "active",
    },
    {
      externalId: "PKG-1003",
      title: "Nyungwe Chimpanzee Trek",
      location: "Nyungwe, Rwanda",
      durationDays: 2,
      price: 420,
      maxGroup: 10,
      featured: false,
      status: "draft",
    },
  ];

  for (const p of packages) {
    await prisma.package.upsert({
      where: { externalId: p.externalId },
      update: {
        title: p.title,
        location: p.location,
        durationDays: p.durationDays,
        price: p.price,
        maxGroup: p.maxGroup,
        featured: p.featured,
        status: p.status,
      },
      create: p,
    });
  }

  const customers = [
    {
      externalId: "CUS-3001",
      name: "Aline M.",
      email: "aline@example.com",
      phone: "+250 788 000 001",
      segment: "vip",
      country: "Rwanda",
    },
    {
      externalId: "CUS-3002",
      name: "John K.",
      email: "johnk@example.com",
      phone: "+250 788 000 014",
      segment: "new",
      country: "Rwanda",
    },
    {
      externalId: "CUS-3003",
      name: "Grace N.",
      email: "grace.n@example.com",
      phone: "+250 788 000 022",
      segment: "returning",
      country: "Rwanda",
    },
  ];

  for (const c of customers) {
    await prisma.customer.upsert({
      where: { externalId: c.externalId },
      update: {
        name: c.name,
        email: c.email,
        phone: c.phone,
        segment: c.segment,
        country: c.country,
      },
      create: c,
    });
  }

  const blogPosts = [
    {
      externalId: "BLG-2001",
      title: "Top 7 Experiences in Rwanda",
      category: "Travel Guides",
      author: "Admin",
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
    {
      externalId: "BLG-2002",
      title: "How to Prepare for Gorilla Trekking",
      category: "Adventure",
      author: "Admin",
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
  ];

  for (const b of blogPosts) {
    await prisma.blogPost.upsert({
      where: { externalId: b.externalId },
      update: {
        title: b.title,
        category: b.category,
        author: b.author,
        status: b.status,
        readTime: b.readTime,
        content: b.content,
      },
      create: b,
    });
  }

  const pkg1 = await prisma.package.findUnique({
    where: { externalId: "PKG-1001" },
  });
  const pkg2 = await prisma.package.findUnique({
    where: { externalId: "PKG-1002" },
  });
  const pkg3 = await prisma.package.findUnique({
    where: { externalId: "PKG-1003" },
  });

  const cus1 = await prisma.customer.findUnique({
    where: { externalId: "CUS-3001" },
  });
  const cus2 = await prisma.customer.findUnique({
    where: { externalId: "CUS-3002" },
  });
  const cus3 = await prisma.customer.findUnique({
    where: { externalId: "CUS-3003" },
  });

  const bookings = [
    {
      externalId: "BK-1024",
      customerId: cus1.id,
      packageId: pkg1.id,
      date: new Date("2025-01-12"),
      travellers: 2,
      amount: 650,
      status: "confirmed",
    },
    {
      externalId: "BK-1025",
      customerId: cus2.id,
      packageId: pkg2.id,
      date: new Date("2025-01-15"),
      travellers: 4,
      amount: 480,
      status: "pending",
    },
    {
      externalId: "BK-1026",
      customerId: cus3.id,
      packageId: pkg3.id,
      date: new Date("2025-01-20"),
      travellers: 1,
      amount: 420,
      status: "cancelled",
    },
  ];

  for (const b of bookings) {
    await prisma.booking.upsert({
      where: { externalId: b.externalId },
      update: {
        date: b.date,
        travellers: b.travellers,
        amount: b.amount,
        status: b.status,
        customerId: b.customerId,
        packageId: b.packageId,
      },
      create: b,
    });
  }
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
