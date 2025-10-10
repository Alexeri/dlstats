"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTopLoader } from "nextjs-toploader";


export const useUpdateSearchParams = () => {
  const loader = useTopLoader();
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);

    //Start Loader
    loader.start();

    // Update the URL
    router.push(`?${params.toString()}`);
  };

  const removeSearchParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(key);

    //Start Loader
    loader.start();

    // Update the URL
    router.push(`?${params.toString()}`);
  };

  const clearAllParams = () => {
    //Start Loader
    loader.start();

    // Clear all parameters
    router.push("?");
  };

  return { updateSearchParam, removeSearchParam, clearAllParams };
};
