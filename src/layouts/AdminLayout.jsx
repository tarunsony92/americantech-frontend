import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import {
  HiOutlineViewGrid,
  HiOutlineUsers,
  HiOutlineBookOpen,
  HiOutlineNewspaper,
  HiOutlineBriefcase,
  HiOutlineChatAlt2,
  HiOutlineCog,
  HiOutlinePhotograph,
  HiOutlineClipboardList,
  HiOutlineLogout,
} from "react-icons/hi";
import Sidebar from "../components/Sidebar";

const AdminLayout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
  await dispatch(logoutUser());

  sessionStorage.clear();

  navigate("/", { replace: true });
};
  
  
  const ADMIN_SIDEBAR = [
    { label: "Dashboard", to: "/admin", icon: HiOutlineViewGrid, end: true },
    { label: "Users", to: "/admin/users", icon: HiOutlineUsers },
    { label: "Courses", to: "/admin/courses", icon: HiOutlineBookOpen },
    { label: "Blogs", to: "/admin/blogs", icon: HiOutlineNewspaper },
    { label: "Jobs", to: "/admin/jobs", icon: HiOutlineBriefcase },
    { label: "Testimonials", to: "/admin/testimonials", icon: HiOutlineChatAlt2 },
    { label: "Media Library", to: "/admin/media", icon: HiOutlinePhotograph },
    { label: "Audit Logs", to: "/admin/audit-logs", icon: HiOutlineClipboardList },
    { label: "Settings", to: "/admin/settings", icon: HiOutlineCog },
    { label: "Coupons", to: "/admin/coupons", icon: HiOutlineCog }, // Added Coupons link
    { label: "Contact Queries", to: "/admin/contact-queries", icon: HiOutlineChatAlt2 },
    { label: "Orders", to: "/admin/orders", icon: HiOutlineClipboardList }, // Added Orders link

    // Logout Sidebar Item
    {
      label: "Logout",
      icon: HiOutlineLogout,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[260px_1fr]">
      <div className="border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
        <div className="mb-6 px-2 text-xl font-bold text-primary-700 dark:text-primary-400">
          Admin Panel
        </div>

        <Sidebar items={ADMIN_SIDEBAR} />
      </div>

      <main className="bg-slate-50 p-6 dark:bg-slate-900">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;