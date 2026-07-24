import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { HelmetProvider } from "react-helmet-async";
import store from "./redux/store";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// Public pages — lazy loaded for code splitting
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetails = lazy(() => import("./pages/CourseDetails"));
const Certifications = lazy(() => import("./pages/Certifications"));
const Careers = lazy(() => import("./pages/Careers"));
const JobDetails = lazy(() => import("./pages/JobDetails"));
const ApplyJob = lazy(() => import("./pages/ApplyJob"));
const SuccessStories = lazy(() => import("./pages/SuccessStories"));
const Testimonials = lazy(() => import("./pages/Testimonials"));
const HiringPartners = lazy(() => import("./pages/HiringPartners"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Events = lazy(() => import("./pages/Events"));
const Faq = lazy(() => import("./pages/Faq"));
const Contact = lazy(() => import("./pages/Contact"));
const NotFound = lazy(() => import("./pages/NotFound"));
const TermsAndConditions = lazy(() => import("./pages/t&c"));

// Auth pages
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const AdminLogin = lazy(() => import("./pages/auth/AdminLogin"));

// Student dashboard pages
const Overview = lazy(() => import("./pages/dashboard/Overview"));
const MyCourses = lazy(() => import("./pages/dashboard/MyCourses"));
const MyCertificates = lazy(() => import("./pages/dashboard/MyCertificates"));
const MyApplications = lazy(() => import("./pages/dashboard/MyApplications"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const ManageUsers = lazy(() => import("./pages/admin/ManageUsers"));
const ManageCourses = lazy(() => import("./pages/admin/ManageCourses"));
const ManageBlogs = lazy(() => import("./pages/admin/ManageBlogs"));
const ManageJobs = lazy(() => import("./pages/admin/ManageJobs"));
const ManageApplications = lazy(() => import("./pages/admin/ManageApplications"));
const ManageTestimonials = lazy(() => import("./pages/admin/ManageTestimonials"));
const ManagePartners = lazy(() => import("./pages/admin/ManagePartners"));
const ManageStudents = lazy(() => import("./pages/admin/ManageStudents"));
const ManageInstructors = lazy(() => import("./pages/admin/ManageInstructors"));
const ManageEvents = lazy(() => import("./pages/admin/ManageEvents"));
const ManageFaq = lazy(() => import("./pages/admin/ManageFaq"));
const ManageContactQueries = lazy(() => import("./pages/admin/ManageContactQueries"));
const ManageNewsletters = lazy(() => import("./pages/admin/ManageNewsletters"));
const MediaLibrary = lazy(() => import("./pages/admin/MediaLibrary"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"));

const PageFallback = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-600" />
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <Suspense fallback={<PageFallback />}>
            <Routes>
              {/* Public site */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/careers/:id" element={<JobDetails />} />
                <Route path="/careers/:id/apply" element={<ApplyJob />} />
                <Route path="/success-stories" element={<SuccessStories />} />
                <Route path="/testimonials" element={<Testimonials />} />
                <Route path="/hiring-partners" element={<HiringPartners />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:id" element={<BlogDetails />} />
                <Route path="/gallery" element={<Gallery />} />
                <Route path="/events" element={<Events />} />
                <Route path="/faq" element={<Faq />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/terms-and-conditions" element={<TermsAndConditions />} />

              </Route>

              {/* Auth — user portal */}
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              </Route>

              {/* Auth — admin portal (kept on its own route/page, never combined with user login) */}
              <Route element={<AuthLayout />}>
                <Route path="/admin/login" element={<AdminLogin />} />
              </Route>

              {/* Student dashboard — protected */}
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Overview />} />
                  <Route path="/dashboard/courses" element={<MyCourses />} />
                  <Route path="/dashboard/certificates" element={<MyCertificates />} />
                  <Route path="/dashboard/applications" element={<MyApplications />} />
                  <Route path="/dashboard/profile" element={<Profile />} />
                </Route>
              </Route>

              {/* Admin panel — protected, admin role only. Unauthenticated or non-admin users are
                  sent to /admin/login, never to the user-facing /login or /dashboard, so a
                  student can never transiently see an admin route. */}
              <Route element={<ProtectedRoute allowedRoles={["admin"]} redirectTo="/admin/login" />}>
                <Route element={<AdminLayout />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/users" element={<ManageUsers />} />
                  <Route path="/admin/courses" element={<ManageCourses />} />
                  <Route path="/admin/blogs" element={<ManageBlogs />} />
                  <Route path="/admin/jobs" element={<ManageJobs />} />
                  <Route path="/admin/applications" element={<ManageApplications />} />
                  <Route path="/admin/testimonials" element={<ManageTestimonials />} />
                  <Route path="/admin/partners" element={<ManagePartners />} />
                  <Route path="/admin/students" element={<ManageStudents />} />
                  <Route path="/admin/instructors" element={<ManageInstructors />} />
                  <Route path="/admin/events" element={<ManageEvents />} />
                  <Route path="/admin/faq" element={<ManageFaq />} />
                  <Route path="/admin/contact-queries" element={<ManageContactQueries />} />
                  <Route path="/admin/newsletters" element={<ManageNewsletters />} />
                  <Route path="/admin/media" element={<MediaLibrary />} />
                  <Route path="/admin/settings" element={<Settings />} />
                  <Route path="/admin/audit-logs" element={<AuditLogs />} />
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  );
}

export default App;
