import { useState, useEffect, useRef } from "react";
import { Bell, ShoppingBag, CreditCard, Gift } from "lucide-react";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { initializeSocket } from "../../services/socket/socketService";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { apiFetch } from "../../services/http/interceptors";
import { NOTIFICATION_TYPES, type NotificationType } from "../../app/config/constants";

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationCenter() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const res = await apiFetch<{ data: Notification[] }>("/notifications");
      setNotifications(res.data || []);
      setUnreadCount(res.data?.filter(n => !n.isRead).length || 0);
    } catch (e) {
      console.error("Failed to fetch notifications", e);
    }
  };

  useEffect(() => {
    if (user) {
      fetchNotifications();
      const socket = initializeSocket(user._id, user.role);

      socket.on("notification", (notification: Notification) => {
        setNotifications(prev => [notification, ...prev]);
        setUnreadCount(prev => prev + 1);
        toast.success(notification.title, {
          icon: <Bell className="text-blue-500" size={16} />
        });
      });

      return () => {
        socket.off("notification");
      };
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const clearAll = async () => {
    try {
      await apiFetch("/notifications/read-all", { method: "PATCH" });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const getIcon = (type: NotificationType) => {
    switch (type) {
      case NOTIFICATION_TYPES.ORDER_UPDATE: return <ShoppingBag size={16} className="text-blue-500" />;
      case NOTIFICATION_TYPES.PROMOTION: return <Gift size={16} className="text-amber-500" />;
      case NOTIFICATION_TYPES.PAYMENT: return <CreditCard size={16} className="text-emerald-500" />;
      default: return <Bell size={16} className="text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-slate-100 transition relative group"
      >
        <Bell size={20} className={`transition-colors ${unreadCount > 0 ? 'text-blue-500' : 'text-slate-600 group-hover:text-blue-500'}`} />
        {unreadCount > 0 && (
          <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white animate-pulse" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-80 bg-white rounded-3xl border border-slate-100 shadow-2xl z-50 overflow-hidden"
          >
              <div className="p-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-black text-slate-900 text-sm tracking-tight">System Alerts</h3>
                <button
                  onClick={clearAll}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 uppercase tracking-widest"
                >
                  Clear All
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length === 0 ? (
                  <div className="p-10 text-center">
                    <Bell size={40} className="text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-400 text-xs font-medium">All quiet for now</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      onClick={() => !n.isRead && markAsRead(n._id)}
                      className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative ${!n.isRead ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center ${!n.isRead ? 'bg-white shadow-sm' : 'bg-slate-100'}`}>
                          {getIcon(n.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold truncate ${!n.isRead ? 'text-slate-900' : 'text-slate-500'}`}>
                            {n.title}
                          </p>
                          <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5 leading-relaxed">
                            {n.message}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold mt-2 uppercase tracking-tighter">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        {!n.isRead && (
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1" />
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
