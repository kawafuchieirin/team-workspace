import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "ダッシュボード" },
  { to: "/records", label: "学習記録" },
  { to: "/calendar", label: "カレンダー" },
  { to: "/goals", label: "目標管理" },
];

export default function Sidebar() {
  return (
    <nav className="w-56 min-h-[calc(100vh-64px)] bg-white border-r border-gray-200 p-4 hidden md:block">
      <ul className="space-y-1">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`
              }
            >
              {link.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
