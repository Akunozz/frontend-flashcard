"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <span
      className="flex items-center text-primary"
      onClick={() => router.back()}
    >
      <ChevronLeft />
      Voltar
    </span>
  );
}
