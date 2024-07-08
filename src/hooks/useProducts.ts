import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchProducts, FetchProductsResult } from "@/services/productService";
import { QueryDocumentSnapshot, DocumentData } from "firebase/firestore";

export const useInfiniteProducts = () => {
  return useInfiniteQuery<FetchProductsResult, Error>({
    queryKey: ["products"],
    queryFn: ({ pageParam }) =>
      fetchProducts({
        pageParam: pageParam as QueryDocumentSnapshot<DocumentData> | null,
      }),
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
