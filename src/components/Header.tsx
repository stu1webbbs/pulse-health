import React from 'react';
import { useHealth } from '../context/HealthContext';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    notificationsOpen,
    setNotificationsOpen,
    notifications,
    markNotificationsAsRead,
  } = useHealth();

  const getSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Dashboard';
      case 'track-and-log':
        return 'Track And Log';
      case 'ai-advisor':
        return 'Ai Advisor';
      case 'profile-and-sync':
        return 'Care Plan & Shield';
      default:
        return 'Track And Log';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#f7f9fb]/85 backdrop-blur-xl shadow-[0_1px_8px_rgba(15,23,42,0.04)] pt-safe">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-lg mx-auto">
        <div
          className="flex items-center gap-2 min-w-0 cursor-pointer select-none"
          onClick={() => setActiveTab('dashboard')}
        >
          <img
            alt="PulseHealth Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VY7K-EajeIw1gbyKD3HnsH2MBgbPL06_SphcAHXa8ZKBMewR4RUe1kkJP3NpFIoXWgVnKTph3qrwdsffA08ilE_iPbVfnO46kwgqx4lFbVtV2kkAmK0fJmw7E25thTZyg6-WK7f7xbvubh67ogf6EhsAt6X7wRuponaJn9W2VD_7aJ8KRO-Bw7xhq2OZ6GC8Hpa2yQTyE0Wdmj_Ig6qa4d9YY2prQ02S8CXqjNnAUvF282YDQKrTkuq8pS"
            onError={(e) => {
              // Graceful SVG fallback icon if remote host blocks
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-['Plus_Jakarta_Sans'] font-semibold text-[1.125rem] text-[#191c1e] tracking-tight truncate">
                PulseHealth
              </span>
              <div
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#00855b]/15 text-[#006947] font-semibold text-[10px] tracking-wide uppercase"
                title="HIPAA Encrypted Protocol Active"
              >
                <span className="material-symbols-outlined text-[12px] leading-none text-[#006947]">
                  lock
                </span>
                <span className="inline font-semibold">256-BIT</span>
              </div>
            </div>
            <span className="font-['Inter'] text-[0.75rem] text-[#3d4947] truncate">
              {getSubtitle()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 flex-shrink-0 relative">
          {/* Notifications Button */}
          <button
            aria-label="Notifications"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#3d4947] hover:text-[#00685f] hover:bg-[#eceef0] transition-colors relative"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (!notificationsOpen && unreadCount > 0) {
                markNotificationsAsRead();
              }
            }}
          >
            <span className="material-symbols-outlined text-[22px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-[#f7f9fb] animate-pulse"></span>
            )}
          </button>

          {/* User Profile Avatar */}
          <button
            aria-label="Profile and Settings"
            onClick={() => setActiveTab('profile-and-sync')}
            className="relative flex items-center justify-center pl-1 focus:outline-none"
          >
            <img
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00685f]/20 hover:ring-[#00685f] transition-all"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgJFmqoQhhbAEbv4ETS83Z8iEiz3CTVbAQpB-Cq96Nu2ctvZXCeTiXurX_R8g0_fBQon7TObuRdc9aAhu7BnewqPhqQy4GHNNFKCMclllxEHhxFinzS2xqwaScTjAkfXq6IhlaBhpEc16xd1XdW1VP2JBq4jdUpMybI0P-pOuuPZxAZZZu9xTtFuYy6KPslRGeoSObmeDZ0F24eFSzZoXdzt_w6S64h1g6_Wqg9nmjvSFMNg587Q2ylA"
            />
          </button>

          {/* Notifications Flyout Modal */}
          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-2xl shadow-xl border border-[#e0e3e5] p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-[#eceef0]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#00685f]">
                    notifications_active
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#191c1e]">
                    Clinical Alerts
                  </span>
                </div>
                <span className="text-[10px] text-[#006947] bg-[#00855b]/10 px-2 py-0.5 rounded-full font-medium">
                  Live Feed
                </span>
              </div>
              <div className="divide-y divide-[#eceef0] max-h-60 overflow-y-auto no-scrollbar">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#00685f] mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#191c1e] font-medium leading-snug">{n.title}</p>
                      <span className="text-[10px] text-[#6d7a77]">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-[#eceef0] flex justify-between items-center text-[11px]">
                <button
                  className="text-[#00685f] font-semibold hover:underline"
                  onClick={() => {
                    markNotificationsAsRead();
                    setNotificationsOpen(false);
                  }}
                >
                  Mark all as read
                </button>
                <button
                  className="text-[#6d7a77] hover:text-[#191c1e]"
                  onClick={() => setNotificationsOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
