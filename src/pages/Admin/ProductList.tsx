// pages/Admin/ProductList.tsx

import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useInfiniteProducts } from "@/hooks/useProducts";
import { useInView } from "react-intersection-observer";
import { FetchProductsResult } from "@/services/productService";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const categories = [
  { id: "allproducts", name: "전체 상품" },
  { id: "seasonal", name: "제철 음식" },
  { id: "fruits", name: "과일" },
  { id: "vegetables", name: "채소" },
  { id: "meat", name: "축산 ・ 정육" },
  { id: "seafood", name: "수산 ・ 해산" },
];

const ProductList = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("allproducts");
  const sortOption = "newest"; // 기본 정렬 옵션
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteProducts(category, sortOption);

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const products =
    data?.pages.flatMap((page: FetchProductsResult) => page.products) ?? [];

  if (isFetching && !isFetchingNextPage) {
    return <div className="p-4">Loading...</div>;
  }

  // 상품 개별 선택
  const onCheckedItem = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setCheckedList((prev) => [...prev, id]);
    } else {
      setCheckedList((prev) => prev.filter((item) => item !== id));
    }
  };

  // 상품 전체 선택
  const onCheckedAll = (isChecked: boolean) => {
    if (isChecked) {
      const allProductIds = products.map((product) => product.id);
      setCheckedList(allProductIds);
    } else {
      setCheckedList([]);
    }
  };

  // 상품 삭제
  const deleteProduct = async () => {
    try {
      const deletePromises = checkedList.map(async (productId) => {
        const productRef = doc(db, "products", productId);
        await deleteDoc(productRef);
      });

      await Promise.all(deletePromises);
      // 삭제되지 않은 리스트 상태 업데이트
      setCheckedList([]);
      alert("선택한 상품이 삭제되었습니다.");
    } catch (error) {
      alert("상품 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 카테고리 변경
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  return (
    <div className="px-12">
      <h2 className="my-12 text-lg">판매중인 상품</h2>
      <div className="flex flex-col justify-center">
        <p>총 {products.length}개</p>
        <div className="mt-4 flex justify-between">
          <Button variant="outline" onClick={deleteProduct}>
            선택 삭제
          </Button>
          <div>
            <Select onValueChange={handleCategoryChange}>
              <SelectTrigger className="border px-4 py-2">
                <span>카테고리 분류</span>
              </SelectTrigger>
              <SelectContent>
                {categories.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <table className="mt-4 w-full table-auto border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-center">
                <input
                  type="checkbox"
                  onChange={(e) => onCheckedAll(e.target.checked)}
                  checked={
                    products.length > 0 &&
                    checkedList.length === products.length
                  }
                />
              </th>
              <th className="px-4 py-2">상품 정보</th>
              <th className="px-4 py-2">분류</th>
              <th className="px-4 py-2">판매가</th>
              <th className="px-4 py-2">수량</th>
              <th className="px-4 py-2">관리</th>
            </tr>
          </thead>
          <tbody>
            {products.length ? (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2 text-center">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        onCheckedItem(product.id, e.target.checked);
                      }}
                      checked={checkedList.includes(product.id)}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-4">
                      <img
                        src={product.images?.[0] || "/placeholder-image.png"}
                        alt={product.title}
                        className="h-20 w-20 rounded object-cover"
                      />
                      <p>{product.title}</p>
                    </div>
                  </td>
                  <td className="px-4 py-2 text-center">{product.category}</td>
                  <td className="px-4 py-2 text-center">{product.price}원</td>
                  <td className="px-4 py-2 text-center">{product.quantity}</td>
                  <td className="px-4 py-2 text-center">
                    <Button
                      variant="outline"
                      className="border px-3 py-1"
                      onClick={() => navigate(`/orders/edit/${product.id}`)}
                    >
                      수정
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-2 text-center">
                  <p className="mt-6">판매중인 상품이 없습니다.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div ref={ref} className="loading">
          {isFetchingNextPage && <div>"Loading more..."</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
