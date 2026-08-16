import { useRef, useEffect, useState, useCallback } from 'react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  userName: string;
  level: number;
  xp: number;
  totalWordsLearned: number;
  perfectScores: number;
}

type CertTheme = 'gold' | 'sapphire' | 'emerald' | 'obsidian';

interface ThemeConfig {
  id: CertTheme;
  name: string;
  icon: string;
  bgColors: [string, string, string];
  outerBorder: string;
  innerBorder: string;
  cornerDot1: string;
  cornerDot2: string;
  titleColor: string;
  subTitleColor: string;
  textColor: string;
  nameColor: string;
  boxBg: string;
  boxBorder: string;
  boxTextColor: string;
  sealOuter: string;
  sealInner: string;
  sealText: string;
  emblem: string;
}

const THEMES: Record<CertTheme, ThemeConfig> = {
  gold: {
    id: 'gold',
    name: 'Saffron Gold',
    icon: '👑',
    bgColors: ['#fefbf3', '#fbf6e6', '#f7eed4'],
    outerBorder: '#b45309',
    innerBorder: '#f59e0b',
    cornerDot1: '#b45309',
    cornerDot2: '#f59e0b',
    titleColor: '#78350f',
    subTitleColor: '#b45309',
    textColor: '#44403c',
    nameColor: '#1c1917',
    boxBg: '#ffffff',
    boxBorder: '#e7e5e4',
    boxTextColor: '#b45309',
    sealOuter: '#f59e0b',
    sealInner: '#b45309',
    sealText: '#ffffff',
    emblem: '🦁'
  },
  sapphire: {
    id: 'sapphire',
    name: 'Ceylon Sapphire',
    icon: '💎',
    bgColors: ['#f0f9ff', '#e0f2fe', '#bae6fd'],
    outerBorder: '#0369a1',
    innerBorder: '#38bdf8',
    cornerDot1: '#0369a1',
    cornerDot2: '#38bdf8',
    titleColor: '#0c4a6e',
    subTitleColor: '#0284c7',
    textColor: '#334155',
    nameColor: '#0f172a',
    boxBg: '#ffffff',
    boxBorder: '#cbd5e1',
    boxTextColor: '#0284c7',
    sealOuter: '#38bdf8',
    sealInner: '#0369a1',
    sealText: '#ffffff',
    emblem: '💎'
  },
  emerald: {
    id: 'emerald',
    name: 'Ceylon Emerald',
    icon: '🌿',
    bgColors: ['#f0fdf4', '#dcfce7', '#bbf7d0'],
    outerBorder: '#15803d',
    innerBorder: '#4ade80',
    cornerDot1: '#15803d',
    cornerDot2: '#4ade80',
    titleColor: '#14532d',
    subTitleColor: '#16a34a',
    textColor: '#334155',
    nameColor: '#0f172a',
    boxBg: '#ffffff',
    boxBorder: '#cbd5e1',
    boxTextColor: '#15803d',
    sealOuter: '#4ade80',
    sealInner: '#15803d',
    sealText: '#ffffff',
    emblem: '🪷'
  },
  obsidian: {
    id: 'obsidian',
    name: 'Dark Obsidian',
    icon: '🌌',
    bgColors: ['#0f172a', '#090d16', '#020617'],
    outerBorder: '#f59e0b',
    innerBorder: '#d97706',
    cornerDot1: '#f59e0b',
    cornerDot2: '#fbbf24',
    titleColor: '#fbbf24',
    subTitleColor: '#f59e0b',
    textColor: '#cbd5e1',
    nameColor: '#ffffff',
    boxBg: '#1e293b',
    boxBorder: '#334155',
    boxTextColor: '#f59e0b',
    sealOuter: '#f59e0b',
    sealInner: '#78350f',
    sealText: '#ffffff',
    emblem: '⭐'
  }
};

