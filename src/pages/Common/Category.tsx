// components/Category.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useInfiniteProducts } from "@/hooks/useProducts";
import { useInView } from "react-intersection-observer";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const categoryData = {
  seasonal: {
    title: "제철 음식",
    description: "지금 바로, 맛있을 때 드셔보세요.",
  },
  fruits: { title: "과일", description: "달콤한 과일을 만나보세요." },
  vegetables: { title: "채소", description: "신선한 채소를 만나보세요." },
  meat: { title: "축산 & 정육", description: "신선한 고기를 만나보세요." },
  seafood: { title: "수산 & 해산", description: "신선한 해산물을 만나보세요." },
};

const Category = () => {
  const { category } = useParams<{ category: string }>();
  const categoryInfo = categoryData[category as keyof typeof categoryData];
  const [sortOption, setSortOption] = useState("newest");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteProducts(category ?? "allproducts", sortOption);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  console.log("Category:", category);
  console.log("Products data:", products);

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  return (
    <div className="mt-10">
      {categoryInfo && (
        <div className="flex w-full flex-col items-start justify-center rounded-md bg-primary px-8 py-6 text-white">
          <h2 className="text-md mb-2">{categoryInfo.title}</h2>
          <p className="text-sm">{categoryInfo.description}</p>
        </div>
      )}
      <div className="mt-4 flex items-center justify-between">
        <span>총 {products.length}개</span>
        <Select onValueChange={handleSortChange}>
          <SelectTrigger className="w-32">
            <span>정렬</span>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">최신순</SelectItem>
            <SelectItem value="lowest">가격 낮은순</SelectItem>
            <SelectItem value="highest">가격 높은순</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-4">
        {products.map((product) => (
          <div key={product.id} className="rounded-md border p-4">
            <img
              src={product.images[0]}
              className="mb-2 h-32 w-full rounded-md object-cover"
            />
            <h3 className="text-sm font-semibold">{product.title}</h3>
            <p className="text-sm">{product.price.toLocaleString("ko-KR")}원</p>
          </div>
        ))}
      </div>
      <div ref={ref} className="loading">
        {isFetchingNextPage && <div>Loading more...</div>}
      </div>
    </div>
  );
};

export default Category;
