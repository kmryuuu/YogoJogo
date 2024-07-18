import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Product } from "@/interface/interface";

// 장바구니 데이터 가져오기
export const getCart = async (userId: string): Promise<Product[]> => {
  const cartDoc = doc(db, "carts", userId);
  const cartSnapshot = await getDoc(cartDoc);
  if (cartSnapshot.exists()) {
    const cartData = cartSnapshot.data() as { items: Product[] };
    return cartData.items;
  } else {
    await setDoc(cartDoc, { items: [] });
    return [];
  }
};

// 장바구니에 상품 추가
export const addToCart = async (
  userId: string,
  product: Product,
): Promise<void> => {
  const cartDoc = doc(db, "carts", userId);
  const cartSnapshot = await getDoc(cartDoc);

  let items: Product[] = [];
  if (cartSnapshot.exists()) {
    items = cartSnapshot.data().items;
  }

  const existingProductIndex = items.findIndex(
    (item) => item.id === product.id,
  );

  if (existingProductIndex !== -1) {
    items[existingProductIndex].quantity += product.quantity;
  } else {
    items.push(product);
  }

  await setDoc(cartDoc, { items }, { merge: true });
};

// 장바구니에서 상품 제거
export const removeFromCart = async (
  userId: string,
  productId: string,
): Promise<void> => {
  const cartDoc = doc(db, "carts", userId);
  const cartSnapshot = await getDoc(cartDoc);

  if (cartSnapshot.exists()) {
    const updatedItems = cartSnapshot
      .data()
      .items.filter((item: Product) => item.id !== productId);
    await updateDoc(cartDoc, { items: updatedItems });
  }
};

// 장바구니 상품 수량 업데이트
export const updateCartQuantity = async (
  userId: string,
  productId: string,
  quantity: number,
): Promise<void> => {
  const cartDoc = doc(db, "carts", userId);
  const cartSnapshot = await getDoc(cartDoc);

  if (cartSnapshot.exists()) {
    const items = cartSnapshot.data().items.map((item: Product) => {
      if (item.id === productId) {
        return { ...item, quantity };
      }
      return item;
    });
    await updateDoc(cartDoc, { items });
  }
};
