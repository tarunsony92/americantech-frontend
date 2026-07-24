const SkeletonCard = () => (
  <div className="card overflow-hidden">
    <div className="skeleton h-44 w-full" />
    <div className="space-y-3 p-5">
      <div className="skeleton h-4 w-3/4" />
      <div className="skeleton h-3 w-1/2" />
      <div className="skeleton h-3 w-full" />
    </div>
  </div>
);

export default SkeletonCard;
