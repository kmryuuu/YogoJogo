import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts, FetchProductsResult } from "@/services/productService";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export const useInfiniteProducts = (category: string, sortOption: string) => {
  return useInfiniteQuery<FetchProductsResult, Error>({
    queryKey: ["products", category, sortOption],
    queryFn: ({ pageParam }) =>
      fetchProducts({
        category,
        sortOption,
        pageParam: pageParam as QueryDocumentSnapshot<DocumentData> | null,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
