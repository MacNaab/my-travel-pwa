"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    if (navigator.language === "fr") {
      redirect("/fr");
    } else {
      redirect("/es");
    }
  }, []);

  return (
    <div className="w-full h-full flex gap-4 items-center justify-center">
      <div className="w-8 h-8 bg-gray-600 dark:bg-gray-300 animate-pulse rounded-full"></div>
      <div className="w-10 h-10 bg-gray-600 dark:bg-gray-300 animate-pulse rounded-full"></div>
      <div className="w-12 h-12 bg-gray-600 dark:bg-gray-300 animate-pulse rounded-full"></div>
    </div>
  );
}
