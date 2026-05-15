const rows = Array.from({ length: 16 });

export default function SkeletonTable() {
  return (
    <div className="w-full animate-pulse">
      <div className="min-w-[836px] rounded-t-lg bg-white">
        <div className="grid h-10 grid-cols-[280px_32px_200px_24px_minmax(0,1fr)_88px] items-center rounded-t-lg bg-[#F5F5F6] px-3">
          <div className="h-4 w-12 rounded bg-gray-200" />
          <div aria-hidden="true" />
          <div className="h-4 w-20 rounded bg-gray-200" />
          <div aria-hidden="true" />
          <div className="h-4 w-10 rounded bg-gray-200" />
          <div aria-hidden="true" />
        </div>
        <div className="divide-y divide-[#F5F5F6]">
          {rows.map((_, index) => (
            <div
              key={index}
              className="grid min-h-[76px] grid-cols-[280px_32px_200px_24px_minmax(0,1fr)_88px] items-center px-3 py-[14px]"
            >
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 rounded bg-gray-200" />
                <div className="h-5 w-5 rounded bg-gray-200" />
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded bg-gray-200" />
                  <div className="h-4 w-28 rounded bg-gray-200" />
                </div>
              </div>
              <div aria-hidden="true" />
              <div className="h-6 w-40 rounded bg-gray-200" />
              <div aria-hidden="true" />
              <div className="flex gap-2">
                <div className="h-6 w-8 rounded bg-gray-200" />
                <div className="h-6 w-16 rounded bg-gray-200" />
                <div className="h-6 w-20 rounded bg-gray-200" />
              </div>
              <div className="flex justify-end">
                <div className="h-9 w-16 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
