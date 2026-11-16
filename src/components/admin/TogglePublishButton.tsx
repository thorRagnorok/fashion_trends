"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function TogglePublishButton({
  productId,
  isPublished,
}: {
  productId: string;
  isPublished: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("products")
      .update({ is_published: !isPublished })
      .eq("id", productId);
    setLoading(false);
    if (error) {
      alert(error.message);
      return;
    }
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={loading}
      className="text-sm font-medium text-stone-700 hover:text-stone-900 disabled:opacity-50"
    >
      {loading ? "…" : isPublished ? "Unpublish" : "Publish"}
    </button>
  );
}