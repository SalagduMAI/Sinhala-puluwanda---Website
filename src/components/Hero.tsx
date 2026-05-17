import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { culturalFacts } from '../data/lessons';

interface HeroProps {
  onStart: () => void;
  darkMode: boolean;
  totalWords: number;
  level: number;
  streak: number;
}

// Sri Lankan cultural pride videos — elephants, Nine Arch Bridge, misty forests, temples
const SRI_LANKA_VIDEOS = [
  { src: 'https://cdn.pixabay.com/video/2024/11/20/242272_large.mp4', label: 'Sri Lankan Elephants' },
  { src: 'https://cdn.pixabay.com/video/2023/09/24/182134-871642704_large.mp4', label: 'Nine Arch Bridge, Ella' },
  { src: 'https://cdn.pixabay.com/video/2024/08/25/228188_large.mp4', label: 'Misty Forests of Sri Lanka' },
];

const CULTURAL_CAPTIONS = [
  { text: 'The Pearl of the Indian Ocean', sinhala: 'ඉන්දියන් සාගරයේ මුතු ඇටය' },
  { text: 'Land of Elephants & Ancient Temples', sinhala: 'අලි සහ පුරාණ පන්සල් රට' },
  { text: 'Where Nature Meets Heritage', sinhala: 'ස්වභාවය උරුමය හමුවන තැන' },
];

