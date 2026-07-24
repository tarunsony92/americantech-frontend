import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import HeroSlider from "../components/HeroSlider";
import CourseCard from "../components/CourseCard";
import JobCard from "../components/JobCard";
import Counters from "../components/Counters";
import PartnerSlider from "../components/PartnerSlider";
import TestimonialsSlider from "../components/TestimonialsSlider";
import BlogCard from "../components/BlogCard";
import CTA from "../components/CTA";
import courseService from "../services/courseService";
import jobService from "../services/jobService";
import blogService from "../services/blogService";
import { testimonialService, hiringPartnerService } from "../services/contentService";
import useResourceList from "../hooks/useResourceList";
import { formatCurrencyINR, formatDate, timeAgo } from "../utils/format";

const Home = () => {
  const courses = useResourceList(courseService, { limit: 3 });
  const jobs = useResourceList(jobService, { limit: 4 });
  const partners = useResourceList(hiringPartnerService, { limit: 8 });
  const testimonials = useResourceList(testimonialService, { limit: 6 });
  const posts = useResourceList(blogService, { limit: 3 });

  return (
    <>
      <Helmet>
        <title>American Tech Global | Career-Focused Tech Training</title>
        <meta name="description" content="Industry-aligned tech training programs with real placement support." />
        <meta property="og:title" content="American Tech Global" />
      </Helmet>

      <HeroSlider />
      <Counters />

      <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <h2 className="section-title">Popular Courses</h2>
          <Link to="/courses" className="btn-outline hidden sm:inline-flex">View All</Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.loading ? (
            <p className="text-slate-500">Loading courses...</p>
          ) : (
            courses.items.map((course) => (
              <CourseCard key={course.id} course={{ ...course, category: course.category?.name, price: formatCurrencyINR(course.price) }} />
            ))
          )}
        </div>
      </section>

      <section className="bg-slate-50 py-16 dark:bg-slate-900">
        <div className="container-page">
          <div className="flex items-end justify-between">
            <h2 className="section-title">Latest Openings</h2>
            <Link to="/careers" className="btn-outline hidden sm:inline-flex">View All</Link>
          </div>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {jobs.loading ? (
              <p className="text-slate-500">Loading openings...</p>
            ) : (
              jobs.items.map((job) => (
                <JobCard key={job.id} job={{ ...job, company: job.company?.name, postedAt: timeAgo(job.createdAt) }} />
              ))
            )}
          </div>
        </div>
      </section>

      {!partners.loading && partners.items.length > 0 && (
        <section className="container-page py-16">
          <h2 className="section-title text-center">Our Hiring Partners</h2>
          <div className="mt-8">
            <PartnerSlider partners={partners.items} />
          </div>
        </section>
      )}

      {!testimonials.loading && testimonials.items.length > 0 && (
        <section className="bg-slate-50 py-16 dark:bg-slate-900">
          <div className="container-page">
            <h2 className="section-title text-center">What Our Students Say</h2>
            <div className="mx-auto mt-8 max-w-2xl">
              <TestimonialsSlider testimonials={testimonials.items} />
            </div>
          </div>
        </section>
      )}

      {/* <section className="container-page py-16">
        <div className="flex items-end justify-between">
          <h2 className="section-title">From the Blog</h2>
          <Link to="/blog" className="btn-outline hidden sm:inline-flex">View All</Link>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.loading ? (
            <p className="text-slate-500">Loading articles...</p>
          ) : (
            posts.items.map((post) => (
              <BlogCard key={post.id} post={{ ...post, category: post.category?.name, author: post.author?.fullName, date: formatDate(post.publishedAt || post.createdAt) }} />
            ))
          )}
        </div>
      </section> */}

      <CTA />
    </>
  );
};

export default Home;
