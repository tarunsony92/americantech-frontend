import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import PageHeader from "../components/PageHeader";
import blogService from "../services/blogService";
import useResourceItem from "../hooks/useResourceItem";
import { formatDate } from "../utils/format";

const BlogDetails = () => {
  const { id } = useParams();
  const { item: post, loading, error } = useResourceItem(blogService, id);

  if (loading) return <div className="container-page py-24 text-center text-slate-500">Loading article...</div>;
  if (error || !post) return <div className="container-page py-24 text-center text-red-500">{error || "Article not found."}</div>;

  return (
    <>
      <Helmet>
        <title>{post.title} | American FutureTech</title>
        <meta property="og:title" content={post.title} />
      </Helmet>
      <PageHeader
        title={post.title}
        subtitle={`${post.category?.name || "Blog"} · ${formatDate(post.publishedAt || post.createdAt)} · By ${post.author?.fullName || "Team ATG"}`}
        breadcrumbItems={[{ label: "Blog", to: "/blog" }, { label: post.title }]}
      />

      <article className="container-page max-w-3xl py-16">
        {post.image && <img src={post.image} alt={post.title} className="mb-8 h-80 w-full rounded-2xl object-cover" />}
        {post.excerpt && <p className="text-lg text-slate-600 dark:text-slate-300">{post.excerpt}</p>}
        <div className="mt-6 whitespace-pre-line text-slate-600 dark:text-slate-300">
          {post.content || "This article's full content hasn't been published yet."}
        </div>
      </article>
    </>
  );
};

export default BlogDetails;
