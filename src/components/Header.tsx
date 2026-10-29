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
    isLiveStreaming,
    setIsLiveStreaming,
    secondsSinceSync,
    triggerLivePulse,
  } = useHealth();

  const getSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Live Dashboard';
      case 'track-and-log':
        return 'Track And Log';
      case 'ai-advisor':
        return 'Clinical AI Advisor';
      case 'profile-and-sync':
        return 'Care Plan & Shield';
      default:
        return 'Live Telemetry';
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="fixed top-0 w-full z-50 bg-[#07090c]/90 backdrop-blur-xl border-b border-[#1c242e] shadow-[0_4px_24px_rgba(0,0,0,0.6)] pt-safe">
      <div className="h-16 px-4 flex items-center justify-between gap-2 max-w-lg mx-auto">
        <div
          className="flex items-center gap-2.5 min-w-0 cursor-pointer select-none"
          onClick={() => setActiveTab('dashboard')}
        >
          <img
            alt="PulseHealth Logo"
            className="h-8 w-auto object-contain flex-shrink-0"
            src="https://lh3.googleusercontent.com/aida/AEtjO1VY7K-EajeIw1gbyKD3HnsH2MBgbPL06_SphcAHXa8ZKBMewR4RUe1kkJP3NpFIoXWgVnKTph3qrwdsffA08ilE_iPbVfnO46kwgqx4lFbVtV2kkAmK0fJmw7E25thTZyg6-WK7f7xbvubh67ogf6EhsAt6X7wRuponaJn9W2VD_7aJ8KRO-Bw7xhq2OZ6GC8Hpa2yQTyE0Wdmj_Ig6qa4d9YY2prQ02S8CXqjNnAUvF282YDQKrTkuq8pS"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-['Plus_Jakarta_Sans'] font-bold text-[1.125rem] text-[#f1f5f9] tracking-tight truncate">
                PulseHealth
              </span>
              <div
                className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-[#00e5c9]/15 text-[#00e5c9] border border-[#00e5c9]/30 font-semibold text-[10px] tracking-wide uppercase"
                title="HIPAA Encrypted Protocol Active"
              >
                <span className="material-symbols-outlined text-[12px] leading-none text-[#00e5c9]">
                  lock
                </span>
                <span className="inline font-semibold">256-BIT</span>
              </div>
            </div>
            <span className="font-['Inter'] text-[0.75rem] text-[#94a3b8] truncate">
              {getSubtitle()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0 relative">
          {/* Live Telemetry Pulse Toggle */}
          <button
            onClick={() => {
              if (!isLiveStreaming) {
                setIsLiveStreaming(true);
              } else {
                triggerLivePulse();
              }
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#12171e] border border-[#242e3a] hover:border-[#00e5c9]/60 text-xs text-[#cbd5e1] transition-all"
            title="Click to pulse live telemetry sensor"
          >
            <span className="relative flex h-2 w-2">
              {isLiveStreaming && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00e5c9] opacity-80"></span>
              )}
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  isLiveStreaming ? 'bg-[#00e5c9]' : 'bg-[#64748b]'
                }`}
              ></span>
            </span>
            <span className="text-[11px] font-mono text-[#00e5c9] font-medium hidden xs:inline">
              {secondsSinceSync === 0 ? 'Live' : `${secondsSinceSync}s`}
            </span>
          </button>

          {/* Notifications Button */}
          <button
            aria-label="Notifications"
            className="w-9 h-9 flex items-center justify-center rounded-full text-[#94a3b8] hover:text-[#00e5c9] hover:bg-[#12171e] transition-colors relative"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              if (!notificationsOpen && unreadCount > 0) {
                markNotificationsAsRead();
              }
            }}
          >
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff4d4f] ring-2 ring-[#07090c] animate-pulse"></span>
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
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#00e5c9]/40 hover:ring-[#00e5c9] transition-all shadow-[0_0_12px_rgba(0,229,201,0.2)]"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgJFmqoQhhbAEbv4ETS83Z8iEiz3CTVbAQpB-Cq96Nu2ctvZXCeTiXurX_R8g0_fBQon7TObuRdc9aAhu7BnewqPhqQy4GHNNFKCMclllxEHhxFinzS2xqwaScTjAkfXq6IhlaBhpEc16xd1XdW1VP2JBq4jdUpMybI0P-pOuuPZxAZZZu9xTtFuYy6KPslRGeoSObmeDZ0F24eFSzZoXdzt_w6S64h1g6_Wqg9nmjvSFMNg587Q2ylA"
            />
          </button>

          {/* Notifications Flyout Modal */}
          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-80 bg-[#0e1217] rounded-2xl shadow-2xl border border-[#222b36] p-3.5 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#1c242e]">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px] text-[#00e5c9]">
                    notifications_active
                  </span>
                  <span className="font-['Plus_Jakarta_Sans'] font-semibold text-sm text-[#f1f5f9]">
                    Clinical Alerts
                  </span>
                </div>
                <span className="text-[10px] text-[#00e5c9] bg-[#00e5c9]/10 border border-[#00e5c9]/30 px-2 py-0.5 rounded-full font-medium">
                  Live Feed
                </span>
              </div>
              <div className="divide-y divide-[#1c242e] max-h-60 overflow-y-auto no-scrollbar">
                {notifications.map((n) => (
                  <div key={n.id} className="py-2.5 flex items-start gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-[#00e5c9] mt-1.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-[#f1f5f9] font-medium leading-snug">{n.title}</p>
                      <span className="text-[10px] text-[#64748b]">{n.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2.5 border-t border-[#1c242e] flex justify-between items-center text-[11px]">
                <button
                  className="text-[#00e5c9] font-semibold hover:underline"
                  onClick={() => {
                    markNotificationsAsRead();
                    setNotificationsOpen(false);
                  }}
                >
                  Mark all as read
                </button>
                <button
                  className="text-[#94a3b8] hover:text-[#f1f5f9]"
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
