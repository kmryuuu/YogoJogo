export interface QuantityButtonProps {
  quantity: number;
  decrement: () => void;
  increment: () => void;
}

const QuantityButton = ({
  quantity,
  decrement,
  increment,
}: QuantityButtonProps) => {
  return (
    <div className="flex items-center overflow-hidden rounded-md border">
      <button
        onClick={decrement}
        className={`flex h-8 w-7 items-center justify-center text-xl ${
          quantity === 1 ? "text-gray-400" : "text-black"
        }`}
        disabled={quantity === 1}
      >
        -
      </button>
      <div className="text-md flex h-8 w-7 items-center justify-center">
        {quantity}
      </div>
      <button
        onClick={increment}
        className="flex h-8 w-7 items-center justify-center text-xl"
      >
        +
      </button>
    </div>
  );
};

export default QuantityButton;
