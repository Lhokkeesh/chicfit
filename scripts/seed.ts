import * as dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import Product from '@/models/Product';
import User from '@/models/User';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI as string;

const products = [
  // Men's products
  {
    name: "Classic Fit Dress Shirt",
    description: "A timeless dress shirt perfect for any formal occasion. Made from premium cotton with a comfortable fit.",
    price: 59.99,
    category: "men",
    image: "/images/products/men/dress-shirt.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Light Blue", "Black"],
    stock: 50,
  },
  {
    name: "Slim Fit Chino Pants",
    description: "Modern slim fit chinos made from stretch cotton for maximum comfort. Perfect for both casual and semi-formal wear.",
    price: 79.99,
    category: "men",
    image: "/images/products/men/chinos.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Khaki", "Navy", "Olive"],
    stock: 40,
  },
  {
    name: "Wool Blend Blazer",
    description: "A sophisticated blazer crafted from premium wool blend. Features a modern cut and classic design.",
    price: 199.99,
    category: "men",
    image: "/images/products/men/blazer.jpg",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Navy", "Charcoal", "Black"],
    stock: 25,
  },

  // Women's products
  {
    name: "Floral Summer Dress",
    description: "A beautiful floral print dress perfect for summer days. Made from lightweight, breathable fabric.",
    price: 89.99,
    category: "women",
    image: "/images/products/women/summer-dress.jpg",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Blue Floral", "Pink Floral", "White Floral"],
    stock: 35,
  },
  {
    name: "High-Waisted Jeans",
    description: "Classic high-waisted jeans with a modern twist. Made from premium denim with just the right amount of stretch.",
    price: 99.99,
    category: "women",
    image: "/images/products/women/jeans.jpg",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Light Wash", "Dark Wash", "Black"],
    stock: 45,
  },
  {
    name: "Cashmere Sweater",
    description: "Luxuriously soft cashmere sweater perfect for cooler weather. Features a classic fit and timeless design.",
    price: 149.99,
    category: "women",
    image: "/images/products/women/sweater.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Cream", "Gray", "Black"],
    stock: 30,
  },

  // Accessories
  {
    name: "Leather Belt",
    description: "Premium leather belt with classic silver buckle. Perfect for both casual and formal wear.",
    price: 49.99,
    category: "accessories",
    image: "/images/products/accessories/belt.jpg",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Brown", "Black"],
    stock: 60,
  },
  {
    name: "Silk Scarf",
    description: "Elegant silk scarf with a beautiful print. Adds a touch of sophistication to any outfit.",
    price: 39.99,
    category: "accessories",
    image: "/images/products/accessories/scarf.jpg",
    sizes: ["M"],
    colors: ["Multicolor", "Blue Pattern", "Red Pattern"],
    stock: 40,
  },
  {
    name: "Leather Wallet",
    description: "Handcrafted leather wallet with multiple card slots and a coin pocket. Made from genuine leather.",
    price: 69.99,
    category: "accessories",
    image: "/images/products/accessories/wallet.jpg",
    sizes: ["M"],
    colors: ["Brown", "Black"],
    stock: 55,
  },
];

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Test User',
    email: 'user@example.com',
    password: 'user123',
    role: 'user',
  },
];

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products
    await Product.insertMany(products);
    console.log('Products seeded successfully');

    // Upsert users (update if exists, insert if doesn't)
    for (const user of users) {
      await User.findOneAndUpdate(
        { email: user.email },
        user,
        { upsert: true, new: true }
      );
    }
    console.log('Users seeded successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed(); 