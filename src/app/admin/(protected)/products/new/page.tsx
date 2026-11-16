import { ProductForm } from "@/components/admin/ProductForm";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-semibold text-stone-900">Add product</h2>
      <ProductForm mode="create" />
    </div>
  );
}