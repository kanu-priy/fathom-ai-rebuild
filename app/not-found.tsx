import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-extrabold text-xl mb-4">
        404
      </div>
      <h2 className="text-xl font-bold text-white mb-2">Meeting Not Found</h2>
      <p className="text-sm text-gray-400 max-w-sm mb-6">
        The meeting recording you are looking for does not exist or has been removed.
      </p>
      <Link
        href="/"
        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-lg shadow-blue-600/20"
      >
        Return to Meetings
      </Link>
    </div>
  );
}
