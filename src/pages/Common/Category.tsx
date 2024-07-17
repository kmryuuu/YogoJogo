import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useInView } from "react-intersection-observer";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useInfiniteProducts } from "@/hooks/useProducts";

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
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteProducts(category ?? "allproducts", sortOption);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  const handleSortChange = (value: string) => {
    setSortOption(value);
  };

  if (isFetching && !isFetchingNextPage) {
    return <div className="p-4">Loading...</div>;
  }

  const sortedProducts = [...products].sort((a, b) => {
    if (sortOption === "lowest") {
      return a.price - b.price;
    } else if (sortOption === "highest") {
      return b.price - a.price;
    } else {
      return 0;
    }
  });

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
      <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
        {sortedProducts.map((product) => (
          <Link to={`/product/${product.id}`}>
            <div key={product.id} className="rounded-md">
              <div className="relative aspect-square w-full">
                <img
                  src={product.images[0]}
                  className="absolute left-0 top-0 h-full w-full rounded-md object-cover"
                />
              </div>
              <h3 className="text-md mb-1 mt-3 font-normal">{product.title}</h3>
              <p className="text-lg font-bold">
                {product.price.toLocaleString("ko-KR")}원
              </p>
            </div>
          </Link>
        ))}
      </div>
      <div ref={ref} className="loading">
        {isFetchingNextPage && <div>Loading more...</div>}
      </div>
    </div>
  );
};

export default Category;
