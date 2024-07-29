export default function SkeletonCard() {
  return (
    <div className="bg-white p-6 flex flex-col border rounded-[20px] animate-pulse">
      <div className="flex justify-between items-start mb-6">
        <div className="bg-gray-200 h-6 w-32 rounded"></div>
      </div>
      <div className="flex items-center mb-4 gap-3">
        <div className="w-14 h-14 bg-gray-200 rounded-lg"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="bg-gray-200 h-4 w-full mb-2 rounded"></div>
          <div className="bg-gray-200 h-4 w-3/4 mb-[60px] rounded"></div>
        </div>
        <div className="flex gap-2">
          <div className="bg-gray-200 h-6 w-16 rounded"></div>
          <div className="bg-gray-200 h-6 w-16 rounded"></div>
        </div>
      </div>
    </div>
  );
}
