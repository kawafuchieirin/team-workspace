import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-indigo-600 text-white shadow-md">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          Study Tracker
        </Link>
      </div>
    </header>
  );
}
