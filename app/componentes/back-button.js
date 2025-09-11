"use client";

import { useRouter, usePathname } from "next/navigation";
import { IoMdArrowBack } from "react-icons/io";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/"); // fallback to home
    }
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-200 text-gray-800 rounded-lg transition back-button cursor-pointer"
    >
      <IoMdArrowBack className="text-3xl back-arrow" />
    </button>
  );
}
