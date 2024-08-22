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
  selectedItems: Product[];
  setSelectedItems: React.Dispatch<React.SetStateAction<Product[]>>;
  addItem: (item: Product) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  updateItemQuantity: (productId: string, quantity: number) => Promise<void>;
  setCart: (items: Product[]) => void;
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
  const [selectedItems, setSelectedItems] = useState<Product[]>([]);

  useEffect(() => {
    const mergeCarts = (
      cartFromFirestore: Product[],
      cartFromLocalStorage: Product[],
    ) => {
      const mergedCart: Product[] = [...cartFromFirestore];

      cartFromLocalStorage.forEach((localItem) => {
        const existingItem = mergedCart.find(
          (item) => item.id === localItem.id,
        );

        if (existingItem) {
          // 동일한 상품이 있으면 수량 합산
          existingItem.quantity += localItem.quantity;
        } else {
          // 중복되지 않은 상품은 그대로 추가
          mergedCart.push(localItem);
        }
      });

      return mergedCart;
    };

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

          const cartData = await getCart(currentUser.uid);
          const storedCart = JSON.parse(
            localStorage.getItem("cart") || "[]",
          ) as Product[];

          // 병합된 장바구니 생성
          const mergedCart = mergeCarts(cartData, storedCart);

          // 병합된 장바구니 Firestore에 저장
          await setDoc(doc(db, "carts", currentUser.uid), {
            items: mergedCart,
          });

          // 로컬 상태와 Firestore 업데이트
          setCart(mergedCart);

          // 로컬 스토리지 초기화
          localStorage.removeItem("cart");
        }
      } else {
        setUser(null);
        setCart([]);
      }
    });

    // 클린업 함수
    // 컴포넌트가 언마운트되거나, 필요 없어질 때 리스너 해제
    return () => unsubscribe();
  }, [setCart]);

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
        setCart,
        selectedItems,
        setSelectedItems,
        addItem,
        removeItem,
        updateItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
