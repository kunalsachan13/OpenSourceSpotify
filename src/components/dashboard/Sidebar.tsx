import Link from "next/link";

export default function Sidebar() {
  constnavItems = [
    { href: "/dashboard", label: "Home", icon: "🏠" },
    { href: "/dashboard/artists", label: "Artists", icon: "👤" },
    { href: "/dashboard/songs", label: "Songs", icon: "🎵" },
    { href: "/dashboard/playlists", label: "Playlists", icon: "📋" },
    { href: "/dashboard/donations", label: "Donations", icon: "💝" },
  ];

  return (
    <aside className="w-64 bg-gray-800 h-screen text-white flex flex-col p-4">
      <div className="mb-6 text-xl font-bold text-yellow-400">MusicShare</div>
      <nav className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block py-3 px-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-auto text-xs text-gray-500">
        Powered by OpenSourceSpotify
      </div>
    </aside>
  );
}
