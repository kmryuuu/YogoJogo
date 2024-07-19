import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/utils/firebase";
import { Product, UserInfo } from "@/interface/interface";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateCartQuantity,
} from "@/services/cartService";

export interface CartContextProps {
  cart: Product[];
  addItem: (item: Product) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
}
interface CartProviderProps {
  children: ReactNode;
}
const CartContext = createContext<CartContextProps | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Product[]>([]);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    const storedCart = JSON.parse(
      localStorage.getItem("cart") || "[]",
    ) as Product[];
    if (storedCart) {
      setCart(storedCart);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as UserInfo;
          setUser({
            uid: currentUser.uid,
            name: userData.name,
            email: currentUser.email,
            isAdmin: userData.isAdmin,
            createdAt: userData.createdAt,
          });

          // 로컬스토리지와 Firestore 데이터 병합
          const cartData = await getCart(currentUser.uid);
          const storedCart = JSON.parse(
            localStorage.getItem("cart") || "[]",
          ) as Product[];

          const mergedCart = [...new Set([...cartData, ...storedCart])];

          setCart(mergedCart);

          await setDoc(doc(db, "carts", currentUser.uid), {
            items: mergedCart,
          });

          localStorage.removeItem("cart");
        }
      } else {
        setUser(null);
        setCart([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const addItem = async (item: Product) => {
    if (user) {
      await addToCart(user.uid, item);
      const updatedCart = await getCart(user.uid);
      setCart(updatedCart);
    } else {
      const updatedCart = [...cart, item];
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const removeItem = async (itemId: string) => {
    if (user) {
      await removeFromCart(user.uid, itemId);
      const updatedCart = await getCart(user.uid);
      setCart(updatedCart);
    } else {
      const updatedCart = cart.filter((item) => item.id !== itemId);
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  const updateItemQuantity = async (productId: string, quantity: number) => {
    if (user) {
      await updateCartQuantity(user.uid, productId, quantity);
      const updatedCart = await getCart(user.uid);
      setCart(updatedCart);
    } else {
      const updatedCart = cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item,
      );
      setCart(updatedCart);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeItem,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
