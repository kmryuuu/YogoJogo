import { Product } from "@/types/types";
import useCollection from "@/hooks/useCollection";

const Inventory = () => {
  const { data: products, loading, error } = useCollection<Product>("products");

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  if (error) {
    return <div className="p-4">Error: {error}</div>;
  }

  return (
    <div>
      <h2>판매중인 상품</h2>
      <p>총 {products.length}개</p>
      <button className="border">선택 삭제</button>
      <button className="border">카테고리 분류</button>
      {products.map((product) => (
        <div key={product.id} className="flex gap-10">
          <img src={product.imageUrl} alt={product.title} />
          <p>{product.title}</p>
          <p>{product.category}</p>
          <p>{product.price}원</p>
          <p>{product.quantity}</p>
          <button className="border">수정</button>
        </div>
      ))}
    </div>
  );
};

export default Inventory;
