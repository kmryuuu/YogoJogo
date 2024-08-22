import { useState, useEffect } from "react";
import { db } from "@/utils/firebase";
import { deleteDoc, doc } from "firebase/firestore";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCaption,
} from "@/components/ui/table";
import ProductItem from "@/components/Product/ProductItem";

const categoriesList = [
  { id: "allproducts", name: "전체 상품" },
  { id: "seasonal", name: "제철 음식" },
  { id: "fruits", name: "과일" },
  { id: "vegetables", name: "채소" },
  { id: "meat", name: "축산 ・ 정육" },
  { id: "seafood", name: "수산 ・ 해산" },
];

const ProductList = () => {
  const [category, setCategory] = useState("allproducts");
  const sortOption = "newest";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isFetching,
    refetch,
  } = useInfiniteProducts(category, sortOption);

  const [checkedList, setCheckedList] = useState<string[]>([]);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    refetch();
  }, [category, refetch]);

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

  // 영어로 저장된 카테고리를 한글로 표시
  const getCategoryName = (categoryId: any) => {
    const category = categoriesList.find((item) => item.id === categoryId);
    return category ? category.name : categoryId;
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
                {categoriesList.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table className="mt-4">
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead className="text-center">
                <input
                  type="checkbox"
                  onChange={(e) => onCheckedAll(e.target.checked)}
                  checked={
                    products.length > 0 &&
                    checkedList.length === products.length
                  }
                />
              </TableHead>
              <TableHead className="px-4 py-2 text-center">상품 정보</TableHead>
              <TableHead className="px-4 py-2 text-center">분류</TableHead>
              <TableHead className="px-4 py-2 text-center">판매가</TableHead>
              <TableHead className="px-4 py-2 text-center">수량</TableHead>
              <TableHead className="px-4 py-2 text-center">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableCaption className="my-8">
            판매중인 상품 목록입니다.
          </TableCaption>
          <TableBody>
            {products.length > 0 ? (
              products.map((product) => (
                <ProductItem
                  key={product.id}
                  product={product}
                  onCheckedItem={onCheckedItem}
                  checked={checkedList.includes(product.id)}
                  categoryName={getCategoryName(product.category)}
                />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="px-4 py-2 text-center">
                  <p className="mt-6">판매중인 상품이 없습니다.</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div ref={ref} className="loading">
          {isFetchingNextPage && <div>"Loading more..."</div>}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
