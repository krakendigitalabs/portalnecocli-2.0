export default function DirectoryLoading() {
    return (
      <div className="w-full max-w-7xl mx-auto px-4 py-16 animate-pulse">
        <div className="h-10 bg-slate-200 rounded-2xl w-1/3 mb-4 mx-auto" />
        <div className="h-5 bg-slate-200 rounded-xl w-1/2 mb-12 mx-auto" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-96 bg-slate-100 rounded-[32px]" />
          ))}
        </div>
      </div>
    );
  }