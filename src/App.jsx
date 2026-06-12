import React, { useState, useEffect, useRef, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Heart,
  Music,
  Calendar,
  List,
  Image,
  BookOpen,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  LogOut,
  Settings,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Shuffle,
  Repeat,
  ArrowLeft,
  Camera,
  FileText,
  X,
  ChevronRight,
  Check
} from 'lucide-react';

// Initialize Supabase Client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

// --- HELPER FUNCTIONS ---
const generateInviteCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

const getDaysTogether = (startDate) => {
  if (!startDate) return null;
  const start = new Date(startDate);
  if (isNaN(start.getTime())) return null;
  const today = new Date();
  const startUTC = Date.UTC(start.getFullYear(), start.getMonth(), start.getDate());
  const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  const diffTime = todayUTC - startUTC;
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : 0;
};

const formatDate = (dateStr, options = { month: 'LONG', day: 'numeric', year: 'numeric' }) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return String(dateStr).toUpperCase();
  }
  return date.toLocaleDateString('en-US', options).toUpperCase();
};

const randomQuotes = [
  'My love for you is a journey, starting at forever and ending at never.',
  'In you, I have found my home and my adventure.',
  'You are my today and all of my tomorrows.',
  'I love you not only for what you are, but for what I am when I am with you.',
  'Whatever our souls are made of, his and hers are the same.'
];

// --- CANVAS STARFIELD ---
const StarfieldCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    handleResize();
    window.addEventListener('resize', handleResize);

    // Initial 120 stars
    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: 0.5 + Math.random() * 2,
      opacity: Math.random() * 0.8 + 0.2,
      twinkleSpeed: 0.005 + Math.random() * 0.015,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      vx: (Math.random() - 0.5) * 0.08,
      vy: (Math.random() - 0.5) * 0.08,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Twinkle opacity
        star.opacity += star.twinkleSpeed * star.twinkleDir;
        if (star.opacity >= 1) {
          star.opacity = 1;
          star.twinkleDir = -1;
        } else if (star.opacity <= 0.15) {
          star.opacity = 0.15;
          star.twinkleDir = 1;
        }

        // Slow drift
        star.x += star.vx;
        star.y += star.vy;

        // Boundary wrap
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none block" />;
};

