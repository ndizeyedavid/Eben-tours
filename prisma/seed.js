const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
<<<<<<< HEAD
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
=======
  const packages = [
    {
      externalId: "PKG-1001",
>>>>>>> 5d17947e5c4b692bb8f07c9965626f33dc74a871
      title: "Volcano & Gorilla Trekking",
      location: "Ruhengeri, Rwanda",
      durationDays: 5,
      price: 650,
      maxGroup: 8,
      featured: true,
      status: "active",
    },
<<<<<<< HEAD
  });

  const akagera = await prisma.package.upsert({
    where: { publicId: "PKG-1002" },
    update: {},
    create: {
      publicId: "PKG-1002",
=======
    {
      externalId: "PKG-1002",
>>>>>>> 5d17947e5c4b692bb8f07c9965626f33dc74a871
      title: "Akagera Big Five Safari",
      location: "Akagera, Rwanda",
      durationDays: 3,
      price: 480,
      maxGroup: 12,
      featured: false,
      status: "active",
    },
<<<<<<< HEAD
  });

  const nyungwe = await prisma.package.upsert({
    where: { publicId: "PKG-1003" },
    update: {},
    create: {
      publicId: "PKG-1003",
=======
    {
      externalId: "PKG-1003",
>>>>>>> 5d17947e5c4b692bb8f07c9965626f33dc74a871
      title: "Nyungwe Chimpanzee Trek",
      location: "Nyungwe, Rwanda",
      durationDays: 2,
      price: 420,
      maxGroup: 10,
      featured: false,
      status: "draft",
    },
<<<<<<< HEAD
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
=======
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
>>>>>>> 5d17947e5c4b692bb8f07c9965626f33dc74a871
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
<<<<<<< HEAD
  });

  await prisma.blogPost.upsert({
    where: { publicId: "BLG-2002" },
    update: {},
    create: {
      publicId: "BLG-2002",
      title: "How to Prepare for Gorilla Trekking",
      category: "Adventure",
      authorName: "Admin",
=======
    {
      externalId: "BLG-2002",
      title: "How to Prepare for Gorilla Trekking",
      category: "Adventure",
      author: "Admin",
>>>>>>> 5d17947e5c4b692bb8f07c9965626f33dc74a871
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
<<<<<<< HEAD
  });
=======
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
>>>>>>> 5d17947e5c4b692bb8f07c9965626f33dc74a871
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
