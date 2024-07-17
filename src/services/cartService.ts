import { db } from "@/utils/firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Product } from "@/interface/interface";

interface CartAction {
  userId: string;
  product?: Product;
  productId?: string;
  quantity?: number;
}

export const getCart = async ({
  userId,
}: {
  userId: string;
}): Promise<{ items: Product[] }> => {
  const cartDoc = doc(db, "carts", userId);
  const cartSnapshot = await getDoc(cartDoc);
  if (cartSnapshot.exists()) {
    const cartData = cartSnapshot.data() as { items: any[] };
    return {
      items: cartData.items.map((item: any) => ({ ...item, id: item.id })),
    };
  } else {
    await setDoc(cartDoc, { items: [] });
    return { items: [] };
  }
};

export const addToCart = async ({
  userId,
  product,
}: CartAction): Promise<void> => {
  if (!product) throw new Error("Product is required");

  const cartDoc = doc(db, "carts", userId);
  const cartSnapshot = await getDoc(cartDoc);

  let items = [];
  if (cartSnapshot.exists()) {
    items = cartSnapshot.data().items;
  }

  const existingProductIndex = items.findIndex(
    (item: Product) => item.id === product.id,
  );

  if (existingProductIndex !== -1) {
    items[existingProductIndex].quantity += product.quantity;
  } else {
    items.push(product);
  }

  await setDoc(cartDoc, { items }, { merge: true });
};

export const removeFromCart = async ({
  userId,
  productId,
}: CartAction): Promise<void> => {
  if (!productId) throw new Error("Product ID is required");

  const cartDoc = doc(db, "carts", userId);
  const cartSnapshot = await getDoc(cartDoc);

  if (cartSnapshot.exists()) {
    const updatedItems = cartSnapshot
      .data()
      .items.filter((item: Product) => item.id !== productId);
    await updateDoc(cartDoc, { items: updatedItems });
  }
};

export const updateCartQuantity = async ({
  userId,
  productId,
  quantity,
}: {
  userId: string;
  productId: string;
  quantity: number;
}): Promise<void> => {
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
