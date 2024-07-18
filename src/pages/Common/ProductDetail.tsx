import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getProduct } from "@/services/productService";
import { Product } from "@/interface/interface";
import QuantityButton from "@/components/Product/QuantityButton";
import { useCart } from "@/context/CartContext";

const ProductDetail = () => {
  const { id } = useParams<{ id?: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        try {
          const fetchedProduct = await getProduct(id);
          setProduct(fetchedProduct);
        } catch (error) {
          console.error("Error fetching product:", error);
        }
      }
    };

    fetchProduct();
  }, [id]);

  const increment = () => {
    setQuantity((currentValue) => currentValue + 1);
  };

  const decrement = () => {
    setQuantity((currentValue) => (currentValue > 1 ? currentValue - 1 : 1));
  };

  const handleAddToCart = () => {
    if (product) {
      addItem({ ...product, quantity });
      alert("상품이 장바구니에 추가되었습니다.");
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const productPrice =
    typeof product.price === "string"
      ? parseFloat((product.price as string).replace(/,/g, ""))
      : product.price;

  return (
    <div className="product-img-height mt-12 flex">
      {product && (
        <>
          <img
            src={product.images[0]}
            className="product-img-width rounded-md object-cover"
            alt={product.title}
          />
          <div className="ml-14 flex flex-1 flex-col justify-between">
            <div>
              <h2 className="text-2xl font-medium">{product.title}</h2>
              <p className="mt-2 text-2xl font-extrabold">
                {productPrice.toLocaleString()}원
              </p>
            </div>
            <div className="mt-60 flex flex-col justify-between">
              <hr />
              <div className="my-6 flex w-full items-center justify-between">
                <div className="flex items-center">
                  <p className="text-md">수량/합계</p>
                  <div className="ml-4">
                    <QuantityButton
                      quantity={quantity}
                      increment={increment}
                      decrement={decrement}
                    />
                  </div>
                </div>
                <div className="flex items-center">
                  <p className="text-md">총</p>
                  <p className="ml-2 text-2xl font-extrabold">
                    {(productPrice * quantity).toLocaleString()}원
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-between gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full rounded-md border-primary py-4 text-lg font-bold text-primary"
              >
                장바구니
              </button>
              <button className="w-full rounded-md bg-primary py-4 text-lg font-bold text-white">
                바로구매
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDetail;
