import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STORE_ID = process.env.NEXT_PUBLIC_STORE_ID || 'bc05714c-82d1-458c-9d2a-01d1458a6b3d';

// Free images from Unsplash (CC0/Public Domain)
const BILLBOARD_IMAGES = {
  tshirts: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&h=400&fit=crop',
  hoodies: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=1200&h=400&fit=crop',
  pants: 'https://images.unsplash.com/photo-1473966968600-fa96b7c10b65?w=1200&h=400&fit=crop',
  accessories: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&h=400&fit=crop',
  shoes: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=1200&h=400&fit=crop',
  outerwear: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=1200&h=400&fit=crop',
  activewear: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1200&h=400&fit=crop',
};

const PRODUCT_IMAGES = {
  tshirts: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1562157873-818bc0726f68?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1622445275463-afa2ab738c34?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1503341504253-dff4f94032fc?w=800&h=800&fit=crop',
  ],
  hoodies: [
    'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1614975059251-992f11792571?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&h=800&fit=crop',
  ],
  pants: [
    'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1475178626620-a4d074967452?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=800&h=800&fit=crop',
  ],
  accessories: [
    'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1534215754734-18e55d13e346?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1611923134239-b9be5816e23c?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1509941943102-10c232535736?w=800&h=800&fit=crop',
  ],
  shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&h=800&fit=crop',
  ],
  outerwear: [
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1544923246-77307dd270b1?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1539533113208-f6df8cc8b543?w=800&h=800&fit=crop',
  ],
  activewear: [
    'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800&h=800&fit=crop',
    'https://images.unsplash.com/photo-1518459031867-a89b944bffe4?w=800&h=800&fit=crop',
  ],
};

