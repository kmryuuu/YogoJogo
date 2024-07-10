import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import IconArrowRight from "@/assets/icons/icon-arrow-right.svg";

interface AdminMenuitemsProps {
  title: string;
  to: string;
}

const AdminMenuitems = ({ title, to }: AdminMenuitemsProps) => {
  return (
    <Link to={to} className="mt-6 block">
      <Button
        variant="ghost"
        className="flex w-full items-center justify-between p-3"
      >
        <p className="font-medium">{title}</p>
        <IconArrowRight />
      </Button>
    </Link>
  );
};

export default AdminMenuitems;
