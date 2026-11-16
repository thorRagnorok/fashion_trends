import { TAG_LABELS } from "@/lib/constants";
import type { ProductTag } from "@/lib/types";

export function ProductTagBadge({ tag }: { tag: ProductTag }) {
  return (
    <span className="inline-flex items-center rounded-full bg-stone-900 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-stone-50">
      {TAG_LABELS[tag]}
    </span>
  );
}