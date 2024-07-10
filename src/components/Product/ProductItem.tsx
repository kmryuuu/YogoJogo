import { useNavigate } from "react-router-dom";
import { Product } from "@/interface/interface";
import { TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface ProductItemProps {
  product: Product;
  onCheckedItem: (id: string, isChecked: boolean) => void;
  checked: boolean;
}

const ProductItem = ({ product, onCheckedItem, checked }: ProductItemProps) => {
  const navigate = useNavigate();

  return (
    <TableRow key={product.id}>
      <TableCell className="px-4 py-2 text-center align-middle">
        <input
          type="checkbox"
          onChange={(e) => {
            onCheckedItem(product.id, e.target.checked);
          }}
          checked={checked}
        />
      </TableCell>
      <TableCell className="px-4 py-2 align-middle">
        <div className="flex items-center gap-4">
          <img
            src={product.images?.[0] || "/placeholder-image.png"}
            alt={product.title}
            className="h-20 w-20 rounded object-cover"
          />
          <p>{product.title}</p>
        </div>
      </TableCell>
      <TableCell className="px-4 py-2 text-center align-middle">
        {product.category}
      </TableCell>
      <TableCell className="px-4 py-2 text-center align-middle">
        {product.price}원
      </TableCell>
      <TableCell className="px-4 py-2 text-center align-middle">
        {product.quantity}
      </TableCell>
      <TableCell className="px-4 py-2 text-center align-middle">
        <Button
          variant="outline"
          className="border px-2 py-1"
          onClick={() => navigate(`/orders/edit/${product.id}`)}
        >
          수정
        </Button>
      </TableCell>
    </TableRow>
  );
};

export default ProductItem;