export default function Hero({ onStart, totalWords, level, streak }: HeroProps) {
  const [factIndex, setFactIndex] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [activeVideo, setActiveVideo] = useState(0);
  const [videosReady, setVideosReady] = useState<boolean[]>([false, false, false]);
  const [captionVisible, setCaptionVisible] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const fullText = 'Can you speak Sinhala?';

  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      x: Math.random() * 100, y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.8, speed: Math.random() * 4 + 3,
      opacity: Math.random() * 0.25 + 0.05, delay: i * 0.12,
    })), []);

  // Cultural fact rotation
  useEffect(() => {
    const interval = setInterval(() => setFactIndex(p => (p + 1) % culturalFacts.length), 5000);
    return () => clearInterval(interval);
  }, []);

  // Typewriter
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) { setTypedText(fullText.slice(0, i)); i++; }
      else clearInterval(interval);
    }, 55);
    return () => clearInterval(interval);
  }, []);

  // Cross-fade between cultural videos every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCaptionVisible(false);
      setTimeout(() => {
        setActiveVideo(prev => (prev + 1) % SRI_LANKA_VIDEOS.length);
        setTimeout(() => setCaptionVisible(true), 800);
      }, 600);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  // Auto-play all videos (muted) so they're ready for crossfade
  const handleVideoReady = useCallback((index: number) => {
    setVideosReady(prev => { const next = [...prev]; next[index] = true; return next; });
    videoRefs.current[index]?.play().catch(() => {});
  }, []);

  const anyVideoReady = videosReady.some(Boolean);

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* ========== SRI LANKAN CULTURAL VIDEO SHOWCASE ========== */}
      <div className="absolute inset-0">
        {/* Animated gradient fallback */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-[#0c1a0e] to-slate-950">
          <div className="absolute inset-0 bg-gradient-to-br from-saffron-900/30 via-transparent to-emerald-900/20 animate-gradient-x" style={{ animationDuration: '18s' }} />
          <div className="absolute inset-0 bg-gradient-to-tl from-amber-900/15 via-transparent to-saffron-800/15 animate-gradient-x" style={{ animationDuration: '24s', animationDirection: 'reverse' }} />
        </div>

        {/* Cultural videos — stacked, only active one is visible */}
        {SRI_LANKA_VIDEOS.map((video, i) => (
          <video
            key={i}
            ref={el => { videoRefs.current[i] = el; }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[1.5s] ease-in-out ${
              activeVideo === i && anyVideoReady ? 'opacity-50' : 'opacity-0'
            }`}
            autoPlay muted loop playsInline
            poster="/images/hero-bg.jpg"
            onCanPlayThrough={() => handleVideoReady(i)}
            onLoadedData={() => handleVideoReady(i)}
            aria-label={video.label}
          >
            <source src={video.src} type="video/mp4" />
          </video>
        ))}

        {/* Cinematic overlay system */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/30 to-black/75" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
        {/* Warm Sri Lankan golden tint */}
        <div className="absolute inset-0 bg-gradient-to-b from-saffron-900/10 via-transparent to-saffron-900/5 mix-blend-overlay" />

        {/* Glowing orbs — warm golden (Sri Lankan flag colors) */}
        <div className="absolute top-[15%] -left-16 w-64 sm:w-96 h-64 sm:h-96 bg-saffron-500/12 rounded-full blur-[100px] sm:blur-[140px] animate-glow-pulse" />
        <div className="absolute bottom-[20%] -right-16 w-56 sm:w-72 h-56 sm:h-72 bg-maroon-500/8 rounded-full blur-[80px] sm:blur-[110px] animate-glow-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[60%] left-[40%] w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[130px] animate-glow-pulse" style={{ animationDelay: '4s' }} />

        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,190,106,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,190,106,0.4) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p, i) => (
          <div key={i} className="absolute rounded-full bg-saffron-300 animate-float"
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: `${p.size}px`, height: `${p.size}px`, opacity: p.opacity, animationDuration: `${p.speed}s`, animationDelay: `${p.delay}s` }} />
        ))}
      </div>

      {/* Floating Sinhala letters */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['අ', 'ආ', 'ක', 'ම', 'ස', 'හ', 'ල', 'ර', 'ප', 'බ'].map((letter, i) => (
          <div key={i} className="absolute sinhala-text text-white/[0.02] text-5xl sm:text-7xl font-bold animate-float select-none"
            style={{ left: `${(i * 10)}%`, top: `${(i * 9 + 5) % 85}%`, animationDuration: `${5 + i * 0.7}s`, animationDelay: `${i * 0.45}s` }}>
            {letter}
          </div>
        ))}
      </div>

      {/* Cultural icons */}
      <div className="absolute top-32 left-[6%] text-4xl sm:text-5xl animate-float opacity-10 hidden sm:block">🪷</div>
      <div className="absolute top-[42%] right-[5%] text-3xl sm:text-4xl animate-float opacity-8 hidden sm:block" style={{ animationDelay: '1s' }}>🐘</div>
      <div className="absolute bottom-[22%] left-[8%] text-2xl sm:text-3xl animate-float opacity-8 hidden md:block" style={{ animationDelay: '2s' }}>🛕</div>
      <div className="absolute bottom-[38%] right-[10%] text-3xl animate-float opacity-8 hidden md:block" style={{ animationDelay: '0.5s' }}>🌺</div>
      <div className="absolute top-[65%] left-[35%] text-2xl animate-float opacity-6 hidden lg:block" style={{ animationDelay: '3s' }}>🫖</div>

      {/* ========== CONTENT ========== */}
      <div className="relative z-10 text-center px-5 sm:px-6 max-w-5xl mx-auto pt-20 sm:pt-24 pb-8">
        {/* Cultural video caption — shows which scene is playing */}
        {anyVideoReady && (
          <div className={`mb-5 transition-all duration-700 ${captionVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white/50 text-[10px] font-medium tracking-wider uppercase">
                {CULTURAL_CAPTIONS[activeVideo].sinhala}
              </span>
              <span className="text-white/30 text-[10px]">•</span>
              <span className="text-white/40 text-[10px]">
                {CULTURAL_CAPTIONS[activeVideo].text}
              </span>
            </div>
          </div>
        )}

        {/* Badge */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="inline-flex items-center gap-2.5 glass rounded-full px-4 sm:px-5 py-2 mb-6 sm:mb-8">
            <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-leaf-400 opacity-75" /><span className="relative inline-flex rounded-full h-2 w-2 bg-leaf-400" /></span>
            <span className="text-white/80 text-[10px] sm:text-xs font-medium tracking-wide">v6.1 — Sri Lankan Cultural Video • AI Chatbot • 144 Phrases</span>
          </div>
        </div>

        {/* Title */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-[2.6rem] leading-[1.29] sm:text-6xl md:text-7xl lg:text-8xl xl:text-[7.0rem] font-black text-white mb-3 sm:mb-4 sinhala-text tracking-tight">
            සිංහල පුළුවන්ද<span className="text-saffron-400">?</span>
          </h1>
        </div>

        {/* Typewriter */}
        <div className="animate-slide-up" style={{ animationDelay: '0.35s' }}>
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-saffron-300/90 font-light mb-2 sm:mb-3 tracking-wide font-space h-9 sm:h-10">
            {typedText}<span className="animate-pulse text-saffron-400/80">|</span>
          </p>
          <p className="text-xs sm:text-sm md:text-base text-white/45 max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed px-2">
            Immerse yourself in the beauty of Sri Lanka's ancient language.
            Real-world phrases for real-world moments — powered by AI.
          </p>
        </div>

        {/* CTA */}
        <div className="animate-slide-up flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 sm:mb-12" style={{ animationDelay: '0.5s' }}>
          <button onClick={onStart}
            className="group relative w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-saffron-500 to-saffron-600 text-white font-bold text-sm sm:text-base rounded-2xl shadow-xl shadow-saffron-500/25 hover:shadow-saffron-500/40 transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2">
              {totalWords > 0 ? '🚀 Continue Learning' : '🚀 Start Learning Free'}
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </span>
            <div className="absolute inset-0 animate-shimmer opacity-20" />
          </button>
          <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 glass text-white font-semibold text-sm sm:text-base rounded-2xl hover:bg-white/15 transition-all duration-300">
            🇱🇰 Discover Sri Lanka
          </button>
        </div>

        {/* Fact card */}
        <div className="animate-fade-in glass-dark rounded-2xl p-4 sm:p-5 max-w-xl mx-auto mb-8 sm:mb-10" style={{ animationDelay: '0.7s' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0 mt-0.5">{culturalFacts[factIndex].emoji}</span>
            <div className="text-left min-w-0">
              <p className="text-[10px] text-saffron-400 font-bold uppercase tracking-widest mb-1">Did you know?</p>
              <p className="text-white/75 text-xs sm:text-sm leading-relaxed">{culturalFacts[factIndex].fact}</p>
            </div>
          </div>
          <div className="flex justify-center gap-1.5 mt-3">
            {culturalFacts.map((_, i) => (
              <button key={i} onClick={() => setFactIndex(i)}
                className={`h-1 rounded-full transition-all duration-500 ${i === factIndex ? 'w-6 bg-saffron-400' : 'w-1.5 bg-white/15 hover:bg-white/30'}`} />
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="animate-slide-up grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 max-w-2xl mx-auto" style={{ animationDelay: '0.9s' }}>
          {[
            { value: '12', label: 'Scenarios', icon: '📚' },
            { value: '144', label: 'Phrases', icon: '🗣️' },
            { value: `Lv.${level}`, label: 'Your Level', icon: '⭐' },
            { value: streak > 0 ? `${streak}🔥` : '—', label: 'Streak', icon: '📅' },
          ].map((s, i) => (
            <div key={i} className="glass rounded-xl p-2.5 sm:p-3.5 text-center hover:bg-white/8 transition-all duration-300 cursor-default">
              <span className="text-sm sm:text-base block mb-0.5">{s.icon}</span>
              <p className="text-base sm:text-xl font-bold text-saffron-400 font-space">{s.value}</p>
              <p className="text-white/35 text-[9px] sm:text-[10px] mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
        <span className="text-white/25 text-[9px] uppercase tracking-[0.25em] font-medium">Scroll</span>
        <svg className="w-3.5 h-3.5 text-white/25" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
      </div>
    </section>
  );
}
