import { useState } from "react";
import { Bell, CreditCard, Server, Shield } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { cn } from "./ui/utils";

type NotificationType = "billing" | "system" | "security";

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  type: NotificationType;
  read: boolean;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { icon: typeof CreditCard; color: string; bg: string }
> = {
  billing: {
    icon: CreditCard,
    color: "text-amber-400",
    bg: "bg-amber-500/10 border border-amber-500/20",
  },
  system: {
    icon: Server,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border border-cyan-500/20",
  },
  security: {
    icon: Shield,
    color: "text-rose-400",
    bg: "bg-rose-500/10 border border-rose-500/20",
  },
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    title: "Payment failed for Acme Corp",
    description: "Card ending in 4242 was declined during renewal.",
    time: "5m ago",
    type: "billing",
    read: false,
  },
  {
    id: "n2",
    title: "New tenant registered: TechFlow",
    description: "TechFlow signed up on the Growth plan.",
    time: "32m ago",
    type: "system",
    read: false,
  },
  {
    id: "n3",
    title: "Weekly revenue report ready",
    description: "Your report for the past 7 days is available.",
    time: "1h ago",
    type: "billing",
    read: false,
  },
  {
    id: "n4",
    title: "API key rotated",
    description: "The production API key was rotated successfully.",
    time: "3h ago",
    type: "system",
    read: true,
  },
  {
    id: "n5",
    title: "2FA enabled for your account",
    description: "Two-factor authentication was turned on.",
    time: "1d ago",
    type: "security",
    read: true,
  },
  {
    id: "n6",
    title: "Suspicious login blocked",
    description: "A login attempt from an unrecognized device was blocked.",
    time: "2d ago",
    type: "security",
    read: true,
  },
];

export function NotificationCenter() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS,
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleViewAll = () => {
    console.log("View all notifications");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative w-10 h-10 flex items-center justify-center bg-input-background border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary transition-all"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 flex items-center justify-center bg-destructive text-white text-[10px] leading-none rounded-full">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </motion.button>
      </PopoverTrigger>

      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-96 p-0 bg-card border-border overflow-hidden"
      >
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Notifications
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : "You're all caught up"}
                  </p>
                </div>
                <button
                  onClick={markAllAsRead}
                  disabled={unreadCount === 0}
                  className="text-xs text-primary hover:text-primary/80 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Mark all as read
                </button>
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => {
                  const config = TYPE_CONFIG[notification.type];
                  const Icon = config.icon;
                  return (
                    <button
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={cn(
                        "w-full flex items-start gap-3 px-4 py-3 text-left border-b border-border last:border-b-0 transition-colors hover:bg-accent",
                        !notification.read && "bg-primary/5",
                      )}
                    >
                      <div
                        className={cn(
                          "w-8 h-8 shrink-0 rounded-lg flex items-center justify-center",
                          config.bg,
                        )}
                      >
                        <Icon className={cn("w-4 h-4", config.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          {!notification.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          )}
                          <p
                            className={cn(
                              "text-sm truncate",
                              !notification.read
                                ? "font-semibold text-foreground"
                                : "font-normal text-muted-foreground",
                            )}
                          >
                            {notification.title}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                          {notification.description}
                        </p>
                        <p className="text-[11px] text-muted-foreground/70 mt-1">
                          {notification.time}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="px-4 py-2.5 border-t border-border">
                <button
                  onClick={handleViewAll}
                  className="w-full text-center text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  View all notifications
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </PopoverContent>
    </Popover>
  );
}
