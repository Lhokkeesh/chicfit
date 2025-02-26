'use client';

import ProductForm from '@/components/admin/ProductForm';

export default function NewProductPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Create New Product</h1>
      <ProductForm mode="create" />
    </div>
  );
} 