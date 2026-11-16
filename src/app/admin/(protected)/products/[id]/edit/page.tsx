import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { getProductById } from "@/lib/products";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id, { admin: true });
  if (!product) notFound();

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-stone-900">Edit product</h2>
      <ProductForm
        mode="edit"
        product={product}
        extraImages={product.product_images}
      />
    </div>
  );
}