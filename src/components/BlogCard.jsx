import { Link } from "react-router-dom";

const BlogCard = ({ post }) => {
  const { id, title, excerpt, image, category, date, author } = post;

  return (
    <article className="card overflow-hidden">
      <Link to={`/blog/${id}`} className="block h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img src={image} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
      </Link>
      <div className="p-5">
        <span className="text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">{category}</span>
        <h3 className="mt-2 line-clamp-2 text-base font-semibold text-slate-900 dark:text-white">
          <Link to={`/blog/${id}`}>{title}</Link>
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">{excerpt}</p>
        <div className="mt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <span>{author}</span>
          <span>{date}</span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;
