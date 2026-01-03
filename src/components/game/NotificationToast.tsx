import { memo, useEffect } from 'react';
import { GameNotification } from '@/types/game';

interface NotificationToastProps {
  notification: GameNotification | null;
  onClose: () => void;
}

export const NotificationToast = memo(({ notification, onClose }: NotificationToastProps) => {
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(onClose, 3000); // 3 seconds for generic notifications
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div className="fixed top-20 left-4 right-4 md:top-auto md:bottom-4 md:left-4 md:right-auto md:w-auto z-[100] animate-in slide-in-from-bottom-4 fade-in duration-500 pointer-events-none">
      <div className={`bg-card border-2 rounded-lg p-4 shadow-[0_0_20px_rgba(0,0,0,0.3)] flex items-center gap-4 min-w-[300px] ${notification.color ? 'border-current ' + notification.color : 'border-primary/50'}`}>
        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl border bg-background/50 animate-bounce ${notification.color ? 'border-current text-current' : 'border-primary/30 text-primary'}`}>
          {notification.icon}
        </div>
        <div>
          <h4 className={`font-game text-sm tracking-wider mb-1 flex items-center gap-2 ${notification.color || 'text-primary'}`}>
            {notification.title}
          </h4>
          <p className="font-bold text-foreground text-sm">{notification.description}</p>
        </div>
      </div>
    </div>
  );
});

NotificationToast.displayName = 'NotificationToast';
