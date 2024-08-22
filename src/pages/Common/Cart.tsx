import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/Cart/CartItem";
import { Product } from "@/interface/interface";
import AuthContext from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    removeItem,
    updateItemQuantity,
    selectedItems,
    setSelectedItems,
    setCart,
  } = useCart();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    setSelectedItems(cart);
  }, [cart, setSelectedItems]);

  const handleCheckboxChange = (productId: string) => {
    setSelectedItems((prev: Product[]): Product[] =>
      prev.some((item: Product) => item.id === productId)
        ? prev.filter((item: Product) => item.id !== productId)
        : [...prev, cart.find((item: Product) => item.id === productId)!],
    );
  };

  const handleRemove = (productId: string) => {
    removeItem(productId);
  };

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    updateItemQuantity(productId, newQuantity);
  };

  const handleRemoveSelectedItems = async () => {
    const itemsToDeleteIds = selectedItems.map((item: Product) => item.id);

    // 필터링하여 삭제할 항목들을 제외한 새로운 장바구니 생성
    const updatedCart = cart.filter(
      (item: Product) => !itemsToDeleteIds.includes(item.id),
    );

    // Firestore와 로컬 스토리지에서 장바구니 업데이트
    if (user) {
      try {
        await setDoc(doc(db, "carts", user.uid), {
          items: updatedCart,
        });
      } catch (error) {
        console.error("Failed to update cart in Firestore:", error);
      }
    } else {
      // 비로그인 시 장바구니 로컬스토리지 저장
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
    setCart(updatedCart);
    setSelectedItems([]);
  };

  const handleSelectAll = () => {
    setSelectedItems(selectedItems.length === cart.length ? [] : cart);
  };

  const handleCheckOut = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    if (selectedItems.length === 0) {
      alert("선택된 상품이 없습니다.");
      return;
    }
    navigate("/orders/checkout");
  };

  const totalAmount = selectedItems.reduce(
    (acc: number, item: Product) => acc + item.price * item.quantity,
    0,
  );

  return (
    <div className="mx-auto w-full max-w-sm">
      <div>
        <h1 className="mb-14 mt-6 text-2xl">장바구니</h1>
        <div className="my-4 flex">
          <div className="flex w-full items-center justify-between">
            <div className="flex">
              <input
                type="checkbox"
                checked={selectedItems.length === cart.length}
                onChange={handleSelectAll}
                disabled={selectedItems.length === 0}
              />
              <p className="ml-2 text-sm font-semibold">
                전체 선택 ({selectedItems.length}/{cart.length})
              </p>
            </div>
            <button
              className="text-sm font-semibold"
              onClick={handleRemoveSelectedItems}
            >
              선택 삭제
            </button>
          </div>
        </div>
        <hr />
        {cart.map((item: Product) => (
          <CartItem
            key={item.id}
            product={item}
            quantity={item.quantity}
            isChecked={selectedItems.some(
              (selectedItem: Product) => selectedItem.id === item.id,
            )}
            onRemove={() => handleRemove(item.id)}
            onQuantityChange={(newQuantity: number) =>
              handleQuantityChange(item.id, newQuantity)
            }
            onCheckboxChange={() => handleCheckboxChange(item.id)}
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
        <button
          className="button-shape mt-6 bg-primary font-bold text-white"
          onClick={handleCheckOut}
          disabled={selectedItems.length === 0}
        >
          구매하기
        </button>
      </div>
    </div>
  );
};

export default Cart;
