import { Link } from "react-router-dom";
import IconArrowRight from "@/assets/icons/icon-arrow-right.svg";

interface AdminMenuitemsProps {
  title: string;
  to: string;
}

const AdminMenuitems = ({ title, to }: AdminMenuitemsProps) => {
  return (
    <Link to={to}>
      <div className="mt-6 flex w-full items-center justify-between border-b-2 pb-3">
        <p className="font-medium">{title}</p>
        <IconArrowRight />
      </div>
    </Link>
  );
};

export default AdminMenuitems;
