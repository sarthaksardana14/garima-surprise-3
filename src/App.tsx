import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { Heart, Sparkles, Lock, Unlock, ChevronRight, MessageCircleHeart, Wand2, Stars, Quote, Camera, Image as ImageIcon, Gift } from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Types ---
type ViewState = 'loading' | 'unlock' | 'main';

// --- Components ---

const Butterfly = ({ className }: { className?: string }) => (
  <div className={`butterfly ${className}`}>
    <div className="butterfly-wings">🦋</div>
  </div>
);

const FloatingElements = () => {
  const [elements, setElements] = useState<{ id: number; x: number; y: number; size: number; duration: number; delay: number; type: 'heart' | 'sparkle' | 'butterfly' }[]>([]);

  useEffect(() => {
    const newElements = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * (30 - 10) + 10,
      duration: Math.random() * (10 - 5) + 5,
      delay: Math.random() * 5,
      type: i % 4 === 0 ? 'butterfly' : i % 4 === 1 ? 'sparkle' : 'heart' as const,
    }));
    setElements(newElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          initial={{ y: '110vh', opacity: 0 }}
          animate={{ 
            y: '-10vh', 
            opacity: [0, 0.6, 0],
            x: `${el.x + Math.sin(el.id) * 8}vw`
          }}
          transition={{
            duration: el.duration,
            repeat: Infinity,
            delay: el.delay,
            ease: "linear"
          }}
          style={{
            position: 'absolute',
            left: `${el.x}vw`,
            fontSize: el.size,
          }}
        >
          {el.type === 'heart' && <Heart className="text-romantic-pink/30 fill-romantic-pink/20" />}
          {el.type === 'sparkle' && <Sparkles className="text-blush-pink/40" />}
          {el.type === 'butterfly' && <Butterfly className="opacity-30" />}
        </motion.div>
      ))}
    </div>
  );
};

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div 
        className="custom-cursor hidden md:block" 
        style={{ transform: `translate(${position.x - 6}px, ${position.y - 6}px)` }} 
      />
      <div 
        className="custom-cursor-glow hidden md:block" 
        style={{ transform: `translate(${position.x - 30}px, ${position.y - 30}px)` }} 
      />
    </>
  );
};

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const messages = [
    "Preparing a little surprise...",
    "Scanning visitor...",
    "Detecting Bhaalu...",
    "Smile verified...",
    "Access pending..."
  ];

  useEffect(() => {
    if (step < messages.length) {
      const timer = setTimeout(() => setStep(step + 1), 1200);
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blush-pink via-lavender to-peach"
      exit={{ opacity: 0 }}
    >
      <FloatingElements />
      <motion.div 
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative z-10 text-center"
      >
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="mb-8 flex justify-center"
        >
          <Heart size={64} className="text-romantic-pink fill-romantic-pink shadow-lg" />
        </motion.div>
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            className="text-xl font-display italic text-romantic-pink font-medium"
          >
            {messages[step] || "Welcome..."}
          </motion.p>
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const UnlockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleUnlock = () => {
    const validPasswords = ['bhaalu', 'bhalu', 'Bhaalu', 'Bhalu'];
    if (validPasswords.includes(password.trim())) {
      setSuccess(true);
      setError(false);
      setMessage("Awwww… this Bhaalu has brain toooo 🐻💖");
      setTimeout(() => {
        setMessage("Welcome Garima… your surprise is ready.");
        setTimeout(onUnlock, 2000);
      }, 2000);
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 z-40 flex items-center justify-center bg-gradient-to-tr from-lavender via-blush-pink to-peach p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <FloatingElements />
      <motion.div 
        className="glass p-8 rounded-[3rem] max-w-md w-full relative z-10 text-center border-glow"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="mb-6 flex justify-center">
          <div className="bg-white/50 p-4 rounded-full shadow-inner">
            {success ? <Unlock className="text-green-500" size={40} /> : <Lock className="text-romantic-pink" size={40} />}
          </div>
        </div>
        
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-2">
          Only for one special person 🐻💖
        </h2>
        <p className="text-slate-600 mb-8 text-sm font-medium">
          Enter your secret nickname to unlock this surprise.
        </p>

        {!success ? (
          <motion.div 
            animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
            className="space-y-4"
          >
            <input 
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Type your nickname 🐻"
              className={`w-full px-6 py-4 rounded-2xl border-2 transition-all outline-none text-center font-medium shadow-sm ${
                error ? 'border-red-300 bg-red-50' : 'border-blush-pink focus:border-romantic-pink bg-white/60'
              }`}
              onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
            />
            {error && (
              <p className="text-red-500 text-sm font-medium">
                Hppp… wrong answer 🙈 Try again Bhaalu.
              </p>
            )}
            <button 
              onClick={handleUnlock}
              className="w-full py-4 bg-romantic-pink text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Unlock My Surprise 💖
            </button>
          </motion.div>
        ) : (
          <div className="py-8 space-y-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-4xl"
            >
              🐻
            </motion.div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-romantic-pink font-cursive text-2xl font-bold"
            >
              {message}
            </motion.p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

const MemoryLane = () => {
  // EDIT THESE URLS TO ADD YOUR PHOTOS TO THE SCRAPBOOK
  const slides = [
    { 
      id: 1, 
      caption: "Proof that one smile can fix an entire day.", 
      color: "bg-blush-pink",
      image: "https://drive.google.com/thumbnail?id=1Agqs2lzrTISmBn3YcuQh-URJcxWllYd5&sz=w2000" 
    },
    { 
      id: 2, 
      caption: "Agar mujhe fit checks na bheje… to itna maarugi naa 😤", 
      color: "bg-lavender",
      image: "https://drive.google.com/thumbnail?id=19lpM8cXKn9VCIcjDZZfJAlw_kAScO9wG&sz=w2000" 
    },
    { 
      id: 3, 
      caption: "Some smiles are normal. Some smiles feel like sunshine.", 
      color: "bg-peach",
      image: "https://drive.google.com/thumbnail?id=1lz58RG7WKA5OUrz5wOrqj8F13JZuZie5&sz=w2000" 
    },
    { 
      id: 4, 
      caption: "Unki gehri aankhon mein kuch alag hi kahani hai.", 
      color: "bg-baby-pink",
      image: "https://drive.google.com/thumbnail?id=1ouYANCBQ8a_YcgVbj51zvHzswenMyVvd&sz=w2000" 
    },
    { 
      id: 5, 
      caption: "Some people look beautiful. Some people just make everything around them feel beautiful. 😂", 
      color: "bg-white/60",
      image: "https://drive.google.com/thumbnail?id=1oABtB1V8MQ55TW_mqVWol-PURsTxY25I&sz=w2000" 
    },
  ];

  return (
    <div className="py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-800">Digital Scrapbook 📸</h2>
        <p className="text-slate-500 mt-2 italic">A collection of moments and thoughts...</p>
      </div>
      <div className="flex gap-8 overflow-x-auto px-12 pb-16 snap-x no-scrollbar">
        {slides.map((slide) => (
          <motion.div 
            key={slide.id}
            className={`flex-shrink-0 w-80 h-[480px] scrapbook-card snap-center overflow-hidden flex flex-col border border-white/40 group`}
            whileHover={{ y: -15, rotate: slide.id % 2 === 0 ? 1 : -1 }}
          >
            <div className={`h-2/3 ${slide.color} flex items-center justify-center relative overflow-hidden`}>
              {slide.image ? (
                <img 
                  src={slide.image} 
                  alt={slide.caption}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <>
                  <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/paper-fibers.png')]"></div>
                  <Butterfly className="absolute top-4 right-4 opacity-40" />
                  
                  {/* Photo Placeholder Area */}
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <ImageIcon className="text-slate-800/20 w-24 h-24" />
                      <motion.div 
                        className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-md text-romantic-pink"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      >
                        <Camera size={20} />
                      </motion.div>
                    </div>
                    <div className="text-6xl opacity-30">✨</div>
                  </div>
                </>
              )}

              <div className="absolute bottom-4 left-4 text-[10px] font-mono text-slate-400 bg-white/30 px-2 py-1 rounded">MOMENT_{slide.id}</div>
            </div>
            <div className="p-8 flex-grow flex items-center justify-center text-center bg-white/20">
              <p className="text-slate-700 font-medium italic leading-relaxed font-sans">
                "{slide.caption}"
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ComplimentGenerator = () => {
  const compliments = [
    "That smile should honestly be illegal.",
    "Some people look nice in photos. You somehow make photos look nice.",
    "If happiness had a face… it would probably look like yours.",
    "Your smile has a suspicious ability to improve people's day.",
    "There should be a warning sign before someone sees your smile.",
    "Some people are pretty. Some people are effortlessly beautiful.",
    "Your vibe is dangerously positive.",
    "Honestly unfair how one person can have both a smile and those eyes."
  ];
  const [current, setCurrent] = useState("");

  const generate = () => {
    const random = compliments[Math.floor(Math.random() * compliments.length)];
    setCurrent(random);
  };

  return (
    <div className="py-24 bg-gradient-to-r from-blush-pink/10 via-white/40 to-peach/10">
      <div className="max-w-md mx-auto px-4 text-center">
        <h2 className="text-3xl font-display font-bold text-slate-800 mb-10">A Little Note for You 💌</h2>
        <div className="min-h-[160px] flex items-center justify-center mb-10 p-8 glass rounded-[2.5rem] border-glow relative">
          <Butterfly className="absolute -top-4 -left-4 opacity-50 scale-75" />
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div 
                key={current}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-romantic-pink font-semibold text-xl italic leading-relaxed"
              >
                {current}
              </motion.div>
            ) : (
              <p className="text-slate-400 italic">Click the heart to see a message...</p>
            )}
          </AnimatePresence>
        </div>
        <button 
          onClick={generate}
          className="px-10 py-5 bg-romantic-pink text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all active:scale-95 flex items-center justify-center gap-3 mx-auto"
        >
          Generate a compliment for Garima 💖
        </button>
      </div>
    </div>
  );
};

const SecretMessage = () => {
  const [unlocked, setUnlocked] = useState(false);

  return (
    <div className="py-24 px-4">
      <motion.div 
        className="max-w-lg mx-auto glass p-10 rounded-[3rem] text-center cursor-pointer relative overflow-hidden border-glow"
        onClick={() => setUnlocked(true)}
        whileHover={{ scale: 1.02 }}
      >
        <AnimatePresence mode="wait">
          {!unlocked ? (
            <motion.div 
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16"
            >
              <Lock className="mx-auto mb-6 text-romantic-pink/40" size={56} />
              <h3 className="text-2xl font-display font-bold text-slate-700">Click to Unlock a Secret</h3>
              <p className="text-slate-400 text-sm mt-2">Just for your eyes...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="unlocked"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="py-10"
            >
              <Quote className="mx-auto mb-8 text-romantic-pink/20" size={48} />
              <p className="text-2xl md:text-3xl font-display italic text-slate-800 leading-relaxed mb-6">
                "Some people don’t try to change the world."
              </p>
              <p className="text-2xl font-cursive text-romantic-pink font-bold">
                "They simply exist in it… and somehow make it feel a little brighter."
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const CelebrationEnding = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [showHearts, setShowHearts] = useState(false);

  useEffect(() => {
    if (isInView) {
      // Initial Burst
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#FFB6C1', '#FF69B4', '#FFC0CB', '#E6E6FA'],
        zIndex: 100
      });

      // Delayed slow fall confetti
      const end = Date.now() + 7000;
      const frame = () => {
        if (Date.now() > end) return;
        
        confetti({
          particleCount: 1,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: Math.random() * 0.5 },
          colors: ['#FFB6C1', '#FF69B4'],
          gravity: 0.6,
          scalar: 0.8,
          zIndex: 100
        });
        confetti({
          particleCount: 1,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: Math.random() * 0.5 },
          colors: ['#FFB6C1', '#FF69B4'],
          gravity: 0.6,
          scalar: 0.8,
          zIndex: 100
        });

        requestAnimationFrame(frame);
      };
      
      setTimeout(frame, 1000);

      setShowHearts(true);
      // Hearts will naturally finish their animation cycle
    }
  }, [isInView]);

  return (
    <footer 
      ref={containerRef}
      className="py-48 px-6 bg-gradient-to-b from-transparent to-blush-pink/20 text-center relative overflow-hidden"
    >
      <AnimatePresence>
        {showHearts && (
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  top: -100, 
                  left: `${Math.random() * 100}%`,
                  opacity: 0,
                  scale: Math.random() * 0.5 + 0.5,
                  rotate: Math.random() * 360
                }}
                animate={{ 
                  top: '120vh',
                  left: `${(Math.random() - 0.5) * 30 + 50}%`, // More drift
                  opacity: [0, 1, 1, 0],
                  rotate: Math.random() * 720
                }}
                transition={{ 
                  duration: 7 + Math.random() * 5,
                  ease: "linear",
                  delay: Math.random() * 8
                }}
                className="absolute text-romantic-pink/40 drop-shadow-[0_0_10px_rgba(255,182,193,0.8)]"
              >
                <Heart size={Math.random() * 30 + 20} fill="currentColor" />
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10"
      >
        <div className="mb-10 flex justify-center">
          <motion.div
            animate={{ 
              filter: ["drop-shadow(0 0 0px #FFB6C1)", "drop-shadow(0 0 20px #FFB6C1)", "drop-shadow(0 0 0px #FFB6C1)"],
              scale: [1, 1.1, 1]
            }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <Butterfly className="scale-150" />
          </motion.div>
        </div>
        
        <div className="relative inline-block mb-8">
          <h2 className="text-5xl md:text-7xl font-display font-bold text-slate-800 relative z-10">
            Happy Women's Day Garima 💐
          </h2>
          <motion.div
            className="absolute -inset-8 bg-romantic-pink/10 blur-3xl rounded-full -z-10"
            animate={{ 
              opacity: [0.2, 0.5, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
        </div>

        <p className="text-2xl md:text-3xl text-slate-600 italic mb-10 font-medium max-w-2xl mx-auto leading-relaxed">
          Never change the magic that makes you, you.
        </p>
        
        <div className="flex justify-center gap-10 text-4xl">
          <motion.span animate={{ scale: [1, 1.4, 1], rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 3 }}>💖</motion.span>
          <motion.span animate={{ scale: [1, 1.4, 1], rotate: [0, -15, 15, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 0.7 }}>✨</motion.span>
          <motion.span animate={{ scale: [1, 1.4, 1], rotate: [0, 20, -20, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1.4 }}>🦋</motion.span>
        </div>
      </motion.div>
      
      {/* Sparkle Field */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-romantic-pink/30"
            initial={{ 
              top: `${Math.random() * 100}%`, 
              left: `${Math.random() * 100}%`,
              scale: 0
            }}
            whileInView={{ 
              scale: [0, 1.2, 0],
              opacity: [0, 0.8, 0],
              rotate: [0, 180]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3 + Math.random() * 3,
              delay: Math.random() * 5
            }}
          >
            <Sparkles size={Math.random() * 10 + 10} />
          </motion.div>
        ))}
      </div>
    </footer>
  );
};

const Hero = ({ onNext }: { onNext: () => void }) => {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center relative px-4 text-center overflow-hidden">
      <FloatingElements />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="relative z-10"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 6 }}
          className="mb-8 inline-block"
        >
          <Butterfly className="text-5xl" />
        </motion.div>
        <h1 className="text-6xl md:text-8xl font-display font-bold text-slate-800 mb-6 tracking-tight">
          Happy Women's Day <br />
          <span className="text-romantic-pink text-glow">Garima</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 font-medium italic mb-14 max-w-2xl mx-auto leading-relaxed">
          A magical digital scrapbook made with love, <br className="hidden md:block" /> just for someone very special.
        </p>
        <button 
          onClick={onNext}
          className="px-12 py-6 bg-white text-romantic-pink border-2 border-romantic-pink/30 rounded-full font-bold text-xl shadow-lg hover:bg-romantic-pink hover:text-white hover:border-romantic-pink transition-all duration-500 animate-pulse"
        >
          Open the Surprise ✨
        </button>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 15, 0] }}
        transition={{ repeat: Infinity, duration: 2.5 }}
      >
        <ChevronRight className="rotate-90 text-romantic-pink/30" size={40} />
      </motion.div>
    </section>
  );
};

const MagicMode = () => {
  const [active, setActive] = useState(false);
  const [hearts, setHearts] = useState<{ id: number; x: number; delay: number; size: number }[]>([]);
  const [magicButterflies, setMagicButterflies] = useState<{ id: number; x: number; y: number; delay: number }[]>([]);

  const trigger = () => {
    setActive(true);
    // 100 hearts floating upward
    const newHearts = Array.from({ length: 100 }).map((_, i) => ({
      id: Date.now() + i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      size: Math.random() * (30 - 15) + 15
    }));
    
    // Extra butterflies
    const newButterflies = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i + 200,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2
    }));

    setHearts(newHearts);
    setMagicButterflies(newButterflies);
    
    setTimeout(() => {
      setActive(false);
      setHearts([]);
      setMagicButterflies([]);
    }, 6000);
  };

  return (
    <div className={`py-24 text-center relative overflow-hidden transition-colors duration-1000 ${active ? 'bg-gradient-to-br from-romantic-pink/10 via-lavender/20 to-blush-pink/10' : ''}`}>
      <h2 className="text-3xl font-display font-bold text-slate-800 mb-10">Ready for some Magic? ✨</h2>
      <button 
        onClick={trigger}
        disabled={active}
        className={`px-10 py-5 rounded-full font-bold shadow-lg transition-all flex items-center justify-center gap-3 mx-auto text-lg ${
          active ? 'bg-slate-200 text-slate-400' : 'bg-gradient-to-r from-romantic-pink via-lavender to-blush-pink text-white hover:scale-110 hover:shadow-romantic-pink/30 border border-white/20'
        }`}
      >
        <Stars size={24} className={active ? '' : 'animate-pulse'} />
        Activate Magic Mode ✨
      </button>

      <AnimatePresence>
        {hearts.map((h) => (
          <motion.div
            key={h.id}
            initial={{ y: '110vh', x: `${h.x}vw`, opacity: 0, scale: 0.5 }}
            animate={{ 
              y: '-10vh', 
              x: `${h.x + (Math.sin(h.id) * 15)}vw`, 
              opacity: [0, 1, 1, 0], 
              scale: [0.5, 1.2, 1, 0.8],
              rotate: [0, 45, -45, 0]
            }}
            transition={{ duration: 4, delay: h.delay, ease: "easeOut" }}
            className="fixed pointer-events-none z-[100]"
            style={{ left: 0, top: 0, fontSize: h.size }}
          >
            {['💖', '🌸', '✨', '💕', '💗'][h.id % 5]}
          </motion.div>
        ))}
        
        {magicButterflies.map((b) => (
          <motion.div
            key={b.id}
            initial={{ x: '-10vw', y: `${b.y}vh`, opacity: 0 }}
            animate={{ 
              x: '110vw', 
              y: `${b.y + Math.sin(b.id) * 10}vh`,
              opacity: [0, 1, 1, 0]
            }}
            transition={{ duration: 6, delay: b.delay, ease: "linear" }}
            className="fixed pointer-events-none z-[95] text-2xl"
          >
            <Butterfly />
          </motion.div>
        ))}
      </AnimatePresence>
      
      {active && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-[90] bg-gradient-to-br from-romantic-pink/5 via-lavender/10 to-transparent backdrop-blur-[1px]"
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-white animate-sparkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            >
              ✨
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<ViewState>('loading');
  const mainRef = useRef<HTMLDivElement>(null);

  const scrollToContent = () => {
    const nextSection = document.getElementById('message-section');
    nextSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (view === 'loading') return <LoadingScreen onComplete={() => setView('unlock')} />;
  if (view === 'unlock') return <UnlockScreen onUnlock={() => setView('main')} />;

  return (
    <div className="min-h-screen selection:bg-romantic-pink/30 font-sans" ref={mainRef}>
      <CustomCursor />
      
      {/* Hero Section */}
      <Hero onNext={scrollToContent} />

      {/* Cute Message Section */}
      <section id="message-section" className="py-40 px-6 bg-white/30 relative overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="relative inline-block">
              <MessageCircleHeart className="mx-auto text-romantic-pink" size={64} />
              <Butterfly className="absolute -top-4 -right-8 scale-125 opacity-60" />
            </div>
            <div className="space-y-8 text-2xl md:text-4xl font-display italic text-slate-700 leading-relaxed">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Garima, today is about celebrating strong and amazing women.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                But honestly… this website exists because someone special deserves a little celebration today.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="text-romantic-pink font-bold not-italic"
              >
                So here’s a small surprise made just for you.
              </motion.p>
            </div>
          </motion.div>
        </div>
        <div className="absolute top-0 right-0 p-24 opacity-5 text-romantic-pink">
          <Stars size={300} />
        </div>
        <div className="absolute bottom-0 left-0 p-24 opacity-5 text-romantic-pink">
          <Heart size={250} />
        </div>
      </section>

      {/* Memory Lane */}
      <MemoryLane />

      {/* Compliment Generator */}
      <ComplimentGenerator />

      {/* Magic Mode */}
      <MagicMode />

      {/* Secret Message */}
      <SecretMessage />

      {/* Final Celebration Section */}
      <CelebrationEnding />
    </div>
  );
}
