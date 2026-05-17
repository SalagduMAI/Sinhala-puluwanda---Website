import { useEffect, useState } from 'react';

interface XPToastProps {
  message: string;
  xp: number;
  show: boolean;
  onDone: () => void;
}

export default function XPToast({ message, xp, show, onDone }: XPToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onDone, 300);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [show, onDone]);

  if (!show && !visible) return null;

  return (
    <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
      visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
    }`}>
      <div className="flex items-center gap-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-saffron-500/30">
        <span className="text-xl">⚡</span>
        <div>
          <p className="font-semibold text-sm">{message}</p>
          <p className="text-saffron-200 text-xs">+{xp} XP earned</p>
        </div>
      </div>
    </div>
  );
}
