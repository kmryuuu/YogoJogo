import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  getCart,
  addToCart as addProductToCart,
  removeFromCart as removeProductFromCart,
  updateCartQuantity as updateProductQuantity,
} from "@/services/cartService";
import { Product } from "@/interface/interface";
import useAuth from "@/hooks/useAuth";

interface CartProviderProps {
  children: ReactNode;
}

interface CartContextType {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, newQuantity: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: CartProviderProps) => {
  const { user } = useAuth();
  const userId = user?.uid;
  const [cart, setCart] = useState<Product[]>(() => {
    const localData = localStorage.getItem("cart");
    return localData ? JSON.parse(localData) : [];
  });

  useEffect(() => {
    if (userId) {
      const fetchCart = async () => {
        const cartData = await getCart({ userId });
        setCart(cartData.items);
      };
      fetchCart();
    }
  }, [userId]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = async (product: Product) => {
    if (userId) {
      await addProductToCart({ userId, product });
    }
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id,
      );
      if (existingProductIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex].quantity += product.quantity;
        return updatedCart;
      }
      return [...prevCart, product];
    });
  };

  const removeFromCart = async (productId: string) => {
    if (userId) {
      await removeProductFromCart({ userId, productId });
    }
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = async (productId: string, newQuantity: number) => {
    if (userId) {
      await updateProductQuantity({ userId, productId, quantity: newQuantity });
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item,
      ),
    );
  };

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateCartQuantity }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