async function main() {
  console.log('🌱 Starting seed for UrbanThreads...');

  // 1. SEED BILLBOARDS
  const billboardsData = [
    { label: 'T-Shirts Collection', imageUrl: BILLBOARD_IMAGES.tshirts },
    { label: 'Hoodies & Sweaters', imageUrl: BILLBOARD_IMAGES.hoodies },
    { label: 'Pants & Jeans', imageUrl: BILLBOARD_IMAGES.pants },
    { label: 'Accessories', imageUrl: BILLBOARD_IMAGES.accessories },
    { label: 'Footwear', imageUrl: BILLBOARD_IMAGES.shoes },
    { label: 'Outerwear', imageUrl: BILLBOARD_IMAGES.outerwear },
    { label: 'Activewear', imageUrl: BILLBOARD_IMAGES.activewear },
  ];

  const createdBillboards = await Promise.all(
    billboardsData.map((billboard) =>
      prisma.billboard.create({
        data: {
          label: billboard.label,
          imageUrl: billboard.imageUrl,
          storeId: STORE_ID,
        },
      })
    )
  );
  console.log(`✅ Created ${createdBillboards.length} billboards.`);

  // 2. SEED SIZES (Clothing + Shoes)
  const sizesData = [
    { name: 'Size', value: 'XS' },
    { name: 'Size', value: 'S' },
    { name: 'Size', value: 'M' },
    { name: 'Size', value: 'L' },
    { name: 'Size', value: 'XL' },
    { name: 'Size', value: 'XXL' },
    { name: 'Shoe Size', value: '7' },
    { name: 'Shoe Size', value: '8' },
    { name: 'Shoe Size', value: '9' },
    { name: 'Shoe Size', value: '10' },
    { name: 'Shoe Size', value: '11' },
    { name: 'Shoe Size', value: '12' },
  ];

  const createdSizes = await Promise.all(
    sizesData.map((size) =>
      prisma.size.upsert({
        where: {
          storeId_value: { storeId: STORE_ID, value: size.value },
        },
        update: {},
        create: {
          name: size.name,
          value: size.value,
          storeId: STORE_ID,
        },
      })
    )
  );
  console.log(`✅ Created ${createdSizes.length} sizes.`);

  // 3. SEED COLORS
  const colorsData = [
    { name: 'Black', value: '#000000' },
    { name: 'White', value: '#FFFFFF' },
    { name: 'Navy Blue', value: '#000080' },
    { name: 'Olive Green', value: '#556B2F' },
    { name: 'Charcoal Grey', value: '#36454F' },
    { name: 'Beige', value: '#F5F5DC' },
    { name: 'Red', value: '#DC143C' },
    { name: 'Brown', value: '#8B4513' },
    { name: 'Pink', value: '#FFC0CB' },
    { name: 'Burgundy', value: '#800020' },
  ];

  const createdColors = await Promise.all(
    colorsData.map((color) =>
      prisma.color.upsert({
        where: {
          storeId_value: { storeId: STORE_ID, value: color.value },
        },
        update: {},
        create: {
          name: color.name,
          value: color.value,
          storeId: STORE_ID,
        },
      })
    )
  );
  console.log(`✅ Created ${createdColors.length} colors.`);

  // 4. SEED CATEGORIES
  const categoriesData = [
    { name: 'T-Shirts', billboardIndex: 0 },
    { name: 'Hoodies & Sweaters', billboardIndex: 1 },
    { name: 'Pants & Jeans', billboardIndex: 2 },
    { name: 'Accessories', billboardIndex: 3 },
    { name: 'Shoes', billboardIndex: 4 },
    { name: 'Outerwear', billboardIndex: 5 },
    { name: 'Activewear', billboardIndex: 6 },
  ];

  const createdCategories = await Promise.all(
    categoriesData.map((cat) =>
      prisma.category.create({
        data: {
          name: cat.name,
          storeId: STORE_ID,
          billboardId: createdBillboards[cat.billboardIndex].id,
        },
      })
    )
  );
  console.log(`✅ Created ${createdCategories.length} categories.`);

  // Helper functions
  const getCategory = (name: string) => createdCategories.find((c) => c.name === name)!;
  const getSize = (value: string) => createdSizes.find((s) => s.value === value)!;
  const getColor = (value: string) => createdColors.find((c) => c.value === value)!;

  // 5. SEED PRODUCTS (35 Total)
  const productsData = [
    // ===== T-SHIRTS (7) =====
    {
      name: 'Urban Classic Tee',
      price: 29.99,
      categoryId: getCategory('T-Shirts').id,
      sizeId: getSize('M').id,
      colorId: getColor('#000000').id,
      images: [PRODUCT_IMAGES.tshirts[0], PRODUCT_IMAGES.tshirts[1]],
      isFeatured: true,
    },
    {
      name: 'Vintage Graphic Tee',
      price: 34.99,
      categoryId: getCategory('T-Shirts').id,
      sizeId: getSize('L').id,
      colorId: getColor('#FFFFFF').id,
      images: [PRODUCT_IMAGES.tshirts[2], PRODUCT_IMAGES.tshirts[0]],
      isFeatured: false,
    },
    {
      name: 'Essential Crew Tee',
      price: 24.99,
      categoryId: getCategory('T-Shirts').id,
      sizeId: getSize('M').id,
      colorId: getColor('#36454F').id,
      images: [PRODUCT_IMAGES.tshirts[3], PRODUCT_IMAGES.tshirts[4]],
      isFeatured: false,
    },
    {
      name: 'Oversized Streetwear Tee',
      price: 39.99,
      categoryId: getCategory('T-Shirts').id,
      sizeId: getSize('L').id,
      colorId: getColor('#000000').id,
      images: [PRODUCT_IMAGES.tshirts[5], PRODUCT_IMAGES.tshirts[6]],
      isFeatured: true,
    },
    {
      name: 'Striped Long Sleeve',
      price: 44.99,
      categoryId: getCategory('T-Shirts').id,
      sizeId: getSize('M').id,
      colorId: getColor('#000080').id,
      images: [PRODUCT_IMAGES.tshirts[1], PRODUCT_IMAGES.tshirts[3]],
      isFeatured: false,
    },
    {
      name: 'Pocket Tee',
      price: 27.99,
      categoryId: getCategory('T-Shirts').id,
      sizeId: getSize('S').id,
      colorId: getColor('#F5F5DC').id,
      images: [PRODUCT_IMAGES.tshirts[4], PRODUCT_IMAGES.tshirts[0]],
      isFeatured: false,
    },
    {
      name: 'V-Neck Basic',
      price: 22.99,
      categoryId: getCategory('T-Shirts').id,
      sizeId: getSize('M').id,
      colorId: getColor('#FFFFFF').id,
      images: [PRODUCT_IMAGES.tshirts[6], PRODUCT_IMAGES.tshirts[2]],
      isFeatured: false,
    },

    // ===== HOODIES & SWEATERS (6) =====
    {
      name: 'Midnight Oversized Hoodie',
      price: 79.99,
      categoryId: getCategory('Hoodies & Sweaters').id,
      sizeId: getSize('L').id,
      colorId: getColor('#000000').id,
      images: [PRODUCT_IMAGES.hoodies[0], PRODUCT_IMAGES.hoodies[1], PRODUCT_IMAGES.hoodies[2]],
      isFeatured: true,
    },
    {
      name: 'Urban Zip-Up Hoodie',
      price: 69.99,
      categoryId: getCategory('Hoodies & Sweaters').id,
      sizeId: getSize('M').id,
      colorId: getColor('#000080').id,
      images: [PRODUCT_IMAGES.hoodies[1], PRODUCT_IMAGES.hoodies[0]],
      isFeatured: false,
    },
    {
      name: 'Classic Crewneck Sweatshirt',
      price: 59.99,
      categoryId: getCategory('Hoodies & Sweaters').id,
      sizeId: getSize('L').id,
      colorId: getColor('#36454F').id,
      images: [PRODUCT_IMAGES.hoodies[3], PRODUCT_IMAGES.hoodies[4]],
      isFeatured: true,
    },
    {
      name: 'Cropped Hoodie',
      price: 54.99,
      categoryId: getCategory('Hoodies & Sweaters').id,
      sizeId: getSize('S').id,
      colorId: getColor('#FFC0CB').id,
      images: [PRODUCT_IMAGES.hoodies[5], PRODUCT_IMAGES.hoodies[2]],
      isFeatured: false,
    },
    {
      name: 'Turtleneck Sweater',
      price: 64.99,
      categoryId: getCategory('Hoodies & Sweaters').id,
      sizeId: getSize('M').id,
      colorId: getColor('#800020').id,
      images: [PRODUCT_IMAGES.hoodies[4], PRODUCT_IMAGES.hoodies[3]],
      isFeatured: false,
    },
    {
      name: 'Pullover Hoodie',
      price: 74.99,
      categoryId: getCategory('Hoodies & Sweaters').id,
      sizeId: getSize('XL').id,
      colorId: getColor('#556B2F').id,
      images: [PRODUCT_IMAGES.hoodies[2], PRODUCT_IMAGES.hoodies[5]],
      isFeatured: false,
    },

    // ===== PANTS & JEANS (6) =====
    {
      name: 'Vintage Wash Denim',
      price: 89.99,
      categoryId: getCategory('Pants & Jeans').id,
      sizeId: getSize('M').id,
      colorId: getColor('#000080').id,
      images: [PRODUCT_IMAGES.pants[0], PRODUCT_IMAGES.pants[1]],
      isFeatured: true,
    },
    {
      name: 'Urban Cargo Pants',
      price: 74.99,
      categoryId: getCategory('Pants & Jeans').id,
      sizeId: getSize('L').id,
      colorId: getColor('#556B2F').id,
      images: [PRODUCT_IMAGES.pants[2], PRODUCT_IMAGES.pants[1]],
      isFeatured: false,
    },
    {
      name: 'Classic Joggers',
      price: 54.99,
      categoryId: getCategory('Pants & Jeans').id,
      sizeId: getSize('M').id,
      colorId: getColor('#36454F').id,
      images: [PRODUCT_IMAGES.pants[3], PRODUCT_IMAGES.pants[4]],
      isFeatured: true,
    },
    {
      name: 'Summer Shorts',
      price: 39.99,
      categoryId: getCategory('Pants & Jeans').id,
      sizeId: getSize('L').id,
      colorId: getColor('#F5F5DC').id,
      images: [PRODUCT_IMAGES.pants[4], PRODUCT_IMAGES.pants[5]],
      isFeatured: false,
    },
    {
      name: 'Slim Fit Chinos',
      price: 64.99,
      categoryId: getCategory('Pants & Jeans').id,
      sizeId: getSize('M').id,
      colorId: getColor('#8B4513').id,
      images: [PRODUCT_IMAGES.pants[5], PRODUCT_IMAGES.pants[0]],
      isFeatured: false,
    },
    {
      name: 'Skinny Jeans',
      price: 79.99,
      categoryId: getCategory('Pants & Jeans').id,
      sizeId: getSize('S').id,
      colorId: getColor('#000000').id,
      images: [PRODUCT_IMAGES.pants[1], PRODUCT_IMAGES.pants[3]],
      isFeatured: false,
    },

    // ===== ACCESSORIES (6) =====
    {
      name: 'Thread Logo Cap',
      price: 24.99,
      categoryId: getCategory('Accessories').id,
      sizeId: getSize('M').id,
      colorId: getColor('#000000').id,
      images: [PRODUCT_IMAGES.accessories[0]],
      isFeatured: false,
    },
    {
      name: 'Urban Beanie',
      price: 19.99,
      categoryId: getCategory('Accessories').id,
      sizeId: getSize('M').id,
      colorId: getColor('#36454F').id,
      images: [PRODUCT_IMAGES.accessories[1]],
      isFeatured: false,
    },
    {
      name: 'Canvas Tote Bag',
      price: 29.99,
      categoryId: getCategory('Accessories').id,
      sizeId: getSize('M').id,
      colorId: getColor('#F5F5DC').id,
      images: [PRODUCT_IMAGES.accessories[2], PRODUCT_IMAGES.accessories[3]],
      isFeatured: true,
    },
    {
      name: 'Classic Sunglasses',
      price: 49.99,
      categoryId: getCategory('Accessories').id,
      sizeId: getSize('M').id,
      colorId: getColor('#000000').id,
      images: [PRODUCT_IMAGES.accessories[3], PRODUCT_IMAGES.accessories[4]],
      isFeatured: true,
    },
    {
      name: 'Minimalist Watch',
      price: 129.99,
      categoryId: getCategory('Accessories').id,
      sizeId: getSize('M').id,
      colorId: getColor('#8B4513').id,
      images: [PRODUCT_IMAGES.accessories[4], PRODUCT_IMAGES.accessories[5]],
      isFeatured: true,
    },
    {
      name: 'Leather Belt',
      price: 39.99,
      categoryId: getCategory('Accessories').id,
      sizeId: getSize('M').id,
      colorId: getColor('#8B4513').id,
      images: [PRODUCT_IMAGES.accessories[5], PRODUCT_IMAGES.accessories[2]],
      isFeatured: false,
    },

    // ===== SHOES (4) =====
    {
      name: 'Classic White Sneakers',
      price: 99.99,
      categoryId: getCategory('Shoes').id,
      sizeId: getSize('10').id,
      colorId: getColor('#FFFFFF').id,
      images: [PRODUCT_IMAGES.shoes[0], PRODUCT_IMAGES.shoes[1]],
      isFeatured: true,
    },
    {
      name: 'High-Top Streetwear',
      price: 119.99,
      categoryId: getCategory('Shoes').id,
      sizeId: getSize('9').id,
      colorId: getColor('#000000').id,
      images: [PRODUCT_IMAGES.shoes[1], PRODUCT_IMAGES.shoes[2]],
      isFeatured: true,
    },
    {
      name: 'Running Performance',
      price: 139.99,
      categoryId: getCategory('Shoes').id,
      sizeId: getSize('10').id,
      colorId: getColor('#DC143C').id,
      images: [PRODUCT_IMAGES.shoes[2], PRODUCT_IMAGES.shoes[3]],
      isFeatured: false,
    },
    {
      name: 'Casual Loafers',
      price: 89.99,
      categoryId: getCategory('Shoes').id,
      sizeId: getSize('11').id,
      colorId: getColor('#8B4513').id,
      images: [PRODUCT_IMAGES.shoes[3], PRODUCT_IMAGES.shoes[4]],
      isFeatured: false,
    },

    // ===== OUTERWEAR (3) =====
    {
      name: 'Urban Bomber Jacket',
      price: 149.99,
      categoryId: getCategory('Outerwear').id,
      sizeId: getSize('L').id,
      colorId: getColor('#000000').id,
      images: [PRODUCT_IMAGES.outerwear[0], PRODUCT_IMAGES.outerwear[1]],
      isFeatured: true,
    },
    {
      name: 'Vintage Denim Jacket',
      price: 109.99,
      categoryId: getCategory('Outerwear').id,
      sizeId: getSize('M').id,
      colorId: getColor('#000080').id,
      images: [PRODUCT_IMAGES.outerwear[1], PRODUCT_IMAGES.outerwear[2]],
      isFeatured: true,
    },
    {
      name: 'Puffer Vest',
      price: 89.99,
      categoryId: getCategory('Outerwear').id,
      sizeId: getSize('L').id,
      colorId: getColor('#36454F').id,
      images: [PRODUCT_IMAGES.outerwear[2], PRODUCT_IMAGES.outerwear[3]],
      isFeatured: false,
    },

    // ===== ACTIVEWEAR (3) =====
    {
      name: 'Performance Leggings',
      price: 59.99,
      categoryId: getCategory('Activewear').id,
      sizeId: getSize('S').id,
      colorId: getColor('#000000').id,
      images: [PRODUCT_IMAGES.activewear[0], PRODUCT_IMAGES.activewear[1]],
      isFeatured: true,
    },
    {
      name: 'Sports Bra',
      price: 34.99,
      categoryId: getCategory('Activewear').id,
      sizeId: getSize('S').id,
      colorId: getColor('#FFC0CB').id,
      images: [PRODUCT_IMAGES.activewear[1], PRODUCT_IMAGES.activewear[2]],
      isFeatured: false,
    },
    {
      name: 'Training Shorts',
      price: 39.99,
      categoryId: getCategory('Activewear').id,
      sizeId: getSize('M').id,
      colorId: getColor('#36454F').id,
      images: [PRODUCT_IMAGES.activewear[2], PRODUCT_IMAGES.activewear[3]],
      isFeatured: false,
    },
  ];

  for (const product of productsData) {
    const createdProduct = await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        storeId: STORE_ID,
        categoryId: product.categoryId,
        sizeId: product.sizeId,
        colorId: product.colorId,
        isFeatured: product.isFeatured,
        isArchived: false,
        images: {
          create: product.images.map((url) => ({
            url,
          })),
        },
      },
    });

    console.log(`  ➕ Created product: ${product.name}`);
  }

  console.log(`\n🎉 Seed completed successfully!`);
  console.log(`📦 Total products created: ${productsData.length}`);
  console.log(`🎨 Total colors: ${colorsData.length}`);
  console.log(`📏 Total sizes: ${sizesData.length}`);
  console.log(`📂 Total categories: ${categoriesData.length}`);
  console.log(`🎯 Total billboards: ${billboardsData.length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });