export default function PageLoader() {
  return (
    <div className="min-h-[calc(100vh-64px)] w-full bg-white dark:bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 pt-10 pb-16 animate-pulse">
        {/* Hero skeleton */}
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4 w-2/3 mx-auto" />
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8 w-1/2 mx-auto" />

        {/* Input bar skeleton */}
        <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-2xl mb-10" />


        {/* Cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        </div>



        {/* Text lines */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        </div>
      </div>
    </div>
  );
}