export default function CertificateModal({
  isOpen,
  onClose,
  darkMode,
  userName,
  level,
  xp,
  totalWordsLearned,
  perfectScores
}: CertificateModalProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentTheme, setCurrentTheme] = useState<CertTheme>('gold');
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const certId = `LK-SP-2026-${(Math.abs(userName.split('').reduce((a, b) => a + b.charCodeAt(0), 0) + xp * 7) % 90000 + 10000)}`;
  const issueDate = new Date().toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const renderCertificate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 1200;
    const height = 850;
    canvas.width = width;
    canvas.height = height;

    const theme = THEMES[currentTheme];

    // 1. Parchment Background
    const bgGradient = ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, theme.bgColors[0]);
    bgGradient.addColorStop(0.5, theme.bgColors[1]);
    bgGradient.addColorStop(1, theme.bgColors[2]);
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, width, height);

    // 2. Outer Ornate Border
    ctx.lineWidth = 14;
    ctx.strokeStyle = theme.outerBorder;
    ctx.strokeRect(30, 30, width - 60, height - 60);

    // 3. Inner Gold Border
    ctx.lineWidth = 3;
    ctx.strokeStyle = theme.innerBorder;
    ctx.strokeRect(48, 48, width - 96, height - 96);

    // 4. Corner Ornaments
    const drawCorner = (cx: number, cy: number) => {
      ctx.fillStyle = theme.cornerDot1;
      ctx.beginPath();
      ctx.arc(cx, cy, 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = theme.cornerDot2;
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();
    };
    drawCorner(52, 52);
    drawCorner(width - 52, 52);
    drawCorner(52, height - 52);
    drawCorner(width - 52, height - 52);

    // 5. Header Emblem
    ctx.font = '54px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(theme.emblem, width / 2, 130);

    // 6. Main Titles
    ctx.fillStyle = theme.titleColor;
    ctx.font = 'bold 36px "Space Grotesk", sans-serif';
    ctx.fillText('CERTIFICATE OF PROFICIENCY', width / 2, 185);

    ctx.fillStyle = theme.subTitleColor;
    ctx.font = 'bold 24px "Noto Sans Sinhala", sans-serif';
    ctx.fillText('සිංහල භාෂා ප්‍රවීණතා සහතිකය', width / 2, 225);

    // 7. Subtitle
    ctx.fillStyle = theme.textColor;
    ctx.font = 'italic 18px "Inter", serif';
    ctx.fillText('This is officially awarded to', width / 2, 280);

    // 8. Student Name
    ctx.fillStyle = theme.nameColor;
    ctx.font = 'bold 44px "Space Grotesk", sans-serif';
    ctx.fillText(userName, width / 2, 345);

    // Underline beneath name
    ctx.lineWidth = 2;
    ctx.strokeStyle = theme.innerBorder;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 220, 365);
    ctx.lineTo(width / 2 + 220, 365);
    ctx.stroke();

    // 9. Citation
    ctx.fillStyle = theme.textColor;
    ctx.font = '18px "Inter", sans-serif';
    ctx.fillText(
      'for successfully mastering practical spoken Sinhala vocabulary, pronunciation,',
      width / 2,
      420
    );
    ctx.fillText(
      'and sentence construction on the Sinhala Puluwanda Interactive Learning Platform.',
      width / 2,
      450
    );

    // 10. Performance Badge Box
    ctx.fillStyle = theme.boxBg;
    ctx.fillRect(width / 2 - 320, 500, 640, 90);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = theme.boxBorder;
    ctx.strokeRect(width / 2 - 320, 500, 640, 90);

    ctx.fillStyle = theme.boxTextColor;
    ctx.font = 'bold 22px "Space Grotesk", sans-serif';
    ctx.fillText(`Level ${level} Master  •  ${xp} Total XP  •  ${totalWordsLearned} Words Learned`, width / 2, 540);

    ctx.fillStyle = theme.textColor;
    ctx.font = '14px "Inter", sans-serif';
    ctx.fillText(`${perfectScores} Perfect Quiz Scores Completed  •  Verified Authenticity`, width / 2, 568);

    // 11. Gold Seal Stamp (Bottom Left)
    const sealX = 220;
    const sealY = 690;
    ctx.fillStyle = theme.sealOuter;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 46, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = theme.sealInner;
    ctx.beginPath();
    ctx.arc(sealX, sealY, 38, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = theme.sealText;
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('VERIFIED', sealX, sealY - 4);
    ctx.fillText('OFFICIAL', sealX, sealY + 12);

    // 12. Signature (Bottom Right)
    const sigX = width - 220;
    const sigY = 690;
    ctx.fillStyle = theme.nameColor;
    ctx.font = 'italic bold 24px "Space Grotesk", cursive';
    ctx.fillText('Sinhala Puluwanda', sigX, sigY - 10);
    ctx.lineWidth = 1;
    ctx.strokeStyle = theme.innerBorder;
    ctx.beginPath();
    ctx.moveTo(sigX - 100, sigY + 5);
    ctx.lineTo(sigX + 100, sigY + 5);
    ctx.stroke();
    ctx.fillStyle = theme.textColor;
    ctx.font = '12px "Inter", sans-serif';
    ctx.fillText('Academic Board & Language Team', sigX, sigY + 25);

    // 13. Certificate ID & Date (Bottom Center)
    ctx.fillStyle = theme.textColor;
    ctx.font = '12px monospace';
    ctx.fillText(`Certificate ID: ${certId}  |  Date: ${issueDate}`, width / 2, 790);

    // Store data url
    setDataUrl(canvas.toDataURL('image/png'));
  }, [currentTheme, userName, level, xp, totalWordsLearned, perfectScores, certId, issueDate]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(renderCertificate, 50);
    }
  }, [isOpen, currentTheme, renderCertificate]);

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `Sinhala_Puluwanda_${currentTheme.toUpperCase()}_Certificate_${userName.replace(/\s+/g, '_')}.png`;
    a.click();
  };

  const handleShare = async () => {
    const text = `🎉 I just earned my official Sinhala Language Proficiency Certificate (Level ${level}) on Sinhala Puluwanda! 🇱🇰🦁 Learn Sinhala for free at: ${window.location.origin}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Sinhala Puluwanda Proficiency Certificate',
          text,
          url: window.location.origin
        });
        return;
      } catch {}
    }

    // Fallback: copy to clipboard
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      alert('Certificate details copied to clipboard!');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className={`w-full max-w-4xl rounded-3xl border shadow-2xl overflow-hidden p-6 sm:p-8 space-y-5 animate-scale-up ${
        darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
      }`}>
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-700/20 pb-4 gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-3xl">🎓</span>
            <div>
              <h2 className="font-bold text-lg font-space">Official Sinhala Completion Certificate</h2>
              <span className="text-xs text-saffron-500 font-semibold">Awarded for Spoken & Written Mastery</span>
            </div>
          </div>

          {/* Theme Selector Pills */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto">
            {(Object.keys(THEMES) as CertTheme[]).map((thmKey) => {
              const thm = THEMES[thmKey];
              const isSelected = currentTheme === thmKey;
              return (
                <button
                  key={thmKey}
                  onClick={() => setCurrentTheme(thmKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 border ${
                    isSelected
                      ? 'bg-saffron-500 text-white border-saffron-500 shadow-sm ring-2 ring-saffron-500/30'
                      : darkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                >
                  <span>{thm.icon}</span>
                  <span className="hidden sm:inline">{thm.name}</span>
                </button>
              );
            })}

            <button
              onClick={onClose}
              className={`p-2 ml-2 rounded-xl border transition-all ${
                darkMode ? 'border-slate-800 hover:bg-slate-800 text-slate-400' : 'border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Certificate Canvas Preview */}
        <div className="relative rounded-2xl overflow-hidden shadow-xl border border-amber-900/20 max-h-[55vh] flex items-center justify-center bg-slate-950">
          <canvas ref={canvasRef} className="max-w-full h-auto max-h-[50vh] object-contain rounded-xl" />
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs text-slate-400">
            <span>Certificate ID: <strong className="font-mono text-saffron-500">{certId}</strong></span>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleDownload}
              className="px-6 py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 hover:from-saffron-400 hover:to-saffron-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-saffron-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>📥</span>
              <span>Download High-Res PNG</span>
            </button>

            <button
              onClick={handleShare}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>📲</span>
              <span>{copied ? '✓ Link Copied!' : 'Share on WhatsApp & Social'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