// --- NEBULA BACKGROUND ---
const NebulaBackground = ({ purple = false }) => {
  const color1 = purple ? '#0d0d2b' : '#3d1a1a';
  const color2 = purple ? '#1a0a2e' : '#2a1520';

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#0a0a0a]">
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{ transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)` }}
      >
        <div
          className="nebula-blob-1 absolute w-[350px] h-[350px] md:w-[650px] md:h-[650px] rounded-full filter blur-[70px] md:blur-[110px] opacity-35 top-[-10%] left-[-10%]"
          style={{
            background: `radial-gradient(circle, ${color1} 0%, ${color2} 60%, transparent 100%)`
          }}
        />
        <div
          className="nebula-blob-2 absolute w-[300px] h-[300px] md:w-[550px] md:h-[550px] rounded-full filter blur-[60px] md:blur-[100px] opacity-30 bottom-[10%] right-[-5%]"
          style={{
            background: `radial-gradient(circle, ${color2} 0%, ${color1} 60%, transparent 100%)`
          }}
        />
        <div
          className="nebula-blob-3 absolute w-[250px] h-[250px] md:w-[450px] md:h-[450px] rounded-full filter blur-[50px] md:blur-[90px] opacity-25 top-[40%] left-[30%]"
          style={{
            background: `radial-gradient(circle, ${color1} 0%, ${color2} 70%, transparent 100%)`
          }}
        />
      </div>
    </div>
  );
};

// --- MAIN APPLICATION COMPONENT ---
export default function App() {
  // Navigation State
  const [page, setPage] = useState('landing'); // landing, auth, hub, memories, letters, reasons, dateplanner, songs, ourworld

  // Floating click hearts state
  const [clickHearts, setClickHearts] = useState([]);

  const handlePageClick = (e) => {
    const heart = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      size: 14 + Math.random() * 16,
      angle: (Math.random() - 0.5) * 35
    };
    setClickHearts((prev) => [...prev, heart]);
  };

  useEffect(() => {
    if (clickHearts.length === 0) return;
    const timer = setTimeout(() => {
      setClickHearts((prev) => prev.slice(1));
    }, 1200);
    return () => clearTimeout(timer);
  }, [clickHearts]);

  // Auth & Profile states
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [couple, setCouple] = useState(null);

  // Global notifications
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Invites modal helper
  const [inviteModalCode, setInviteModalCode] = useState('');

  // Settings Modal state
  const [showSettings, setShowSettings] = useState(false);

  // --- AUDIO STATES & REFERENCE ---
  const audioRef = useRef(new Audio());
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isShuffle, setIsShuffle] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);

  // Setup HTML5 Audio Event Listeners
  useEffect(() => {
    const audio = audioRef.current;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => handleAudioEnded();

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [songs, currentSong, isShuffle, isRepeat]);

  // Audio helper handlers
  const loadAndPlaySong = (songToPlay) => {
    if (!songToPlay) return;
    const audio = audioRef.current;
    
    // If it's already the loaded song, just toggle play
    if (currentSong && currentSong.id === songToPlay.id) {
      if (audio.paused) {
        audio.play().catch(err => console.log(err));
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
      return;
    }

    audio.src = songToPlay.audio_url;
    audio.load();
    audio.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error("Audio playback error:", err);
        setErrorMsg("Failed to stream audio file.");
      });
    setCurrentSong(songToPlay);
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio.src) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => console.log(err));
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    if (isRepeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => console.log(err));
    } else {
      handleNextSong();
    }
  };

  const handleNextSong = () => {
    if (songs.length === 0) return;
    let nextIdx = 0;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * songs.length);
    } else if (currentSong) {
      const currIdx = songs.findIndex(s => s.id === currentSong.id);
      nextIdx = (currIdx + 1) % songs.length;
    }
    loadAndPlaySong(songs[nextIdx]);
  };

  const handlePrevSong = () => {
    if (songs.length === 0) return;
    let prevIdx = 0;
    if (isShuffle) {
      prevIdx = Math.floor(Math.random() * songs.length);
    } else if (currentSong) {
      const currIdx = songs.findIndex(s => s.id === currentSong.id);
      prevIdx = currIdx - 1 < 0 ? songs.length - 1 : currIdx - 1;
    }
    loadAndPlaySong(songs[prevIdx]);
  };

  const handleScrub = (e) => {
    const time = parseFloat(e.target.value);
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  // Format audio timestamps
  const formatTime = (secs) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- AUTH INITIALIZATION ---
  useEffect(() => {
    // Check initial active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setCouple(null);
        setPage('landing');
      }
    });

    // Handle authentication updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchUserData(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setCouple(null);
        // Clean audio
        audioRef.current.pause();
        audioRef.current.src = '';
        setCurrentSong(null);
        setIsPlaying(false);
        setPage('landing');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserData = async (userId) => {
    setLoading(true);
    try {
      const { data: prof, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (profErr) throw profErr;

      if (prof) {
        setProfile(prof);
        if (prof.couple_id) {
          const { data: cpl, error: cplErr } = await supabase
            .from('couples')
            .select('*')
            .eq('id', prof.couple_id)
            .maybeSingle();

          if (cplErr) throw cplErr;
          if (cpl) {
            setCouple(cpl);
            setPage('hub');
          } else {
            // Profile has couple_id but couples table row deleted or missing
            setPage('auth');
          }
        } else {
          // Logged in but not connected to a couple
          setPage('auth');
        }
      } else {
        // No profile exists yet
        setPage('auth');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Error loading account profile information.");
    } finally {
      setLoading(false);
    }
  };

  // Settings updates
  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    if (!couple) return;
    const formData = new FormData(e.target);
    const relationship_start = formData.get('relationship_start') || null;
    const him_name = formData.get('him_name') || '';
    const her_name = formData.get('her_name') || '';

    setLoading(true);
    try {
      const { error } = await supabase
        .from('couples')
        .update({ relationship_start, him_name, her_name })
        .eq('id', couple.id);

      if (error) throw error;

      // Refetch
      const { data: updatedCouple } = await supabase
        .from('couples')
        .select('*')
        .eq('id', couple.id)
        .single();
      setCouple(updatedCouple);
      setSuccessMsg("Settings updated successfully!");
      setShowSettings(false);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to update couple settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setLoading(false);
  };

  // Helper alerts timeout
  useEffect(() => {
    if (errorMsg) {
      const t = setTimeout(() => setErrorMsg(''), 5000);
      return () => clearTimeout(t);
    }
  }, [errorMsg]);

  useEffect(() => {
    if (successMsg) {
      const t = setTimeout(() => setSuccessMsg(''), 4000);
      return () => clearTimeout(t);
    }
  }, [successMsg]);

  // Load playlist when page or couple changes
  useEffect(() => {
    if (couple?.id) {
      const fetchSongsList = async () => {
        const { data } = await supabase
          .from('songs')
          .select('*')
          .eq('couple_id', couple.id)
          .order('created_at', { ascending: true });
        if (data) setSongs(data);
      };
      fetchSongsList();
    }
  }, [couple?.id]);

  return (
    <div 
      onClick={handlePageClick}
      className="relative min-h-screen font-sans selection:bg-[#E8442A]/40 selection:text-white"
    >
      {/* Click Floating Hearts Overlay */}
      {clickHearts.map(h => (
        <span
          key={h.id}
          className="fixed pointer-events-none text-[#E8442A] select-none z-[9999] animate-float-heart"
          style={{
            left: h.x,
            top: h.y,
            fontSize: `${h.size}px`,
            transform: `translate(-50%, -50%) rotate(${h.angle}deg)`
          }}
        >
          ❤
        </span>
      ))}

      {/* Dynamic Background Layouts */}
      {page === 'landing' && <StarfieldCanvas />}
      {page !== 'landing' && <NebulaBackground purple={page === 'ourworld'} />}

      {/* Global Alerts / Toasts */}
      {errorMsg && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#3d1a1a] border border-[#E8442A]/60 px-5 py-3 rounded-full text-white text-sm shadow-xl flex items-center gap-2 animate-[slide-up_0.2s_ease-out]">
          <span className="w-2 h-2 bg-[#E8442A] rounded-full animate-ping" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-[#1d3d24] border border-[#2ae856]/60 px-5 py-3 rounded-full text-white text-sm shadow-xl flex items-center gap-2 animate-[slide-up_0.2s_ease-out]">
          <span className="text-[#2ae856]">✔</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] flex flex-col items-center justify-center">
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 border-4 border-[#E8442A]/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-[#E8442A] rounded-full animate-spin" />
          </div>
          <p className="mt-4 text-sm text-[#aaaaaa] font-medium tracking-widest uppercase">Loading Our World...</p>
        </div>
      )}

      {/* Persistent Settings Modal */}
      {showSettings && couple && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="glass-card rounded-3xl w-full max-w-md p-8 modal-animate-up relative">
            <button
              onClick={() => setShowSettings(false)}
              className="absolute top-6 right-6 text-[#aaaaaa] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-2 mb-6">
              <Settings className="text-[#E8442A]" size={24} />
              <h2 className="text-2xl font-serif text-white">Couple Settings</h2>
            </div>

            <form onSubmit={handleUpdateSettings} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Him (Name)
                </label>
                <input
                  type="text"
                  name="him_name"
                  defaultValue={couple.him_name || ''}
                  placeholder="Enter name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Her (Name)
                </label>
                <input
                  type="text"
                  name="her_name"
                  defaultValue={couple.her_name || ''}
                  placeholder="Enter name"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Relationship Anniversary Date
                </label>
                <input
                  type="date"
                  name="relationship_start"
                  defaultValue={couple.relationship_start || ''}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors [color-scheme:dark]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#E8442A] text-white font-medium rounded-full py-3.5 hover:brightness-110 hover:shadow-lg hover:shadow-[#E8442A]/20 active:scale-[0.98] transition-all"
                >
                  Save Anniversary & Profiles
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Persistent Code Modal (SignUp Flow) */}
      {inviteModalCode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-card rounded-3xl w-full max-w-md p-8 modal-animate-up text-center">
            <div className="mx-auto w-16 h-16 bg-[#E8442A]/10 rounded-full flex items-center justify-center mb-6">
              <Heart className="text-[#E8442A]" size={32} fill="#E8442A" />
            </div>
            
            <h2 className="text-3xl font-serif text-white mb-2">Space Created!</h2>
            <p className="text-[#aaaaaa] text-sm mb-6">
              Share this invite code with your partner. They will enter it during Sign Up to join your private universe.
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
              <div className="text-xs text-[#aaaaaa] uppercase tracking-widest mb-1">Invite Code</div>
              <div className="text-4xl font-mono text-white font-bold tracking-wider select-all">
                {inviteModalCode}
              </div>
            </div>

            <button
              onClick={() => {
                setInviteModalCode('');
                setPage('hub');
              }}
              className="w-full bg-[#E8442A] text-white font-medium rounded-full py-3.5 hover:brightness-110 hover:shadow-lg hover:shadow-[#E8442A]/20 active:scale-[0.98] transition-all"
            >
              Enter Our World
            </button>
          </div>
        </div>
      )}

      {/* --- CONTENT CONTAINER WITH TRANSITION CLASS --- */}
      <main className="relative z-10 w-full min-h-screen flex flex-col justify-between">
        {/* Render Active Page */}
        <div className="w-full flex-grow pb-20 animate-fade-in">
          {page === 'landing' && <LandingPage setPage={setPage} />}
          {page === 'auth' && (
            <AuthPage
              setPage={setPage}
              fetchUserData={fetchUserData}
              setInviteModalCode={setInviteModalCode}
              setErrorMsg={setErrorMsg}
              setLoading={setLoading}
            />
          )}
          {page === 'hub' && (
            <HubPage
              couple={couple}
              profile={profile}
              setPage={setPage}
              handleLogout={handleLogout}
              setShowSettings={setShowSettings}
            />
          )}
          {page === 'memories' && (
            <MemoriesPage
              couple={couple}
              profile={profile}
              setPage={setPage}
              setErrorMsg={setErrorMsg}
              setSuccessMsg={setSuccessMsg}
            />
          )}
          {page === 'letters' && (
            <LettersPage
              couple={couple}
              profile={profile}
              setPage={setPage}
              setErrorMsg={setErrorMsg}
              setSuccessMsg={setSuccessMsg}
            />
          )}
          {page === 'reasons' && (
            <ReasonsPage
              couple={couple}
              profile={profile}
              setPage={setPage}
              setErrorMsg={setErrorMsg}
              setSuccessMsg={setSuccessMsg}
            />
          )}
          {page === 'dateplanner' && (
            <DatePlannerPage
              couple={couple}
              profile={profile}
              setPage={setPage}
              setErrorMsg={setErrorMsg}
              setSuccessMsg={setSuccessMsg}
            />
          )}
          {page === 'songs' && (
            <SongsPage
              couple={couple}
              profile={profile}
              setPage={setPage}
              songs={songs}
              setSongs={setSongs}
              currentSong={currentSong}
              isPlaying={isPlaying}
              duration={duration}
              currentTime={currentTime}
              isShuffle={isShuffle}
              isRepeat={isRepeat}
              setIsShuffle={setIsShuffle}
              setIsRepeat={setIsRepeat}
              loadAndPlaySong={loadAndPlaySong}
              togglePlay={togglePlay}
              handleNextSong={handleNextSong}
              handlePrevSong={handlePrevSong}
              handleScrub={handleScrub}
              formatTime={formatTime}
              setErrorMsg={setErrorMsg}
              setSuccessMsg={setSuccessMsg}
            />
          )}
          {page === 'ourworld' && (
            <OurWorldPage
              setPage={setPage}
              couple={couple}
            />
          )}
        </div>

        {/* --- MINI PERSISTENT PLAYER BAR --- */}
        {currentSong && page !== 'landing' && (
          <div
            onClick={() => setPage('songs')}
            className="fixed bottom-0 left-0 right-0 h-14 bg-[#0e0e0e]/85 backdrop-blur-lg border-t border-white/10 z-40 px-4 flex items-center justify-between cursor-pointer transition-all duration-300 hover:bg-[#151515]/90"
          >
            {/* Top tiny progress line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-white/10">
              <div
                className="h-full bg-[#E8442A]"
                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-[30px] h-[30px] rounded-full overflow-hidden bg-[#222] flex-shrink-0 border border-white/10">
                {currentSong.album_art_url ? (
                  <img src={currentSong.album_art_url} alt="art" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#E8442A]/20">
                    <Music className="text-[#E8442A]" size={14} />
                  </div>
                )}
              </div>
              <div className="truncate max-w-[180px] sm:max-w-xs">
                <p className="text-xs text-white font-medium truncate">{currentSong.name}</p>
                <p className="text-[10px] text-[#aaaaaa] truncate">{currentSong.artist}</p>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#E8442A] hover:text-white text-white flex items-center justify-center transition-colors"
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play className="ml-[1px]" size={14} fill="currentColor" />}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// ==========================================
// PAGE 1: LANDING PAGE
// ==========================================
function LandingPage({ setPage }) {
  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 text-center select-none">
      <div className="z-10 max-w-xl">
        <h1 className="text-2xl md:text-3xl font-serif text-white font-light italic mb-8 tracking-wide">
          'somewhere in this universe... there is a place just for us'
        </h1>
        <button
          onClick={() => setPage('auth')}
          className="bg-[#E8442A] text-white px-8 py-3.5 rounded-full font-medium tracking-wide shadow-lg shadow-[#E8442A]/20 hover:brightness-110 hover:shadow-[#E8442A]/40 active:scale-95 transition-all duration-200"
        >
          Enter Our World &rarr;
        </button>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 2: AUTHENTICATION PAGE
// ==========================================
function AuthPage({ setPage, fetchUserData, setInviteModalCode, setErrorMsg, setLoading }) {
  const [tab, setTab] = useState('login'); // login, signup
  const [role, setRole] = useState('him'); // him, her

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const displayName = formData.get('display_name');
    const inviteCode = formData.get('invite_code');

    setLoading(true);
    try {
      if (tab === 'login') {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await fetchUserData(data.user.id);
      } else {
        // Sign Up Flow
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        const userObj = data.user;
        if (!userObj) throw new Error("Verification email sent or user undefined.");

        if (inviteCode && inviteCode.trim() !== '') {
          // Join existing couple
          const { data: existingCouple, error: findErr } = await supabase
            .from('couples')
            .select('*')
            .eq('invite_code', inviteCode.trim().toUpperCase())
            .maybeSingle();

          if (findErr) throw findErr;
          if (!existingCouple) {
            throw new Error("Invalid invite code. No matching couple found.");
          }

          // Update couples partner name
          const updateData = {};
          if (role === 'him') updateData.him_name = displayName;
          if (role === 'her') updateData.her_name = displayName;

          const { error: updErr } = await supabase
            .from('couples')
            .update(updateData)
            .eq('id', existingCouple.id);
          if (updErr) throw updErr;

          // Upsert profiles
          const { error: profErr } = await supabase
            .from('profiles')
            .upsert({
              id: userObj.id,
              couple_id: existingCouple.id,
              role,
              display_name: displayName
            });
          if (profErr) throw profErr;

          await fetchUserData(userObj.id);
        } else {
          // Create new couple
          const generatedCode = generateInviteCode();
          const insertData = {
            invite_code: generatedCode,
            him_name: role === 'him' ? displayName : null,
            her_name: role === 'her' ? displayName : null
          };

          const { data: newCouple, error: cplErr } = await supabase
            .from('couples')
            .insert([insertData])
            .select()
            .single();

          if (cplErr) throw cplErr;

          // Upsert profile
          const { error: profErr } = await supabase
            .from('profiles')
            .upsert({
              id: userObj.id,
              couple_id: newCouple.id,
              role,
              display_name: displayName
            });
          if (profErr) throw profErr;

          setInviteModalCode(generatedCode);
          await fetchUserData(userObj.id);
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "An authentication error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
        {/* Back link */}
        <button
          onClick={() => setPage('landing')}
          className="absolute top-6 left-6 text-xs text-[#aaaaaa] hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <h2 className="text-3xl font-serif text-white text-center mt-6 mb-8">
          {tab === 'login' ? 'Welcome Back' : 'Create Space'}
        </h2>

        {/* Tab Toggle */}
        <div className="flex bg-white/5 border border-white/10 rounded-full p-1 mb-8">
          <button
            onClick={() => setTab('login')}
            className={`flex-1 text-center py-2 text-sm font-medium transition-all ${
              tab === 'login'
                ? 'bg-[#E8442A] text-white rounded-full'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setTab('signup')}
            className={`flex-1 text-center py-2 text-sm font-medium transition-all ${
              tab === 'signup'
                ? 'bg-[#E8442A] text-white rounded-full'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-5">
          {tab === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Display Name
                </label>
                <input
                  required
                  type="text"
                  name="display_name"
                  placeholder="e.g. Leo"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Role
                </label>
                <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
                  <button
                    type="button"
                    onClick={() => setRole('him')}
                    className={`flex-1 text-center py-2 text-xs font-medium transition-all ${
                      role === 'him'
                        ? 'bg-[#E8442A] text-white rounded-full'
                        : 'text-[#aaaaaa] hover:text-white'
                    }`}
                  >
                    Him
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('her')}
                    className={`flex-1 text-center py-2 text-xs font-medium transition-all ${
                      role === 'her'
                        ? 'bg-[#E8442A] text-white rounded-full'
                        : 'text-[#aaaaaa] hover:text-white'
                    }`}
                  >
                    Her
                  </button>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              required
              type="email"
              name="email"
              placeholder="e.g. name@example.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              required
              type="password"
              name="password"
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
            />
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                Invite Code (Optional)
              </label>
              <input
                type="text"
                name="invite_code"
                placeholder="Leave blank to create a new couple"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
              />
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-[#E8442A] text-white font-medium rounded-full py-3.5 hover:brightness-110 hover:shadow-lg hover:shadow-[#E8442A]/20 active:scale-[0.98] transition-all"
            >
              {tab === 'login' ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 3: HUB PAGE
// ==========================================
function HubPage({ couple, profile, setPage, handleLogout, setShowSettings }) {
  const daysTogether = useMemo(() => {
    return couple ? getDaysTogether(couple.relationship_start) : null;
  }, [couple]);

  const cards = [
    {
      id: 'memories',
      emoji: '📸',
      title: 'Memories',
      subtitle: 'Our best moments'
    },
    {
      id: 'letters',
      emoji: '✉',
      title: 'Love Letters',
      subtitle: 'Words from the heart'
    },
    {
      id: 'reasons',
      emoji: '💖',
      title: 'Why I Love You',
      subtitle: 'A few reasons...'
    },
    {
      id: 'dateplanner',
      emoji: '📅',
      title: 'Date Planner',
      subtitle: 'next date when?'
    },
    {
      id: 'songs',
      emoji: '🎵',
      title: 'Song Library',
      subtitle: 'Our soundtrack'
    },
    {
      id: 'ourworld',
      emoji: '🌌',
      title: 'Our World',
      subtitle: 'Our little universe'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Top Navbar */}
      <div className="flex justify-between items-center mb-16">
        <div className="flex items-center gap-3">
          <Heart className="text-[#E8442A] fill-[#E8442A] animate-pulse" size={20} />
          <span className="font-serif text-lg tracking-wider font-semibold">Our World</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#aaaaaa] hover:text-white transition-colors"
          >
            <Settings size={16} />
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-[#aaaaaa] hover:text-white hover:border-white/20 transition-all flex items-center gap-1"
          >
            <LogOut size={12} /> Log Out
          </button>
        </div>
      </div>

      {/* Hero Days Badge & Heading */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#E8442A] rounded-full text-xs text-white tracking-widest font-semibold uppercase mb-6 shadow-md shadow-[#E8442A]/20">
          <span>❤</span>
          {daysTogether !== null ? (
            <span>{daysTogether} Days Together</span>
          ) : (
            <button onClick={() => setShowSettings(true)} className="hover:underline flex items-center gap-1">
              Set anniversary date
            </button>
          )}
        </div>

        <h2 className="text-4xl md:text-5xl font-serif text-white mb-3 tracking-wide">
          Choose an envelope
        </h2>
        <p className="text-sm text-[#aaaaaa] tracking-widest uppercase">
          Every moment we have shared, sealed with love
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => setPage(card.id)}
            className="group relative cursor-pointer glass-card rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover-glow flex flex-col justify-between aspect-square"
          >
            <div className="text-3xl md:text-4xl bg-white/5 w-12 h-12 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 border border-white/5 group-hover:scale-110 transition-transform">
              {card.emoji}
            </div>
            <div>
              <h3 className="font-serif text-xl md:text-2xl text-white font-medium mb-1 group-hover:text-[#E8442A] transition-colors flex items-center gap-1">
                {card.title}
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-4px] group-hover:translate-x-0" />
              </h3>
              <p className="text-xs md:text-sm text-[#aaaaaa]">{card.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// PAGE 4: MEMORIES PAGE
// ==========================================
function MemoriesPage({ couple, profile, setPage, setErrorMsg, setSuccessMsg }) {
  const [memories, setMemories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMemory, setEditingMemory] = useState(null);
  const [lightboxMemory, setLightboxMemory] = useState(null);
  const [selectedActionMemory, setSelectedActionMemory] = useState(null);

  const fetchMemories = async () => {
    if (!couple?.id) return;
    const { data, error } = await supabase
      .from('memories')
      .select('*')
      .eq('couple_id', couple.id)
      .order('date', { ascending: false });
    if (error) {
      setErrorMsg("Failed to load memories.");
    } else {
      setMemories(data || []);
    }
  };

  useEffect(() => {
    fetchMemories();

    if (!couple?.id) return;

    // Realtime changes listener
    const channel = supabase.channel('memories')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'memories',
        filter: `couple_id=eq.${couple.id}`
      }, () => {
        fetchMemories();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [couple?.id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const label = e.target.closest('label');
      const textNode = label ? label.querySelector('.upload-text') : null;
      if (textNode) textNode.innerText = file.name;
    }
  };

  const handleMemorySubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const description = formData.get('description');
    const date = formData.get('date');
    const fileInput = e.target.querySelector('input[type="file"]');
    const file = fileInput ? fileInput.files[0] : null;

    if (!editingMemory && !file) {
      setErrorMsg("Photo upload is required.");
      return;
    }

    try {
      let photo_url = editingMemory ? editingMemory.photo_url : '';

      if (file) {
        // Upload photo to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const uuid = crypto.randomUUID();
        const filePath = `${couple.id}/${uuid}.${fileExt}`;
        const { error: uploadErr } = await supabase.storage
          .from('memories')
          .upload(filePath, file);

        if (uploadErr) throw uploadErr;

        const { data: { publicUrl } } = supabase.storage
          .from('memories')
          .getPublicUrl(filePath);

        photo_url = publicUrl;
      }

      if (editingMemory) {
        const { error } = await supabase
          .from('memories')
          .update({ title, description, date, photo_url })
          .eq('id', editingMemory.id);
        if (error) throw error;
        setSuccessMsg("Memory edited successfully.");
      } else {
        const { error } = await supabase
          .from('memories')
          .insert([{
            couple_id: couple.id,
            title,
            description,
            date,
            photo_url,
            created_by: profile.id
          }]);
        if (error) throw error;
        setSuccessMsg("Memory added successfully!");
      }

      setShowAddModal(false);
      setEditingMemory(null);
      fetchMemories();
    } catch (err) {
      console.error(err);
      setErrorMsg("Error saving memory.");
    }
  };

  const handleDeleteMemory = async (memory) => {
    const check = confirm("Delete this memory?");
    if (!check) return;

    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', memory.id);
      if (error) throw error;

      // Extract storage path from url
      const pathParts = memory.photo_url.split('/memories/');
      if (pathParts.length > 1) {
        const storagePath = pathParts[1];
        await supabase.storage.from('memories').remove([storagePath]);
      }

      setSuccessMsg("Memory deleted successfully.");
      setSelectedActionMemory(null);
      fetchMemories();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete memory.");
    }
  };

  // Right click context helper
  const handleContextMenu = (e, memory) => {
    e.preventDefault();
    setSelectedActionMemory(memory);
  };

  // Touch triggers
  let pressTimer;
  const handleTouchStart = (memory) => {
    pressTimer = setTimeout(() => {
      setSelectedActionMemory(memory);
    }, 500);
  };
  const handleTouchEnd = () => {
    clearTimeout(pressTimer);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Navbar Header */}
      <div className="flex justify-between items-center mb-12">
        <button
          onClick={() => setPage('hub')}
          className="text-xs text-[#aaaaaa] hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={14} /> Hub
        </button>

        <button
          onClick={() => {
            setEditingMemory(null);
            setShowAddModal(true);
          }}
          className="bg-[#E8442A] text-white px-5 py-2 rounded-full text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#E8442A]/20"
        >
          + Add Memory
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-white font-medium mb-2">Our Best Moments</h1>
        <p className="text-xs text-[#aaaaaa] tracking-widest uppercase">Click on an image to see it clearly. Press & hold or right-click to edit/delete.</p>
      </div>

      {/* Memories Grid (Masonry using CSS columns) */}
      {memories.length === 0 ? (
        <div className="text-center py-20 bg-white/2 rounded-3xl border border-white/5 max-w-lg mx-auto p-8">
          <Camera className="mx-auto text-[#aaaaaa]/20 mb-4" size={48} />
          <p className="text-lg font-serif text-[#aaaaaa]">No memories saved yet...</p>
          <p className="text-xs text-[#aaaaaa] mt-1">Click "+ Add Memory" to save your first snapshot together!</p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 gap-6 space-y-6 max-w-5xl mx-auto">
          {memories.map((memory) => (
            <div
              key={memory.id}
              onClick={() => setLightboxMemory(memory)}
              onContextMenu={(e) => handleContextMenu(e, memory)}
              onTouchStart={() => handleTouchStart(memory)}
              onTouchEnd={handleTouchEnd}
              className="break-inside-avoid glass-card rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 transition-all duration-300 hover:shadow-[0_0_15px_rgba(232,68,42,0.3)]"
            >
              <img src={memory.photo_url} alt={memory.title} className="w-full object-cover max-h-[400px]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300" />
              
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-serif text-base text-white font-semibold leading-tight">{memory.title}</h3>
                <p className="text-[10px] text-[#aaaaaa] mt-1 font-mono tracking-wider">{formatDate(memory.date, {month: 'short', day: 'numeric', year: 'numeric'})}</p>
                <p className="text-xs text-[#cccccc] mt-2 hidden group-hover:block transition-all duration-300 line-clamp-3">
                  {memory.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action / Context Menu Overlay */}
      {selectedActionMemory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-card rounded-2xl w-full max-w-xs p-6 modal-animate-up text-center relative">
            <button onClick={() => setSelectedActionMemory(null)} className="absolute top-4 right-4 text-[#aaaaaa] hover:text-white">
              <X size={16} />
            </button>
            <h3 className="font-serif text-lg text-white mb-4 leading-tight truncate">{selectedActionMemory.title}</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  setEditingMemory(selectedActionMemory);
                  setSelectedActionMemory(null);
                  setShowAddModal(true);
                }}
                className="w-full py-2 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5"
              >
                <Edit size={14} /> Edit details
              </button>
              <button
                onClick={() => handleDeleteMemory(selectedActionMemory)}
                className="w-full py-2 bg-[#E8442A]/10 border border-[#E8442A]/20 text-[#E8442A] rounded-xl text-sm font-medium hover:bg-[#E8442A]/20 transition-colors flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} /> Delete memory
              </button>
              <button
                onClick={() => setSelectedActionMemory(null)}
                className="w-full py-2 bg-transparent rounded-xl text-xs font-semibold text-[#aaaaaa] hover:text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full-Screen Lightbox */}
      {lightboxMemory && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxMemory(null)}
            className="absolute top-6 right-6 text-[#aaaaaa] hover:text-white p-2 rounded-full bg-white/5 border border-white/10"
          >
            <X size={20} />
          </button>
          
          <div className="w-full max-w-4xl flex flex-col md:flex-row gap-6 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex-1 flex items-center justify-center">
              <img
                src={lightboxMemory.photo_url}
                alt={lightboxMemory.title}
                className="max-h-[50vh] md:max-h-[75vh] object-contain rounded-2xl shadow-2xl border border-white/10"
              />
            </div>
            <div className="flex-1 flex flex-col justify-center max-w-md">
              <span className="text-xs text-[#E8442A] tracking-wider uppercase font-semibold mb-2">
                {formatDate(lightboxMemory.date)}
              </span>
              <h2 className="text-3xl font-serif text-white mb-4">{lightboxMemory.title}</h2>
              <p className="text-sm text-[#aaaaaa] leading-relaxed mb-6 whitespace-pre-wrap">{lightboxMemory.description}</p>
              <button
                onClick={() => setLightboxMemory(null)}
                className="self-start text-xs border border-white/10 rounded-full px-5 py-2 hover:bg-white/5 text-[#aaaaaa] hover:text-white transition-colors"
              >
                Close snapshot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-[fadeIn_0.2s_ease-out]">
          <div className="glass-card rounded-3xl w-full max-w-md p-8 modal-animate-up relative">
            <button
              onClick={() => {
                setShowAddModal(false);
                setEditingMemory(null);
              }}
              className="absolute top-6 right-6 text-[#aaaaaa] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-serif text-white mb-6">
              {editingMemory ? 'Edit Memory' : 'Add Memory'}
            </h2>

            <form onSubmit={handleMemorySubmit} className="space-y-5">
              {!editingMemory && (
                <div>
                  <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                    Photo Upload
                  </label>
                  <label className="w-full flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/10 hover:border-[#E8442A]/50 rounded-2xl py-6 cursor-pointer hover:bg-white/10 transition-all">
                    <Camera className="text-[#aaaaaa] mb-2" size={24} />
                    <span className="text-xs text-[#aaaaaa] upload-text">Choose image file</span>
                    <input
                      required
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {editingMemory && (
                <div className="mb-4">
                  <div className="text-xs text-[#aaaaaa] mb-2 uppercase tracking-widest font-semibold">Current Photo</div>
                  <img src={editingMemory.photo_url} alt="current" className="w-24 h-24 object-cover rounded-xl border border-white/10" />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  defaultValue={editingMemory ? editingMemory.title : ''}
                  placeholder="e.g. Coffee dates, Walking down the bridge..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  required
                  name="description"
                  rows="3"
                  defaultValue={editingMemory ? editingMemory.description : ''}
                  placeholder="Tell the story behind this moment..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Date
                </label>
                <input
                  required
                  type="date"
                  name="date"
                  defaultValue={editingMemory ? editingMemory.date : ''}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors [color-scheme:dark]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#E8442A] text-white font-medium rounded-full py-3.5 hover:brightness-110 hover:shadow-lg hover:shadow-[#E8442A]/20 active:scale-[0.98] transition-all"
                >
                  {editingMemory ? 'Update Memory' : 'Save Moment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// PAGE 5: LOVE LETTERS PAGE
// ==========================================
function LettersPage({ couple, profile, setPage, setErrorMsg, setSuccessMsg }) {
  const [letters, setLetters] = useState([]);
  const [tab, setTab] = useState('him'); // him, her
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeLetter, setActiveLetter] = useState(null);

  const fetchLetters = async () => {
    if (!couple?.id) return;
    const { data, error } = await supabase
      .from('letters')
      .select('*')
      .eq('couple_id', couple.id)
      .order('created_at', { ascending: false });
    if (error) {
      setErrorMsg("Failed to load letters.");
    } else {
      setLetters(data || []);
    }
  };

  useEffect(() => {
    fetchLetters();

    if (!couple?.id) return;

    const channel = supabase.channel('letters')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'letters',
        filter: `couple_id=eq.${couple.id}`
      }, () => {
        fetchLetters();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [couple?.id]);

  const handleLetterSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const title = formData.get('title');
    const content = formData.get('content');
    const from_role = formData.get('from_role');

    try {
      const { error } = await supabase
        .from('letters')
        .insert([{
          couple_id: couple.id,
          from_role,
          title,
          content
        }]);
      
      if (error) throw error;
      setSuccessMsg("Love letter sealed and delivered!");
      setShowAddModal(false);
      fetchLetters();
    } catch (err) {
      console.error(err);
      setErrorMsg("Error writing letter.");
    }
  };

  const handleDeleteLetter = async (id) => {
    const check = confirm("Delete this letter?");
    if (!check) return;

    try {
      const { error } = await supabase
        .from('letters')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setSuccessMsg("Letter deleted successfully.");
      fetchLetters();
    } catch (err) {
      console.error(err);
      setErrorMsg("Error deleting letter.");
    }
  };

  // Filter letters based on selected tab ('him' filters letters where from_role === 'him')
  const filteredLetters = letters.filter(l => l.from_role === tab);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header Controls */}
      <div className="flex justify-between items-center mb-12">
        <button
          onClick={() => setPage('hub')}
          className="text-xs text-[#aaaaaa] hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={14} /> Hub
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#E8442A] text-white px-5 py-2 rounded-full text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#E8442A]/20"
        >
          + Write Letter
        </button>
      </div>

      <div className="text-center mb-10">
        <h1 className="text-4xl font-serif text-white font-medium mb-3">Love Letters</h1>
        <p className="text-xs text-[#aaaaaa] tracking-widest uppercase mb-8">封 Letters written from our hearts 封</p>
        
        {/* Author tabs */}
        <div className="inline-flex bg-white/5 border border-white/10 rounded-full p-1">
          <button
            onClick={() => setTab('him')}
            className={`text-center py-2 px-6 text-xs font-semibold transition-all ${
              tab === 'him'
                ? 'bg-[#E8442A] text-white rounded-full'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            From Him
          </button>
          <button
            onClick={() => setTab('her')}
            className={`text-center py-2 px-6 text-xs font-semibold transition-all ${
              tab === 'her'
                ? 'bg-[#E8442A] text-white rounded-full'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            From Her
          </button>
        </div>
      </div>

      {/* Letters List */}
      {filteredLetters.length === 0 ? (
        <div className="text-center py-20 bg-white/2 rounded-3xl border border-white/5 max-w-md mx-auto p-8">
          <BookOpen className="mx-auto text-[#aaaaaa]/20 mb-4" size={48} />
          <p className="text-lg font-serif text-[#aaaaaa]">No letters from {tab === 'him' ? 'him' : 'her'} yet...</p>
          <p className="text-xs text-[#aaaaaa] mt-1">Write your feelings, seal them in an envelope.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {filteredLetters.map((letter) => (
            <div
              key={letter.id}
              className="glass-card rounded-2xl p-6 relative flex flex-col justify-between h-56 transition-all duration-300 border border-white/5 hover:border-[#E8442A]/20 hover:shadow-lg"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="text-[10px] text-[#E8442A] font-mono tracking-widest font-bold">
                    {formatDate(letter.created_at)}
                  </span>
                  <button
                    onClick={() => handleDeleteLetter(letter.id)}
                    className="text-[#aaaaaa] hover:text-[#E8442A] transition-colors p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <h3 className="font-serif text-xl text-white font-semibold leading-tight line-clamp-2 mb-2">
                  {letter.title}
                </h3>
                <p className="text-xs text-[#aaaaaa] leading-relaxed line-clamp-3">
                  {letter.content}
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setActiveLetter(letter)}
                  className="text-xs font-semibold text-[#E8442A] hover:underline flex items-center gap-1"
                >
                  Read Letter &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Read Letter Modal Overlay */}
      {activeLetter && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4">
          <button
            onClick={() => setActiveLetter(null)}
            className="absolute top-6 right-6 text-[#aaaaaa] hover:text-white p-2 rounded-full bg-white/5 border border-white/10"
          >
            <X size={20} />
          </button>
          
          <div className="w-full max-w-2xl bg-white/3 border border-white/10 rounded-3xl p-8 md:p-12 max-h-[85vh] overflow-y-auto no-scrollbar shadow-2xl animate-slide-up-letter">
            <div className="text-center mb-8">
              <span className="text-xs text-[#E8442A] font-mono tracking-widest font-bold mb-3 block">
                {formatDate(activeLetter.created_at)}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif text-white mb-2 leading-tight">{activeLetter.title}</h2>
              <div className="h-[1px] w-16 bg-[#D4A853]/40 mx-auto mt-4" />
            </div>

            <div className="text-base text-[#dddddd] font-serif leading-loose whitespace-pre-wrap px-2">
              {activeLetter.content}
            </div>

            <div className="text-center mt-12">
              <p className="text-xs text-[#aaaaaa] italic font-serif">Always Yours,</p>
              <p className="text-sm text-[#D4A853] font-serif font-bold mt-1">
                {activeLetter.from_role === 'him' ? couple?.him_name || 'Him' : couple?.her_name || 'Her'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Letter Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="glass-card rounded-3xl w-full max-w-lg p-8 modal-animate-up relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-[#aaaaaa] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-serif text-white mb-6">Write a Love Letter</h2>

            <form onSubmit={handleLetterSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  From
                </label>
                <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
                  <input type="hidden" name="from_role" value={profile?.role || 'him'} />
                  <button
                    type="button"
                    disabled
                    className="flex-1 text-center py-2 text-xs font-medium bg-[#E8442A] text-white rounded-full capitalize"
                  >
                    {profile?.role === 'him' ? `Him (${profile?.display_name})` : `Her (${profile?.display_name})`}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Letter Title
                </label>
                <input
                  required
                  type="text"
                  name="title"
                  placeholder="Give a title to your feelings..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Your Message
                </label>
                <textarea
                  required
                  name="content"
                  rows="8"
                  placeholder="Dear partner, I wanted to say..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 font-serif leading-relaxed focus:outline-none focus:border-[#E8442A]/50 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#E8442A] text-white font-medium rounded-full py-3.5 hover:brightness-110 hover:shadow-lg hover:shadow-[#E8442A]/20 active:scale-[0.98] transition-all"
                >
                  Seal with Love
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// PAGE 6: WHY I LOVE YOU PAGE
// ==========================================
function ReasonsPage({ couple, profile, setPage, setErrorMsg, setSuccessMsg }) {
  const [reasons, setReasons] = useState([]);
  const [tab, setTab] = useState('him'); // his reasons vs her reasons
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchReasons = async () => {
    if (!couple?.id) return;
    const { data, error } = await supabase
      .from('reasons')
      .select('*')
      .eq('couple_id', couple.id)
      .order('created_at', { ascending: true });
    if (error) {
      setErrorMsg("Failed to load reasons.");
    } else {
      setReasons(data || []);
    }
  };

  useEffect(() => {
    fetchReasons();

    if (!couple?.id) return;

    const channel = supabase.channel('reasons')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'reasons',
        filter: `couple_id=eq.${couple.id}`
      }, () => {
        fetchReasons();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [couple?.id]);

  const handleReasonSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const text = formData.get('text');
    const from_role = formData.get('from_role');

    try {
      const { error } = await supabase
        .from('reasons')
        .insert([{
          couple_id: couple.id,
          from_role,
          text
        }]);
      
      if (error) throw error;
      setSuccessMsg("Reason added!");
      setShowAddModal(false);
      fetchReasons();
    } catch (err) {
      console.error(err);
      setErrorMsg("Error adding reason.");
    }
  };

  const handleDeleteReason = async (id) => {
    const check = confirm("Delete this reason?");
    if (!check) return;

    try {
      const { error } = await supabase
        .from('reasons')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setSuccessMsg("Reason deleted.");
      fetchReasons();
    } catch (err) {
      console.error(err);
      setErrorMsg("Error deleting reason.");
    }
  };

  // Filter reasons: 'him' represents "His Reasons"
  const filteredReasons = reasons.filter(r => r.from_role === tab);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header controls */}
      <div className="flex justify-between items-center mb-12">
        <button
          onClick={() => setPage('hub')}
          className="text-xs text-[#aaaaaa] hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={14} /> Hub
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#E8442A] text-white px-5 py-2 rounded-full text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#E8442A]/20"
        >
          + Add Reason
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-white font-medium mb-3">Why I Love You</h1>
        <p className="text-xs text-[#aaaaaa] tracking-widest uppercase mb-8">A few reasons why you are my favorite person</p>

        {/* Toggle between his/her reasons */}
        <div className="inline-flex bg-white/5 border border-white/10 rounded-full p-1">
          <button
            onClick={() => setTab('him')}
            className={`text-center py-2 px-6 text-xs font-semibold transition-all ${
              tab === 'him'
                ? 'bg-[#E8442A] text-white rounded-full'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            His Reasons
          </button>
          <button
            onClick={() => setTab('her')}
            className={`text-center py-2 px-6 text-xs font-semibold transition-all ${
              tab === 'her'
                ? 'bg-[#E8442A] text-white rounded-full'
                : 'text-[#aaaaaa] hover:text-white'
            }`}
          >
            Her Reasons
          </button>
        </div>
      </div>

      {/* Reasons List */}
      {filteredReasons.length === 0 ? (
        <div className="text-center py-20 bg-white/2 rounded-3xl border border-white/5 max-w-md mx-auto p-8">
          <Heart className="mx-auto text-[#aaaaaa]/25 mb-4 animate-pulse" size={48} />
          <p className="text-lg font-serif text-[#aaaaaa]">
            {tab === 'him' ? `${couple?.him_name || 'He'}` : `${couple?.her_name || 'She'}`} hasn't added any reasons yet... 💖
          </p>
          <p className="text-xs text-[#aaaaaa] mt-1">Add a little list of points detailing what makes them special.</p>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto space-y-4">
          {filteredReasons.map((reason, index) => (
            <div
              key={reason.id}
              className="glass-card rounded-2xl p-5 flex items-center justify-between border border-white/5 hover:border-[#E8442A]/20 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <span className="text-sm font-mono text-[#D4A853] font-bold mt-1 bg-white/5 w-8 h-8 rounded-lg flex items-center justify-center border border-white/5">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div>
                  <p className="text-sm md:text-base text-white leading-relaxed font-serif">
                    {reason.text}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Heart size={14} className="text-[#E8442A] fill-[#E8442A]/30 flex-shrink-0" />
                <button
                  onClick={() => handleDeleteReason(reason.id)}
                  className="text-[#aaaaaa] hover:text-[#E8442A] transition-colors p-1"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Reason Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="glass-card rounded-3xl w-full max-w-md p-8 modal-animate-up relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-[#aaaaaa] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-serif text-white mb-6">Add a Reason</h2>

            <form onSubmit={handleReasonSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  From
                </label>
                <div className="flex bg-white/5 border border-white/10 rounded-full p-1">
                  <input type="hidden" name="from_role" value={profile?.role || 'him'} />
                  <button
                    type="button"
                    disabled
                    className="flex-1 text-center py-2 text-xs font-medium bg-[#E8442A] text-white rounded-full capitalize"
                  >
                    {profile?.role === 'him' ? `Him (${profile?.display_name})` : `Her (${profile?.display_name})`}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Reason
                </label>
                <textarea
                  required
                  name="text"
                  rows="4"
                  placeholder="e.g. Your smile brightens my dark days..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#E8442A] text-white font-medium rounded-full py-3.5 hover:brightness-110 hover:shadow-lg hover:shadow-[#E8442A]/20 active:scale-[0.98] transition-all"
                >
                  Save Reason
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// PAGE 7: DATE PLANNER PAGE
// ==========================================
function DatePlannerPage({ couple, profile, setPage, setErrorMsg, setSuccessMsg }) {
  const [dates, setDates] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);

  const fetchDates = async () => {
    if (!couple?.id) return;
    setLoadingDates(true);
    const { data, error } = await supabase
      .from('dates')
      .select('*')
      .eq('couple_id', couple.id)
      .order('date', { ascending: true });
    
    if (error) {
      setErrorMsg("Failed to load dates.");
    } else {
      setDates(data || []);
    }
    setLoadingDates(false);
  };

  useEffect(() => {
    fetchDates();

    if (!couple?.id) return;

    const channel = supabase.channel('dates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'dates',
        filter: `couple_id=eq.${couple.id}`
      }, () => {
        fetchDates();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [couple?.id]);

  const handleDateSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const date = formData.get('date');
    const time = formData.get('time');
    const place = formData.get('place');
    const activity = formData.get('activity');

    try {
      const { error } = await supabase
        .from('dates')
        .insert([{
          couple_id: couple.id,
          date,
          time,
          place,
          activity
        }]);

      if (error) throw error;
      setSuccessMsg("Date idea locked in! 📅");
      e.target.reset();
      fetchDates();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to save date planner entry.");
    }
  };

  const handleDeleteDate = async (id) => {
    const check = confirm("Remove this date plan?");
    if (!check) return;

    try {
      const { error } = await supabase
        .from('dates')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setSuccessMsg("Date plan deleted.");
      fetchDates();
    } catch (err) {
      console.error(err);
      setErrorMsg("Error deleting date entry.");
    }
  };

  // Find nearest upcoming date
  const nearestDateId = useMemo(() => {
    const now = new Date();
    // Filter dates that are today or in the future and have a valid format
    const upcoming = dates.filter((d) => {
      if (!d.date) return false;
      const dt = new Date(`${d.date}T${d.time || '00:00'}`);
      return !isNaN(dt.getTime()) && dt >= now;
    });

    if (upcoming.length === 0) return null;
    
    // Sort upcoming ascending safely
    const sorted = [...upcoming].sort((a, b) => {
      const dtA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dtB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dtA.getTime() - dtB.getTime();
    });
    return sorted[0].id;
  }, [dates]);

  // Generate 30-min interval times
  const timeOptions = useMemo(() => {
    const options = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const hh = String(hour).padStart(2, '0');
        const mm = String(min).padStart(2, '0');
        options.push(`${hh}:${mm}`);
      }
    }
    return options;
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      {/* Header navbar */}
      <div className="flex justify-between items-center mb-12">
        <button
          onClick={() => setPage('hub')}
          className="text-xs text-[#aaaaaa] hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={14} /> Hub
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-white italic font-medium mb-2 lowercase">next date when ?</h1>
        <p className="text-xs text-[#aaaaaa] tracking-widest uppercase">Pick the perfect time for our next meetup</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
        {/* Date Planner Form Card */}
        <div className="glass-card rounded-3xl p-8 border border-white/5 relative">
          <div className="text-center mb-6">
            <span className="text-[10px] text-[#E8442A] font-mono tracking-widest font-bold block mb-1">
              EXCLUSIVELY FOR YOU
            </span>
            <h2 className="text-2xl font-serif text-white">Our Next Date</h2>
          </div>

          <form onSubmit={handleDateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Date
                </label>
                <input
                  required
                  type="date"
                  name="date"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Time
                </label>
                <select
                  required
                  name="time"
                  className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#E8442A]/50 transition-colors"
                >
                  <option value="">Select Time</option>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                Place Idea
              </label>
              <input
                required
                type="text"
                name="place"
                placeholder="e.g. Sanjay Van, Cozy Cafe, Metro..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                Activity Idea
              </label>
              <input
                required
                type="text"
                name="activity"
                placeholder="e.g. Walking, Coffee and talks..."
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-[#E8442A] text-white font-semibold rounded-full py-3 hover:brightness-110 active:scale-[0.98] transition-all text-xs"
              >
                Lock in our date! 📅
              </button>
            </div>
          </form>
        </div>

        {/* Date Plans Lists */}
        <div className="space-y-4">
          <h3 className="font-serif text-lg text-white mb-2 tracking-wide border-b border-white/10 pb-2">Upcoming rendezvous</h3>
          
          {dates.length === 0 ? (
            <div className="text-center py-16 bg-white/2 rounded-2xl border border-white/5 p-6">
              <Calendar className="mx-auto text-[#aaaaaa]/25 mb-3" size={36} />
              <p className="text-sm font-serif text-[#aaaaaa]">No date ideas locked in yet...</p>
              <p className="text-[10px] text-[#aaaaaa] mt-1">Set a meetup plan on the left form!</p>
            </div>
          ) : (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 no-scrollbar">
              {dates.map((d) => {
                const isNearest = d.id === nearestDateId;
                return (
                  <div
                    key={d.id}
                    className={`glass-card rounded-2xl p-5 border relative transition-all duration-300 ${
                      isNearest
                        ? 'border-[#D4A853] shadow-[0_0_15px_rgba(212,168,83,0.25)] bg-[#D4A853]/5'
                        : 'border-white/5'
                    }`}
                  >
                    {isNearest && (
                      <span className="absolute top-4 right-4 bg-[#D4A853] text-black text-[9px] font-bold tracking-widest px-2.5 py-0.5 rounded-full uppercase">
                        Next Up
                      </span>
                    )}

                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-xs font-semibold text-[#E8442A] uppercase tracking-wider mb-1">
                          {formatDate(d.date)} @ {d.time}
                        </div>
                        <h4 className="font-serif text-lg text-white font-bold leading-tight mt-1">
                          {d.place}
                        </h4>
                        <p className="text-xs text-[#aaaaaa] mt-1">{d.activity}</p>
                      </div>
                      
                      {!isNearest && (
                        <button
                          onClick={() => handleDeleteDate(d.id)}
                          className="text-[#aaaaaa] hover:text-[#E8442A] transition-colors p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      )}
                      {isNearest && (
                        <div className="flex flex-col gap-2 items-end">
                          <button
                            onClick={() => handleDeleteDate(d.id)}
                            className="text-[#aaaaaa] hover:text-[#E8442A] transition-colors p-1"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// PAGE 8: SONG LIBRARY PAGE
// ==========================================
function SongsPage({
  couple,
  profile,
  setPage,
  songs,
  setSongs,
  currentSong,
  isPlaying,
  duration,
  currentTime,
  isShuffle,
  isRepeat,
  setIsShuffle,
  setIsRepeat,
  loadAndPlaySong,
  togglePlay,
  handleNextSong,
  handlePrevSong,
  handleScrub,
  formatTime,
  setErrorMsg,
  setSuccessMsg
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  // Split lyrics safely
  const lyricLines = useMemo(() => {
    if (!currentSong?.lyrics) return [];
    return currentSong.lyrics.split('\n');
  }, [currentSong]);

  const fetchSongs = async () => {
    if (!couple?.id) return;
    const { data } = await supabase
      .from('songs')
      .select('*')
      .eq('couple_id', couple.id)
      .order('created_at', { ascending: true });
    if (data) setSongs(data);
  };

  useEffect(() => {
    if (!couple?.id) return;
    const channel = supabase.channel('songs')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'songs',
        filter: `couple_id=eq.${couple.id}`
      }, () => {
        fetchSongs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [couple?.id]);

  const handleSongSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name');
    const artist = formData.get('artist');
    const lyrics = formData.get('lyrics');
    
    const audioInput = e.target.querySelector('input[name="audio_file"]');
    const audioFile = audioInput ? audioInput.files[0] : null;

    const artInput = e.target.querySelector('input[name="art_file"]');
    const artFile = artInput ? artInput.files[0] : null;

    if (!audioFile) {
      setErrorMsg("MP3 audio file is required.");
      return;
    }

    try {
      // 1. Upload audio to songs/{couple_id}/{uuid}.mp3
      const audioUuid = crypto.randomUUID();
      const audioExt = audioFile.name.split('.').pop();
      const audioPath = `${couple.id}/${audioUuid}.${audioExt}`;
      const { error: audioUploadErr } = await supabase.storage
        .from('songs')
        .upload(audioPath, audioFile);

      if (audioUploadErr) throw audioUploadErr;

      const { data: { publicUrl: audio_url } } = supabase.storage
        .from('songs')
        .getPublicUrl(audioPath);

      // 2. Upload album art to album-art/{couple_id}/{uuid}.jpg if provided
      let album_art_url = '';
      if (artFile) {
        const artUuid = crypto.randomUUID();
        const artExt = artFile.name.split('.').pop();
        const artPath = `${couple.id}/${artUuid}.${artExt}`;
        const { error: artUploadErr } = await supabase.storage
          .from('album-art')
          .upload(artPath, artFile);

        if (artUploadErr) throw artUploadErr;

        const { data: { publicUrl } } = supabase.storage
          .from('album-art')
          .getPublicUrl(artPath);

        album_art_url = publicUrl;
      }

      // 3. Insert metadata into songs
      const { error } = await supabase
        .from('songs')
        .insert([{
          couple_id: couple.id,
          name,
          artist,
          lyrics,
          audio_url,
          album_art_url
        }]);

      if (error) throw error;
      setSuccessMsg("Track added to our playlist!");
      setShowAddModal(false);
      fetchSongs();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to add song.");
    }
  };

  const handleDeleteSong = async (e, songId, audioUrl, albumArtUrl) => {
    e.stopPropagation();
    const check = confirm("Delete this song from the soundtrack?");
    if (!check) return;

    try {
      const { error } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (error) throw error;

      // Remove files from storage
      const audioPathParts = audioUrl.split('/songs/');
      if (audioPathParts.length > 1) {
        await supabase.storage.from('songs').remove([audioPathParts[1]]);
      }

      if (albumArtUrl) {
        const artPathParts = albumArtUrl.split('/album-art/');
        if (artPathParts.length > 1) {
          await supabase.storage.from('album-art').remove([artPathParts[1]]);
        }
      }

      setSuccessMsg("Track deleted.");
      
      // If deleted song was playing, pause it
      if (currentSong && currentSong.id === songId) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }

      fetchSongs();
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to delete song.");
    }
  };

  const handleFileLabelChange = (e, className) => {
    const file = e.target.files[0];
    if (file) {
      const label = e.target.closest('label');
      const textNode = label ? label.querySelector('.' + className) : null;
      if (textNode) textNode.innerText = file.name;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      {/* Header controls */}
      <div className="flex justify-between items-center mb-12">
        <button
          onClick={() => setPage('hub')}
          className="text-xs text-[#aaaaaa] hover:text-white flex items-center gap-1 transition-colors"
        >
          <ArrowLeft size={14} /> Hub
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#E8442A] text-white px-5 py-2 rounded-full text-xs font-semibold hover:brightness-110 active:scale-95 transition-all shadow-md shadow-[#E8442A]/20"
        >
          + Add Song
        </button>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-serif text-white font-medium mb-2">Our Soundtrack</h1>
        <p className="text-xs text-[#aaaaaa] tracking-widest uppercase">The songs that tell our beautiful story</p>
      </div>

      {/* Main Player and Lyrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto mb-12">
        
        {/* MUSIC PLAYER CARD */}
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="glass-card rounded-3xl p-8 w-full max-w-sm flex flex-col items-center border border-white/5 relative">
            
            {/* Album art Vinyl Record */}
            <div className={`w-64 h-64 rounded-full bg-black border-[8px] border-[#1a1a1a] shadow-[0_10px_35px_rgba(0,0,0,0.6)] relative flex items-center justify-center flex-shrink-0 mb-6 ${isPlaying ? 'animate-spin-slow' : ''} transition-transform duration-500`}>
              {/* Concentric grooves */}
              <div className="absolute inset-0 rounded-full border border-white/5 opacity-30 pointer-events-none scale-95" />
              <div className="absolute inset-0 rounded-full border border-white/5 opacity-30 pointer-events-none scale-75" />
              <div className="absolute inset-0 rounded-full border border-white/5 opacity-30 pointer-events-none scale-50" />
              
              {/* Album Art Image center */}
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-black relative flex items-center justify-center bg-white/5">
                {currentSong?.album_art_url ? (
                  <img src={currentSong.album_art_url} alt="album art" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#E8442A]/10 text-[#E8442A]">
                    <Music size={28} />
                  </div>
                )}
              </div>
              
              {/* Center Spindle Hole */}
              <div className="absolute w-4 h-4 rounded-full bg-black border border-white/10 z-10" />
            </div>

            {/* Song Details */}
            <div className="text-center w-full mb-6">
              <h2 className="text-xl font-serif text-white font-semibold truncate px-2">
                {currentSong ? currentSong.name : 'Select a Song'}
              </h2>
              <p className="text-sm text-[#aaaaaa] mt-1 truncate px-2">
                {currentSong ? currentSong.artist : 'soundtrack library'}
              </p>
            </div>

            {/* Progress Bar scrubber */}
            <div className="w-full mb-6">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleScrub}
                className="w-full h-1 bg-white/15 rounded-lg appearance-none cursor-pointer accent-[#E8442A] focus:outline-none"
              />
              <div className="flex justify-between items-center text-[10px] text-[#aaaaaa] mt-2 font-mono">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls row */}
            <div className="flex items-center justify-between w-full px-2 mb-2">
              <button
                onClick={() => setIsShuffle(!isShuffle)}
                className={`p-2 transition-colors ${isShuffle ? 'text-[#E8442A]' : 'text-[#aaaaaa] hover:text-white'}`}
              >
                <Shuffle size={16} />
              </button>

              <button
                onClick={handlePrevSong}
                className="p-2 text-[#aaaaaa] hover:text-white transition-colors"
              >
                <SkipBack size={20} fill="currentColor" />
              </button>

              <button
                onClick={togglePlay}
                disabled={!currentSong}
                className="w-14 h-14 rounded-full bg-[#E8442A] text-white flex items-center justify-center shadow-lg shadow-[#E8442A]/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
              >
                {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play className="ml-[2px]" size={24} fill="currentColor" />}
              </button>

              <button
                onClick={handleNextSong}
                className="p-2 text-[#aaaaaa] hover:text-white transition-colors"
              >
                <SkipForward size={20} fill="currentColor" />
              </button>

              <button
                onClick={() => setIsRepeat(!isRepeat)}
                className={`p-2 transition-colors ${isRepeat ? 'text-[#E8442A]' : 'text-[#aaaaaa] hover:text-white'}`}
              >
                <Repeat size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* LYRICS PANEL */}
        <div className="md:col-span-6 flex flex-col">
          <div className="glass-card rounded-3xl p-8 border border-white/5 flex-grow flex flex-col max-h-[500px] overflow-hidden">
            
            <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-3 justify-center">
              <Music className="text-[#E8442A]" size={16} />
              <h3 className="font-serif text-base text-white tracking-wider truncate">
                {currentSong ? `Lyrics — ${currentSong.name}` : 'Lyrics Display'}
              </h3>
            </div>

            <div className="flex-grow overflow-y-auto no-scrollbar py-4 px-2 space-y-4 text-center">
              {currentSong ? (
                lyricLines.length > 0 && lyricLines[0].trim() !== '' ? (
                  lyricLines.map((line, idx) => (
                    <p
                      key={idx}
                      className="font-serif text-sm md:text-base italic text-[#dddddd] leading-relaxed transition-all duration-300 hover:text-white"
                    >
                      {line || '•'}
                    </p>
                  ))
                ) : (
                  <p className="text-xs text-[#aaaaaa] italic py-20 font-serif">Lyrics not provided for this track.</p>
                )
              ) : (
                <div className="py-24 text-center text-[#aaaaaa]/30 flex flex-col items-center">
                  <Music className="mb-2" size={32} />
                  <p className="text-xs italic font-serif">Play a song to view its lyrics here.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SONG LIST TABLE */}
      <div className="max-w-4xl mx-auto">
        <h3 className="font-serif text-xl text-white mb-6 tracking-wide border-b border-white/10 pb-2">All Tracks</h3>

        {songs.length === 0 ? (
          <div className="text-center py-16 bg-white/2 rounded-2xl border border-white/5 p-8">
            <Music className="mx-auto text-[#aaaaaa]/25 mb-3 animate-pulse" size={36} />
            <p className="text-sm font-serif text-[#aaaaaa]">No songs uploaded yet...</p>
            <p className="text-[10px] text-[#aaaaaa] mt-1">Add MP3 files with optional album art to create your playlist!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {songs.map((song) => {
              const isLoaded = currentSong?.id === song.id;
              return (
                <div
                  key={song.id}
                  onClick={() => loadAndPlaySong(song)}
                  className={`glass-card rounded-2xl p-4 flex items-center justify-between cursor-pointer border transition-all duration-300 ${
                    isLoaded ? 'border-[#E8442A] bg-[#E8442A]/5' : 'border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#222] flex-shrink-0 border border-white/10 flex items-center justify-center">
                      {song.album_art_url ? (
                        <img src={song.album_art_url} alt="art" className="w-full h-full object-cover" />
                      ) : (
                        <Music className="text-[#E8442A]" size={16} />
                      )}
                    </div>
                    <div>
                      <h4 className={`text-sm font-semibold truncate max-w-[200px] md:max-w-md ${isLoaded ? 'text-[#E8442A]' : 'text-white'}`}>
                        {song.name}
                      </h4>
                      <p className="text-xs text-[#aaaaaa] mt-0.5 truncate max-w-[200px] md:max-w-md">{song.artist}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {isLoaded && (
                      <div className="flex gap-[3px] items-end h-4 w-5 overflow-hidden">
                        <span className={`w-[2.5px] bg-[#E8442A] rounded-full ${isPlaying ? 'animate-eq-1' : 'h-[3px]'}`} />
                        <span className={`w-[2.5px] bg-[#E8442A] rounded-full ${isPlaying ? 'animate-eq-2' : 'h-[6px]'}`} />
                        <span className={`w-[2.5px] bg-[#E8442A] rounded-full ${isPlaying ? 'animate-eq-3' : 'h-[4px]'}`} />
                        <span className={`w-[2.5px] bg-[#E8442A] rounded-full ${isPlaying ? 'animate-eq-4' : 'h-[2px]'}`} />
                      </div>
                    )}

                    <button
                      onClick={(e) => handleDeleteSong(e, song.id, song.audio_url, song.album_art_url)}
                      className="text-[#aaaaaa] hover:text-[#E8442A] transition-colors p-2"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Song Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
          <div className="glass-card rounded-3xl w-full max-w-md p-8 modal-animate-up relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-6 right-6 text-[#aaaaaa] hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-serif text-white mb-6">Add Song to Soundtrack</h2>

            <form onSubmit={handleSongSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Song Name
                </label>
                <input
                  required
                  type="text"
                  name="name"
                  placeholder="e.g. Perfect, Lovers Rock..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Artist
                </label>
                <input
                  required
                  type="text"
                  name="artist"
                  placeholder="e.g. Ed Sheeran, TV Girl..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                    MP3 File
                  </label>
                  <label className="w-full flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/10 hover:border-[#E8442A]/50 rounded-xl py-3 cursor-pointer transition-all">
                    <Music className="text-[#aaaaaa] mb-1" size={16} />
                    <span className="text-[10px] text-[#aaaaaa] upload-mp3 text-center px-1 truncate w-full">Choose MP3</span>
                    <input
                      required
                      type="file"
                      name="audio_file"
                      accept="audio/mpeg, audio/mp3"
                      onChange={(e) => handleFileLabelChange(e, 'upload-mp3')}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                    Album Art (Optional)
                  </label>
                  <label className="w-full flex flex-col items-center justify-center bg-white/5 border-2 border-dashed border-white/10 hover:border-[#E8442A]/50 rounded-xl py-3 cursor-pointer transition-all">
                    <Camera className="text-[#aaaaaa] mb-1" size={16} />
                    <span className="text-[10px] text-[#aaaaaa] upload-art text-center px-1 truncate w-full">Choose JPG</span>
                    <input
                      type="file"
                      name="art_file"
                      accept="image/*"
                      onChange={(e) => handleFileLabelChange(e, 'upload-art')}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#aaaaaa] uppercase tracking-wider mb-2">
                  Lyrics
                </label>
                <textarea
                  name="lyrics"
                  rows="4"
                  placeholder="Paste track lyrics here..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs text-white placeholder-white/20 focus:outline-none focus:border-[#E8442A]/50 transition-colors font-serif"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-[#E8442A] text-white font-medium rounded-full py-3 hover:brightness-110 active:scale-[0.98] transition-all text-xs"
                >
                  Upload Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// PAGE 9: OUR WORLD PAGE (QUOTES)
// ==========================================
function OurWorldPage({ setPage, couple }) {
  const [tab, setTab] = useState('quote'); // quote, stats
  const [stats, setStats] = useState({
    memoriesCount: 0,
    lettersCount: 0,
    reasonsCount: 0,
    datesCount: 0,
    songsCount: 0,
    monthlyActivity: []
  });
  const [loadingStats, setLoadingStats] = useState(false);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Select a random quote each page load
  const selectedQuote = useMemo(() => {
    return randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
  }, []);

  useEffect(() => {
    if (!couple?.id) return;

    const fetchJourneyStats = async () => {
      setLoadingStats(true);
      try {
        const [mem, lets, reas, dts, sngs] = await Promise.all([
          supabase.from('memories').select('date').eq('couple_id', couple.id),
          supabase.from('letters').select('created_at').eq('couple_id', couple.id),
          supabase.from('reasons').select('created_at').eq('couple_id', couple.id),
          supabase.from('dates').select('date').eq('couple_id', couple.id),
          supabase.from('songs').select('created_at').eq('couple_id', couple.id)
        ]);

        const memories = mem.data || [];
        const letters = lets.data || [];
        const reasons = reas.data || [];
        const dates = dts.data || [];
        const songs = sngs.data || [];

        // Build last 6 months list dynamically
        const resultMonths = [];
        const today = new Date();
        for (let i = 5; i >= 0; i--) {
          const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
          resultMonths.push({
            name: d.toLocaleString('en-US', { month: 'short' }),
            year: d.getFullYear(),
            monthVal: d.getMonth(),
            count: 0,
            details: { memories: 0, letters: 0, dates: 0 }
          });
        }

        // Count memories by month
        memories.forEach(m => {
          if (!m.date) return;
          const dt = new Date(m.date);
          const idx = resultMonths.findIndex(rm => rm.monthVal === dt.getMonth() && rm.year === dt.getFullYear());
          if (idx !== -1) {
            resultMonths[idx].count += 1;
            resultMonths[idx].details.memories += 1;
          }
        });

        // Count letters
        letters.forEach(l => {
          if (!l.created_at) return;
          const dt = new Date(l.created_at);
          const idx = resultMonths.findIndex(rm => rm.monthVal === dt.getMonth() && rm.year === dt.getFullYear());
          if (idx !== -1) {
            resultMonths[idx].count += 1;
            resultMonths[idx].details.letters += 1;
          }
        });

        // Count dates
        dates.forEach(d => {
          if (!d.date) return;
          const dt = new Date(d.date);
          const idx = resultMonths.findIndex(rm => rm.monthVal === dt.getMonth() && rm.year === dt.getFullYear());
          if (idx !== -1) {
            resultMonths[idx].count += 1;
            resultMonths[idx].details.dates += 1;
          }
        });

        setStats({
          memoriesCount: memories.length,
          lettersCount: letters.length,
          reasonsCount: reasons.length,
          datesCount: dates.length,
          songsCount: songs.length,
          monthlyActivity: resultMonths
        });
      } catch (err) {
        console.error("Error loading stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchJourneyStats();
  }, [couple]);

  // Check if all monthly counts are 0, use placeholder values for showcase
  const hasActivity = useMemo(() => {
    return stats.monthlyActivity.some(m => m.count > 0);
  }, [stats.monthlyActivity]);

  // Render variables for graph
  const graphData = useMemo(() => {
    // If no activity, use mock romantic data so the curve looks beautiful!
    if (!hasActivity) {
      return stats.monthlyActivity.map((ma, idx) => ({
        ...ma,
        // Mock curve ascending/twisting
        count: [2, 4, 3, 6, 5, 8][idx],
        isDemo: true
      }));
    }
    return stats.monthlyActivity;
  }, [stats.monthlyActivity, hasActivity]);

  // Map graph coordinates
  const points = useMemo(() => {
    if (graphData.length === 0) return [];
    const maxVal = Math.max(...graphData.map(d => d.count), 5); // min baseline height of 5
    const width = 460;
    const height = 110;
    const paddingLeft = 40;
    const paddingTop = 25;
    
    return graphData.map((d, idx) => {
      const x = paddingLeft + (idx * (width / (graphData.length - 1)));
      // y is inverted in SVG, 0 is at top
      const y = paddingTop + (height - (d.count / maxVal) * height);
      return { x, y, count: d.count, name: d.name, details: d.details, isDemo: d.isDemo };
    });
  }, [graphData]);

  // Create path command (Cubic Bezier control points for smooth lines)
  const linePath = useMemo(() => {
    if (points.length === 0) return "";
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i+1];
      // Control points
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      d += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return d;
  }, [points]);

  // Area Path for fill
  const areaPath = useMemo(() => {
    if (points.length === 0) return "";
    const bottomY = 145; // baseline y axis
    return `${linePath} L ${points[points.length-1].x} ${bottomY} L ${points[0].x} ${bottomY} Z`;
  }, [points, linePath]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8 min-h-screen flex flex-col justify-between">
      {/* Navbar Header */}
      <div>
        <button
          onClick={() => setPage('hub')}
          className="text-xs text-[#aaaaaa] hover:text-white flex items-center gap-1 transition-all bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:border-white/20 hover:scale-105 active:scale-95 duration-200"
        >
          <ArrowLeft size={14} /> Hub
        </button>
      </div>

      {/* Centered Glass Card */}
      <div className="flex-grow flex items-center justify-center my-6">
        <div className="glass-card rounded-3xl p-6 md:p-10 w-full max-w-2xl border border-white/10 shadow-2xl relative flex flex-col min-h-[500px]">
          
          {/* Header tabs toggle */}
          <div className="flex bg-white/5 border border-white/10 rounded-full p-1 max-w-xs mx-auto mb-8 w-full">
            <button
              onClick={() => setTab('quote')}
              className={`flex-1 text-center py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
                tab === 'quote'
                  ? 'bg-[#E8442A] text-white shadow-md shadow-[#E8442A]/20 scale-105'
                  : 'text-[#aaaaaa] hover:text-white hover:scale-98'
              }`}
            >
              ❤ Daily Reminder
            </button>
            <button
              onClick={() => setTab('stats')}
              className={`flex-1 text-center py-2 text-xs font-semibold rounded-full transition-all duration-300 ${
                tab === 'stats'
                  ? 'bg-[#E8442A] text-white shadow-md shadow-[#E8442A]/20 scale-105'
                  : 'text-[#aaaaaa] hover:text-white hover:scale-98'
              }`}
            >
              📊 Our Journey Stats
            </button>
          </div>

          {/* TAB 1: DAILY REMINDER */}
          {tab === 'quote' && (
            <div className="flex-grow flex flex-col justify-center text-center animate-fade-in">
              <div className="mx-auto w-12 h-12 bg-[#E8442A]/10 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 hover:scale-110">
                <Heart className="text-[#E8442A] fill-[#E8442A] animate-pulse" size={24} />
              </div>

              <h1 className="text-3xl font-serif text-white font-medium mb-6">Our World</h1>

              <blockquote className="text-lg md:text-xl font-serif text-white italic leading-relaxed px-4 mb-8">
                "{selectedQuote}"
              </blockquote>

              <div className="h-[1px] w-24 bg-[#D4A853]/45 mx-auto my-6 animate-[pulse_2s_infinite]" />

              <div className="text-[10px] text-[#E8442A] font-mono tracking-widest font-bold mb-3 uppercase">
                A LITTLE DAILY REMINDER
              </div>
              <p className="text-xs md:text-sm text-[#aaaaaa] leading-loose max-w-md mx-auto">
                No matter where we are in this universe, we are always under the same stars, looking at the same sky, holding each other in our hearts. This is our little place, just for us. 🌌
              </p>
            </div>
          )}

          {/* TAB 2: JOURNEY STATS */}
          {tab === 'stats' && (
            <div className="flex-grow flex flex-col justify-between text-left animate-fade-in w-full">
              {loadingStats ? (
                <div className="flex-grow flex items-center justify-center py-24">
                  <div className="w-8 h-8 border-4 border-[#E8442A]/20 border-t-[#E8442A] rounded-full animate-spin" />
                </div>
              ) : (
                <div>
                  <h2 className="text-2xl font-serif text-white mb-1">Our Journey Dashboard</h2>
                  <p className="text-xs text-[#aaaaaa] uppercase tracking-wider mb-6">A collection of our digital footprint together</p>

                  {/* Animated Archive Counters */}
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-8">
                    {[
                      { label: 'Memories', val: stats.memoriesCount, color: 'border-rose-500/20 text-rose-400 bg-rose-500/5 hover:border-rose-500/50 hover:bg-rose-500/10' },
                      { label: 'Letters', val: stats.lettersCount, color: 'border-orange-500/20 text-orange-400 bg-orange-500/5 hover:border-orange-500/50 hover:bg-orange-500/10' },
                      { label: 'Reasons', val: stats.reasonsCount, color: 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:border-amber-500/50 hover:bg-amber-500/10' },
                      { label: 'Dates Locked', val: stats.datesCount, color: 'border-fuchsia-500/20 text-fuchsia-400 bg-fuchsia-500/5 hover:border-fuchsia-500/50 hover:bg-fuchsia-500/10' },
                      { label: 'Songs', val: stats.songsCount, color: 'border-sky-500/20 text-sky-400 bg-sky-500/5 hover:border-sky-500/50 hover:bg-sky-500/10' }
                    ].map((counter, idx) => (
                      <div
                        key={idx}
                        className={`border rounded-2xl p-3 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${counter.color}`}
                      >
                        <div className="text-2xl font-serif font-bold">{counter.val}</div>
                        <div className="text-[10px] text-[#aaaaaa] font-medium tracking-wide uppercase mt-1 leading-tight">{counter.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Curve SVG Graph */}
                  <div className="relative glass-card rounded-2xl p-4 border border-white/5 bg-white/2 mb-4 overflow-visible">
                    <div className="flex justify-between items-center mb-4 px-2">
                      <span className="text-xs font-semibold text-white font-serif tracking-wider">
                        Love Spark Density Timeline
                      </span>
                      {!hasActivity && (
                        <span className="text-[9px] text-[#D4A853] border border-[#D4A853]/30 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider animate-pulse bg-[#D4A853]/5">
                          Demo Chart
                        </span>
                      )}
                    </div>

                    <div className="relative w-full h-[150px] overflow-visible">
                      <svg viewBox="0 0 500 150" className="w-full h-full overflow-visible">
                        <defs>
                          {/* Area Gradient */}
                          <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#E8442A" stopOpacity="0.45" />
                            <stop offset="100%" stopColor="#E8442A" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Y Grid Lines */}
                        <line x1="40" y1="135" x2="480" y2="135" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                        <line x1="40" y1="80" x2="480" y2="80" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />
                        <line x1="40" y1="25" x2="480" y2="25" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="3 3" />

                        {/* Area Path */}
                        {points.length > 0 && (
                          <path d={areaPath} fill="url(#area-grad)" className="transition-all duration-1000 ease-out" />
                        )}

                        {/* Line Path */}
                        {points.length > 0 && (
                          <path
                            d={linePath}
                            fill="none"
                            stroke="#E8442A"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                        )}

                        {/* Interactive Point Nodes */}
                        {points.map((p, idx) => (
                          <g
                            key={idx}
                            onMouseEnter={() => setHoveredPoint(idx)}
                            onMouseLeave={() => setHoveredPoint(null)}
                            className="cursor-pointer group"
                          >
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={hoveredPoint === idx ? 8 : 5}
                              fill="#0a0a0a"
                              stroke={p.isDemo ? "#D4A853" : "#E8442A"}
                              strokeWidth="3"
                              className="transition-all duration-200"
                            />
                            {/* Inner glowing circle */}
                            {hoveredPoint === idx && (
                              <circle
                                cx={p.x}
                                cy={p.y}
                                r={13}
                                fill="none"
                                stroke={p.isDemo ? "#D4A853" : "#E8442A"}
                                strokeWidth="1.5"
                                strokeOpacity="0.6"
                                className="animate-ping"
                              />
                            )}
                            {/* X Axis labels */}
                            <text
                              x={p.x}
                              y="148"
                              textAnchor="middle"
                              fill="#aaaaaa"
                              fontSize="10"
                              className="font-sans font-medium"
                            >
                              {p.name}
                            </text>
                          </g>
                        ))}
                      </svg>

                      {/* Dynamic Floating Tooltip */}
                      {hoveredPoint !== null && points[hoveredPoint] && (
                        <div
                          className="absolute z-30 bg-black/95 border border-white/10 px-3 py-2 rounded-xl text-left shadow-2xl backdrop-blur-md animate-[slide-up_0.15s_ease-out] w-36 pointer-events-none"
                          style={{
                            left: `${(points[hoveredPoint].x / 500) * 100}%`,
                            top: `${(points[hoveredPoint].y / 150) * 100 - 15}%`,
                            transform: 'translate(-50%, -100%)'
                          }}
                        >
                          <div className="text-[10px] text-[#aaaaaa] font-bold uppercase tracking-wider mb-1">
                            {points[hoveredPoint].name} {points[hoveredPoint].isDemo ? ' (Demo)' : ''}
                          </div>
                          <div className="text-xs font-bold text-white font-serif">
                            {points[hoveredPoint].count} Shared Moments
                          </div>
                          {!points[hoveredPoint].isDemo && points[hoveredPoint].details && (
                            <div className="text-[9px] text-[#aaaaaa] mt-1 space-y-0.5 font-mono">
                              <div>📸 Memories: {points[hoveredPoint].details.memories}</div>
                              <div>✉ Letters: {points[hoveredPoint].details.letters}</div>
                              <div>📅 Dates: {points[hoveredPoint].details.dates}</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {!hasActivity && (
                    <p className="text-[10px] text-[#D4A853] text-center italic mt-2 leading-relaxed">
                      ✨ Add memories, send letters, or plan date rendezvous to start drawing your dynamic love activity timeline chart!
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* Spacer / footer alignment */}
      <div className="h-6" />
    </div>
  );
}
