export default function ProductSkeleton() {
  return (
    <div className="bg-[var(--color-card)] rounded-xl overflow-hidden shadow-sm border border-[var(--color-border)] flex flex-col h-full animate-pulse">
      <div className="relative aspect-[4/5] bg-gray-200 dark:bg-gray-800 w-full"></div>
      <div className="p-5 flex flex-col flex-grow text-center">
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-3/4 mx-auto mb-3"></div>
        <div className="h-5 bg-gray-200 dark:bg-gray-800 rounded w-1/2 mx-auto mb-4"></div>
        <div className="mt-auto flex flex-col items-center gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded w-1/3"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
