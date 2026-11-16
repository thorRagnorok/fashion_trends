"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  PLATFORM_LABELS,
  PRODUCT_CATEGORIES,
  PRODUCT_TAGS,
  SHOPPING_PLATFORMS,
  STORAGE_BUCKET,
} from "@/lib/constants";
import type { Product, ProductImage, ProductTag, ShoppingPlatform } from "@/lib/types";

type FormState = {
  name: string;
  brand: string;
  category: string;
  description: string;
  image_url: string;
  affiliate_url: string;
  platform: ShoppingPlatform;
  tag: ProductTag | "";
  is_published: boolean;
};

type Props = {
  product?: Product;
  extraImages?: ProductImage[];
  mode: "create" | "edit";
};

async function uploadImage(file: File, supabase: ReturnType<typeof createClient>) {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(STORAGE_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function ProductForm({ product, extraImages = [], mode }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => {
    if (typeof window === "undefined") return null;
    return createClient();
  }, []);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    name: product?.name ?? "",
    brand: product?.brand ?? "",
    category: product?.category ?? PRODUCT_CATEGORIES[0],
    description: product?.description ?? "",
    image_url: product?.image_url ?? "",
    affiliate_url: product?.affiliate_url ?? "",
    platform: product?.platform ?? "myntra",
    tag: product?.tag ?? "",
    is_published: product?.is_published ?? false,
  });

  const [primaryFile, setPrimaryFile] = useState<File | null>(null);
  const [extraFiles, setExtraFiles] = useState<File[]>([]);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!supabase) {
        throw new Error("Supabase is not configured.");
      }
      let imageUrl = form.image_url;
      if (primaryFile) {
        imageUrl = await uploadImage(primaryFile, supabase);
      }
      if (!imageUrl) {
        throw new Error("A primary product image is required.");
      }

      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        category: form.category,
        description: form.description.trim(),
        image_url: imageUrl,
        affiliate_url: form.affiliate_url.trim(),
        platform: form.platform,
        tag: form.tag || null,
        is_published: form.is_published,
      };

      let productId = product?.id;

      if (mode === "create") {
        const { data, error: insertError } = await supabase
          .from("products")
          .insert(payload)
          .select("id")
          .single();
        if (insertError) throw insertError;
        productId = data.id;
      } else if (productId) {
        const { error: updateError } = await supabase
          .from("products")
          .update(payload)
          .eq("id", productId);
        if (updateError) throw updateError;
      }

      if (!productId) throw new Error("Missing product id");

      if (extraFiles.length > 0) {
        const startOrder = extraImages.length;
        const rows: { product_id: string; image_url: string; sort_order: number }[] = [];
        for (let i = 0; i < extraFiles.length; i++) {
          const url = await uploadImage(extraFiles[i], supabase);
          rows.push({
            product_id: productId,
            image_url: url,
            sort_order: startOrder + i,
          });
        }
        const { error: imgError } = await supabase.from("product_images").insert(rows);
        if (imgError) throw imgError;
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-2xl space-y-6">
      {error ? (
        <p className="rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      ) : null}

      <Field label="Product name">
        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="field-input"
        />
      </Field>

      <Field label="Brand">
        <input
          required
          value={form.brand}
          onChange={(e) => update("brand", e.target.value)}
          className="field-input"
        />
      </Field>

      <Field label="Category">
        <select
          value={form.category}
          onChange={(e) => update("category", e.target.value)}
          className="field-input"
        >
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Description">
        <textarea
          required
          rows={5}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="field-input resize-y"
        />
      </Field>

      <Field label="Primary image">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setPrimaryFile(e.target.files?.[0] ?? null)}
          className="field-input file:mr-3 file:border-0 file:bg-stone-900 file:px-3 file:py-1.5 file:text-sm file:text-white"
        />
        {form.image_url && !primaryFile ? (
          <p className="mt-1 text-xs text-stone-500">Current image kept unless you upload a new one.</p>
        ) : null}
      </Field>

      <Field label="Additional images (optional)">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setExtraFiles(Array.from(e.target.files ?? []))}
          className="field-input file:mr-3 file:border-0 file:bg-stone-100 file:px-3 file:py-1.5 file:text-sm"
        />
      </Field>

      <Field label="Shopping platform">
        <select
          value={form.platform}
          onChange={(e) => update("platform", e.target.value as ShoppingPlatform)}
          className="field-input"
        >
          {SHOPPING_PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Affiliate URL">
        <input
          required
          type="url"
          value={form.affiliate_url}
          onChange={(e) => update("affiliate_url", e.target.value)}
          placeholder="https://..."
          className="field-input"
        />
      </Field>

      <Field label="Tag (optional)">
        <select
          value={form.tag}
          onChange={(e) => update("tag", e.target.value as FormState["tag"])}
          className="field-input"
        >
          <option value="">None</option>
          {PRODUCT_TAGS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <label className="flex items-center gap-2 text-sm text-stone-700">
        <input
          type="checkbox"
          checked={form.is_published}
          onChange={(e) => update("is_published", e.target.checked)}
          className="h-4 w-4 rounded border-stone-300"
        />
        Publish product (visible on Trending feed)
      </label>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="rounded-sm bg-stone-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {saving ? "Saving…" : mode === "create" ? "Create product" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-sm border border-stone-300 px-6 py-2.5 text-sm text-stone-700 hover:bg-stone-50"
        >
          Cancel
        </button>
      </div>

      {product ? (
        <p className="text-xs text-stone-400">
          Platform: {PLATFORM_LABELS[product.platform]} · ID {product.id.slice(0, 8)}…
        </p>
      ) : null}
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-stone-800">{label}</label>
      {children}
    </div>
  );
}