import QuantityButton from "../Product/QuantityButton";
import { Product } from "@/interface/interface";

interface CartItemProps {
  product: Product;
  quantity: number;
  isChecked: boolean;
  onRemove: () => void;
  onCheckboxChange: () => void;
  onQuantityChange: (newQuantity: number) => void;
}

const CartItem = ({
  product,
  quantity,
  isChecked,
  onRemove,
  onCheckboxChange,
  onQuantityChange,
}: CartItemProps) => {
  const increment = () => {
    onQuantityChange(quantity + 1);
  };

  const decrement = () => {
    onQuantityChange(quantity > 1 ? quantity - 1 : 1);
  };

  return (
    <div className="relative mt-6 flex w-full">
      <div>
        <input
          type="checkbox"
          checked={isChecked}
          onChange={onCheckboxChange}
        />
      </div>
      <div className="ml-2 flex flex-col">
        <div className="mb-3">
          <h2 className="text-lg font-normal">{product.title}</h2>
          <button className="absolute right-0 top-0" onClick={onRemove}>
            X
          </button>
        </div>
        <div className="flex">
          <img
            src={product.images[0]}
            className="h-20 w-20 rounded-md object-cover"
          />
          <div className="ml-4 flex h-20 flex-col">
            <p className="mb-5 text-lg font-bold">
              {Number(product.price).toLocaleString()}원
            </p>
            <QuantityButton
              quantity={quantity}
              increment={increment}
              decrement={decrement}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
