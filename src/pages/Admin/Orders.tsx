import DashBoard from "@/components/Admin/DashBoard";
import { Outlet } from "react-router-dom";

const Orders = () => {
  return (
    <div className="flex min-h-screen">
      <div className="fixed left-0 top-0 h-full w-1/5 bg-slate-50">
        <DashBoard />
      </div>
      <div className="ml-[20%] w-4/5 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Orders;
