import { useState } from "react";

import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";

import scheduleIcon from "../assets/schedule-icon.gif";

import { useAuthStore } from "../stores/authStore";

const AppLayout = () => {
  const navigate = useNavigate();

  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/roles", label: "Roles" },
    { to: "/activities", label: "Activities" },
    { to: "/weekly-plan", label: "Weekly Plan" },
    { to: "/schedule", label: "Schedule" },
    { to: "/settings", label: "Settings" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const handleNavigation = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 md:hidden"
              aria-label="Open menu"
              aria-expanded={isSidebarOpen}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>

            <Link
              to="/dashboard"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900"
            >
              <img
                src={scheduleIcon}
                alt=""
                className="h-8 w-8 object-contain"
              />

              <span>Habit 3</span>
            </Link>
          </div>

          <nav className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-slate-100 text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-600 sm:block">
              {user?.name}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsSidebarOpen(false)}
            className="absolute inset-0 bg-slate-900/30"
          />

          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <Link
                to="/dashboard"
                onClick={handleNavigation}
                className="flex items-center gap-2 text-lg font-semibold tracking-tight text-slate-900"
              >
                <img
                  src={scheduleIcon}
                  alt=""
                  className="h-8 w-8 object-contain"
                />

                <span>Habit 3</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close menu"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-4">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={handleNavigation}
                  className={({ isActive }) =>
                    `rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-slate-200 p-4">
              <p className="mb-3 text-sm text-slate-600">{user?.name}</p>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
