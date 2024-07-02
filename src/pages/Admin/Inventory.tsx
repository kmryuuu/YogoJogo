import React from "react";
import { Product } from "@/types/types";
import useCollection from "@/hooks/useCollection";

const Inventory: React.FC = () => {
  // product로 변수명 변경
  const { data: products, loading, error } = useCollection<Product>("products");

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="my-12 text-lg">판매중인 상품</h2>
      <div className="flex flex-col justify-center">
        <p>총 {products.length}개</p>
        <div className="flex justify-between">
          <button className="border">선택 삭제</button>
          <button className="border">카테고리 분류</button>
        </div>
        <table className="mt-4 w-full table-auto border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="text-center">
                <input type="checkbox" />
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
                  <input type="checkbox" />
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-4">
                    <img
                      src={product.imageUrl}
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
                  <button className="border px-2 py-1">수정</button>
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
