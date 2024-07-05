import { useState, useEffect } from "react";
import { Product } from "@/interface/interface";
import useCollection from "@/hooks/useCollection";
import { db } from "@/utils/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Inventory = () => {
  const navigate = useNavigate();
  const {
    data: initialProducts,
    loading,
    error,
  } = useCollection<Product>("products", "createdAt");
  const [products, setProducts] = useState<Product[]>([]);
  const [checkedList, setCheckedList] = useState<string[]>([]);

  // initialProducts가 변경될 때마다 products 상태를 업데이트
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4">Error: {error}</div>;
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
      setProducts(
        products.filter((product) => !checkedList.includes(product.id!)),
      );
      setCheckedList([]);
      alert("선택한 상품이 삭제되었습니다.");
    } catch (error) {
      alert("상품 삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div>
      <h2 className="my-12 text-lg">판매중인 상품</h2>
      <div className="flex flex-col justify-center">
        <p>총 {products.length}개</p>
        <div className="flex justify-between">
          <button className="border" onClick={deleteProduct}>
            선택 삭제
          </button>
          <button className="border">카테고리 분류</button>
        </div>
        <table className="mt-4 w-full table-auto border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-center">
                <input
                  type="checkbox"
                  onChange={(e) => onCheckedAll(e.target.checked)}
                  checked={checkedList.length === products.length}
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
            {products.map((product) => (
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
                  <button
                    className="border px-2 py-1"
                    onClick={() => navigate(`/orders/edit/${product.id}`)}
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
