export default function BoardLoading() {
  return (
    <div className="space-y-4 animate-pulse">
      <div>
        <div className="h-6 w-16 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-64 bg-gray-100 rounded"></div>
      </div>

      <div className="flex gap-4 mb-4">
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
        <div className="h-10 w-32 bg-gray-200 rounded"></div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-gray-50 rounded-lg p-3 h-96">
            <div className="h-4 w-24 bg-gray-200 rounded mb-4"></div>
            <div className="space-y-3">
              <div className="h-20 bg-white rounded shadow-sm"></div>
              <div className="h-24 bg-white rounded shadow-sm"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
