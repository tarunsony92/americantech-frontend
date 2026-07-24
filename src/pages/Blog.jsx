import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import BlogCard from "../components/BlogCard";
import SearchBar from "../components/SearchBar";
import Pagination from "../components/Pagination";
import blogService from "../services/blogService";
import useResourceList from "../hooks/useResourceList";
import { formatDate } from "../utils/format";

const toCardProps = (post) => ({
  ...post,
  category: post.category?.name || "General",
  author: post.author?.fullName || "Team ATG",
  date: formatDate(post.publishedAt || post.createdAt),
});

const Blog = () => {
  const { items, meta, params, setParams, loading, error } = useResourceList(blogService, { limit: 6 });

  const handleSearch = (value) => setParams((p) => ({ ...p, search: value, page: 1 }));
  const handlePageChange = (page) => setParams((p) => ({ ...p, page }));

  return (
    <>
      <Helmet><title>Blog | American Tech Global</title></Helmet>
      <PageHeader title="Blog" subtitle="Career advice and industry insights." breadcrumbItems={[{ label: "Blog" }]} />

      <section className="container-page py-16">
        <div className="mb-8 max-w-md">
          <SearchBar value={params.search} onChange={handleSearch} placeholder="Search articles..." />
        </div>

        {error && <p className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-950 dark:text-red-300">{error}</p>}

        {loading ? (
          <p className="text-slate-500">Loading articles...</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((post) => <BlogCard key={post.id} post={toCardProps(post)} />)}
          </div>
        )}

        {!loading && !error && items.length === 0 && <p className="mt-10 text-center text-slate-500">No articles found.</p>}

        <Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={handlePageChange} />
      </section>
    </>
  );
};

export default Blog;
