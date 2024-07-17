import CartItem from "@/components/Cart/CartItem";
import { useCart } from "@/context/CartContext";

const Cart = () => {
  const { cart, removeFromCart, updateCartQuantity } = useCart();

  const handleRemove = (productId: string) => {
    removeFromCart(productId);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateCartQuantity(productId, newQuantity);
  };

  const totalAmount = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="mx-auto w-full max-w-sm">
      <div>
        <h1 className="mb-14 mt-6 text-2xl">장바구니</h1>
        <div className="my-4 flex">
          <div className="flex w-full items-center justify-between">
            <div className="flex">
              <input type="checkbox" />
              <p className="ml-2 text-sm font-semibold">
                전체 선택 ({cart.length}/{cart.length})
              </p>
            </div>
            <button className="text-sm font-semibold">선택 삭제</button>
          </div>
        </div>
        <hr />
        {cart.map((item) => (
          <CartItem
            key={item.id}
            product={item}
            quantity={item.quantity}
            onRemove={() => handleRemove(item.id)}
            onQuantityChange={(newQuantity) =>
              handleQuantityChange(item.id, newQuantity)
            }
          />
        ))}
      </div>
      <div className="mt-12 flex flex-col gap-2">
        <div className="flex justify-between">
          <p>상품 금액</p>
          <div className="flex items-center">
            <p className="text-lg">{totalAmount.toLocaleString()}</p>
            <p className="ml-1 text-sm">원</p>
          </div>
        </div>
        <div className="flex justify-between">
          <p>배송비</p>
          <div className="flex items-center">
            <p className="text-lg">+ 0</p>
            <p className="ml-1 text-sm">원</p>
          </div>
        </div>
        <div className="flex justify-between">
          <p>결제 금액</p>
          <div className="flex items-center">
            <p className="text-lg font-extrabold">
              {totalAmount.toLocaleString()}
            </p>
            <p className="ml-1 text-sm">원</p>
          </div>
        </div>
        <button className="button-shape mt-6 bg-primary font-bold text-white">
          구매하기
        </button>
      </div>
    </div>
  );
};

export default Cart;
