import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  HiOutlineHome,
  HiOutlineBookOpen,
  HiOutlineDocumentText,
  HiOutlineUserCircle,
  HiOutlineBadgeCheck,
} from "react-icons/hi";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { logoutUser } from "../redux/slices/authSlice";

const DashboardLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      // ignore - authSlice already clears local session
      console.error(err);
    } finally {
      navigate("/login", { replace: true });
    }
  };

  const SIDEBAR_ITEMS = [
    {
      label: "Overview",
      to: "/dashboard",
      icon: HiOutlineHome,
      end: true,
    },
    {
      label: "My Courses",
      to: "/dashboard/courses",
      icon: HiOutlineBookOpen,
    },
    {
      label: "Certificates",
      to: "/dashboard/certificates",
      icon: HiOutlineBadgeCheck,
    },
    // {
    //   label: "Applications",
    //   to: "/dashboard/applications",
    //   icon: HiOutlineDocumentText,
    // },
    {
      label: "Profile",
      to: "/dashboard/profile",
      icon: HiOutlineUserCircle,
    },
    {
      label: "Logout",
      to: "/home",
      icon: HiOutlineUserCircle,
      onClick: handleLogout,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="container-page grid flex-1 grid-cols-1 gap-6 py-8 lg:grid-cols-[240px_1fr]">
        <Sidebar items={SIDEBAR_ITEMS} />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;