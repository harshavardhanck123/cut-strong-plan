import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BatteryCharging,
  Check,
  ChevronRight,
  CircleHelp,
  Clock3,
  Dumbbell,
  Flame,
  Footprints,
  Gauge,
  Info,
  Menu,
  Moon,
  Play,
  RotateCcw,
  Scale,
  ShieldCheck,
  Sparkles,
  Target,
  Timer,
  TrendingDown,
  Utensils,
  X,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

const days = [
  { id: "mon", label: "MON", title: "Upper strength", focus: "Chest · Back · Shoulders", color: "coral" },
  { id: "tue", label: "TUE", title: "Lower strength", focus: "Quads · Hamstrings · Core", color: "mint" },
  { id: "wed", label: "WED", title: "Zone 2 + mobility", focus: "Aerobic base · Recovery", color: "sand" },
  { id: "thu", label: "THU", title: "Push hypertrophy", focus: "Chest · Delts · Triceps", color: "blue" },
  { id: "fri", label: "FRI", title: "Pull + posterior", focus: "Back · Biceps · Glutes", color: "purple" },
  { id: "sat", label: "SAT", title: "Optional conditioning", focus: "Intervals · Athletic work", color: "orange" },
  { id: "sun", label: "SUN", title: "Full rest", focus: "Walk · Reset · Prep", color: "gray" },
];

const workouts: Record<string, { eyebrow: string; title: string; note: string; duration: string; moves: { name: string; sets: string; cue: string }[] }> = {
  mon: {
    eyebrow: "Day 01 · Strength",
    title: "Upper strength",
    note: "Leave 1–2 reps in reserve on compounds. Own every rep.",
    duration: "65–75 min",
    moves: [
      { name: "Barbell bench press", sets: "4 × 5–7", cue: "2 min rest · controlled lower" },
      { name: "Chest-supported row", sets: "4 × 6–8", cue: "Pause at the top" },
      { name: "Seated DB shoulder press", sets: "3 × 8–10", cue: "Ribs down" },
      { name: "Lat pulldown", sets: "3 × 8–10", cue: "Drive elbows to pockets" },
      { name: "Cable lateral raise", sets: "3 × 12–15", cue: "Smooth, no swing" },
      { name: "Rope triceps pressdown", sets: "2 × 12–15", cue: "Full lockout" },
    ],
  },
  tue: {
    eyebrow: "Day 02 · Strength",
    title: "Lower strength",
    note: "Brace hard and keep 1–2 reps in reserve on the first four lifts.",
    duration: "65–75 min",
    moves: [
      { name: "Back squat", sets: "4 × 5–7", cue: "2 min rest · stable depth" },
      { name: "Romanian deadlift", sets: "3 × 6–8", cue: "Hips back · long hamstrings" },
      { name: "Leg press", sets: "3 × 8–10", cue: "Controlled depth" },
      { name: "Seated leg curl", sets: "3 × 10–12", cue: "1 sec squeeze" },
      { name: "Standing calf raise", sets: "3 × 10–15", cue: "Full stretch" },
      { name: "Cable crunch", sets: "3 × 10–15", cue: "Ribs to pelvis" },
    ],
  },
  wed: {
    eyebrow: "Day 03 · Engine",
    title: "Zone 2 + mobility",
    note: "Conversational pace: finish feeling better than when you started.",
    duration: "50–60 min",
    moves: [
      { name: "Incline treadmill / bike", sets: "35–45 min", cue: "RPE 5–6 · nasal breathing" },
      { name: "90/90 hip switches", sets: "2 × 8 / side", cue: "Slow transitions" },
      { name: "Couch stretch", sets: "2 × 45 sec / side", cue: "Glute squeezed" },
      { name: "Dead hang", sets: "3 × 20–30 sec", cue: "Relax your neck" },
    ],
  },
  thu: {
    eyebrow: "Day 04 · Volume",
    title: "Push hypertrophy",
    note: "Chase clean volume. Rest 60–90 sec on accessories.",
    duration: "60–70 min",
    moves: [
      { name: "Incline DB press", sets: "4 × 8–10", cue: "Slight pause at chest" },
      { name: "Machine chest press", sets: "3 × 10–12", cue: "Smooth lockout" },
      { name: "Cable fly", sets: "3 × 12–15", cue: "Hug the tree" },
      { name: "Machine lateral raise", sets: "4 × 12–20", cue: "Lead with elbows" },
      { name: "Overhead cable extension", sets: "3 × 10–15", cue: "Long-head stretch" },
      { name: "Push-up finisher", sets: "2 × near-failure", cue: "Stop before form breaks" },
    ],
  },
  fri: {
    eyebrow: "Day 05 · Volume",
    title: "Pull + posterior",
    note: "Use straps if grip limits your back work. Keep tempo honest.",
    duration: "60–70 min",
    moves: [
      { name: "Neutral-grip pull-up", sets: "4 × 6–10", cue: "Band-assisted if needed" },
      { name: "One-arm cable row", sets: "3 × 10–12 / side", cue: "Reach, then row" },
      { name: "Hip thrust", sets: "3 × 8–12", cue: "Chin tucked" },
      { name: "Rear-delt fly", sets: "3 × 12–20", cue: "Soft elbows" },
      { name: "Lying leg curl", sets: "3 × 10–15", cue: "Hips pinned" },
      { name: "Incline DB curl", sets: "3 × 10–15", cue: "No shoulder roll" },
    ],
  },
  sat: {
    eyebrow: "Day 06 · Optional",
    title: "Conditioning",
    note: "Only do this if sleep and legs feel good. Otherwise take the rest day.",
    duration: "35–50 min",
    moves: [
      { name: "Bike intervals", sets: "8 × 30 sec", cue: "Hard · 90 sec easy" },
      { name: "Sled push", sets: "6 × 20 m", cue: "Steady power" },
      { name: "Farmer carry", sets: "4 × 30 m", cue: "Tall posture" },
      { name: "Easy walk cooldown", sets: "10 min", cue: "Bring heart rate down" },
    ],
  },
  sun: {
    eyebrow: "Day 07 · Reset",
    title: "Full rest",
    note: "Recovery is part of the plan. Keep movement easy and prep your next week.",
    duration: "20–40 min",
    moves: [
      { name: "Easy outdoor walk", sets: "20–40 min", cue: "Low effort · sunlight" },
      { name: "Meal prep", sets: "30–45 min", cue: "Protein + produce first" },
      { name: "Weekly weigh-in", sets: "1 × morning", cue: "Same conditions" },
    ],
  },
};

const targets = [
  { label: "Daily calories", value: "2,200–2,350", detail: "Start here · adjust from 2-week trend", icon: Flame, color: "orange" },
  { label: "Protein", value: "150–165 g", detail: "Split across 3–5 meals", icon: Utensils, color: "coral" },
  { label: "Steps", value: "8,000–10,000", detail: "Daily baseline before adding cardio", icon: Footprints, color: "mint" },
  { label: "Sleep", value: "7.5–9 hrs", detail: "Protect performance + appetite", icon: Moon, color: "purple" },
];

function Metric({ icon: Icon, value, label }: { icon: typeof Scale; value: string; label: string }) {
  return (
    <div className="metric-item">
      <div className="metric-icon"><Icon size={18} strokeWidth={2.2} /></div>
      <div><strong>{value}</strong><span>{label}</span></div>
    </div>
  );
}

export default function Home() {
  const [activeDay, setActiveDay] = useState("mon");
  const [completed, setCompleted] = useState<string[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const workout = workouts[activeDay];
  const completion = useMemo(() => Math.round((completed.length / workout.moves.length) * 100), [completed.length, workout.moves.length]);

  const toggleMove = (move: string) => {
    setCompleted((current) => current.includes(move) ? current.filter((item) => item !== move) : [...current, move]);
  };

  const resetWeek = () => {
    setCompleted([]);
    toast.success("Week reset", { description: "Your checklist is ready for a fresh start." });
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand-row">
          <div className="brand-mark"><Zap size={20} fill="currentColor" /></div>
          <div><div className="brand-name">CUT<span>STRONG</span></div><div className="brand-caption">personal performance system</div></div>
          <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={20} /></button>
        </div>

        <div className="profile-card">
          <div className="profile-avatar">AR</div>
          <div><div className="profile-name">Athlete profile</div><div className="profile-meta">Intermediate · 24 · 169 cm</div></div>
          <div className="profile-dot" />
        </div>

        <div className="sidebar-label">Your system</div>
        <nav className="side-nav">
          <a className="nav-link active" href="#overview" onClick={() => setMobileOpen(false)}><Gauge size={18} /> Overview <span className="nav-pill">01</span></a>
          <a className="nav-link" href="#training" onClick={() => setMobileOpen(false)}><Dumbbell size={18} /> Training split</a>
          <a className="nav-link" href="#nutrition" onClick={() => setMobileOpen(false)}><Utensils size={18} /> Fuel & recovery</a>
          <a className="nav-link" href="#rules" onClick={() => setMobileOpen(false)}><ShieldCheck size={18} /> Progress rules</a>
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-label">This block</div>
          <div className="block-progress"><div className="progress-heading"><span>Week 01 / 08</span><b>12%</b></div><div className="progress-track"><div style={{ width: "12%" }} /></div></div>
          <div className="side-quote"><Sparkles size={16} /><span>Consistency beats intensity you can’t repeat.</span></div>
        </div>
      </aside>

      {mobileOpen && <button className="mobile-overlay" onClick={() => setMobileOpen(false)} aria-label="Close navigation" />}

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <div className="breadcrumb"><span>MY PLAN</span><ChevronRight size={14} /><b>OVERVIEW</b></div>
          <div className="topbar-actions"><span className="updated"><span className="live-dot" /> Built for your cut</span><button className="icon-button" onClick={resetWeek} title="Reset checklist"><RotateCcw size={17} /></button></div>
        </header>

        <div className="content-wrap">
          <section className="hero-section" id="overview">
            <div className="hero-copy">
              <div className="eyebrow"><span className="eyebrow-line" /> 08-WEEK WEIGHT-LOSS BLOCK</div>
              <h1>Cut weight.<br /><em>Keep strength.</em></h1>
              <p className="hero-lede">A focused gym plan for your next phase: train hard enough to retain muscle, move more without burning out, and let a steady calorie deficit do the work.</p>
              <div className="hero-actions"><a className="primary-button" href="#training">Start this week <ArrowUpRight size={17} /></a><a className="text-button" href="#rules">How to use this <ChevronRight size={16} /></a></div>
            </div>
            <div className="hero-visual">
              <div className="hero-grid" />
              <div className="hero-ring ring-one" /><div className="hero-ring ring-two" />
              <div className="hero-stat"><span>STARTING POINT</span><strong>75<span> kg</span></strong><small>Target pace · 0.3–0.6 kg / week</small></div>
              <div className="hero-stamp"><Target size={18} /><span>PERFORM<br />WHILE<br />LEANING OUT</span></div>
              <div className="hero-number">01</div>
            </div>
          </section>

          <section className="metrics-row" aria-label="Starting metrics">
            <Metric icon={Scale} value="75 kg" label="Current weight" />
            <Metric icon={Activity} value="26.3" label="BMI · context only" />
            <Metric icon={TrendingDown} value="−0.3–0.6 kg" label="Weekly target" />
            <Metric icon={Clock3} value="5 + 1" label="Training days" />
          </section>

          <section className="section-block" id="training">
            <div className="section-heading"><div><div className="section-kicker">01 / TRAINING SYSTEM</div><h2>Your week, <span>mapped.</span></h2></div><div className="section-note"><Info size={16} /> Warm up 5–8 min, then ramp into your first lift.</div></div>
            <div className="day-tabs" role="tablist" aria-label="Training days">
              {days.map((day) => <button key={day.id} className={`day-tab ${activeDay === day.id ? "selected" : ""} day-${day.color}`} onClick={() => { setActiveDay(day.id); setCompleted([]); }} role="tab" aria-selected={activeDay === day.id}><span>{day.label}</span><b>{day.title}</b><small>{day.focus}</small>{activeDay === day.id && <span className="selected-dot" />}</button>)}
            </div>

            <div className="workout-card">
              <div className="workout-top"><div><div className="workout-eyebrow">{workout.eyebrow} <span>•</span> {workout.duration}</div><h3>{workout.title}</h3><p>{workout.note}</p></div><div className="completion"><div className="completion-ring" style={{ background: `conic-gradient(var(--orange) ${completion * 3.6}deg, #e9e5dc 0deg)` }}><div><strong>{completion}%</strong><span>done</span></div></div></div></div>
              <div className="move-list">{workout.moves.map((move, index) => { const isDone = completed.includes(move.name); return <button className={`move-row ${isDone ? "done" : ""}`} key={move.name} onClick={() => toggleMove(move.name)}><span className="move-index">{String(index + 1).padStart(2, "0")}</span><span className={`check-box ${isDone ? "checked" : ""}`}>{isDone && <Check size={14} />}</span><span className="move-name">{move.name}<small>{move.cue}</small></span><strong className="move-sets">{move.sets}</strong><ChevronRight size={17} className="move-arrow" /></button>; })}</div>
              <div className="workout-footer"><span><Timer size={15} /> Tap an exercise to mark it complete</span><button onClick={() => toast("Training note", { description: "Aim to add 1 rep or a small load increase when all sets feel crisp." })}>Progression note <ArrowUpRight size={15} /></button></div>
            </div>
          </section>

          <section className="section-block nutrition-block" id="nutrition">
            <div className="section-heading"><div><div className="section-kicker">02 / FUEL + RECOVERY</div><h2>Make the deficit <span>livable.</span></h2></div><div className="section-note"><BatteryCharging size={16} /> Your plan works when your recovery can support it.</div></div>
            <div className="target-grid">{targets.map((target) => { const Icon = target.icon; return <div className={`target-card target-${target.color}`} key={target.label}><div className="target-icon"><Icon size={18} /></div><div className="target-label">{target.label}</div><strong>{target.value}</strong><p>{target.detail}</p></div>; })}</div>
            <div className="nutrition-bottom"><div className="plate-card"><div className="plate-header"><div><div className="mini-kicker">SIMPLE PLATE FORMULA</div><h3>Build most meals like this.</h3></div><Utensils size={22} /></div><div className="plate-bar"><span className="veg" style={{ width: "40%" }}>40%<small>produce</small></span><span className="protein" style={{ width: "30%" }}>30%<small>protein</small></span><span className="carbs" style={{ width: "30%" }}>30%<small>carbs</small></span></div><div className="plate-foot"><span><i className="dot veg-dot" /> vegetables + fruit</span><span><i className="dot protein-dot" /> lean protein</span><span><i className="dot carb-dot" /> carbs + fats</span></div></div><div className="recovery-card"><div className="mini-kicker">RECOVERY CHECK-IN</div><h3>Earn the next session.</h3><p>If sleep drops below 6 hours or soreness is high, swap Saturday conditioning for a walk. The goal is a repeatable week.</p><div className="recovery-row"><span><Moon size={16} /> Sleep</span><b>7.5–9 h</b></div><div className="recovery-row"><span><Footprints size={16} /> Low-intensity movement</span><b>20–40 min</b></div></div></div>
          </section>

          <section className="section-block rules-block" id="rules">
            <div className="section-heading"><div><div className="section-kicker">03 / PROGRESS RULES</div><h2>Simple inputs. <span>Clear calls.</span></h2></div></div>
            <div className="rules-grid"><div className="rule-card"><span className="rule-number">01</span><div><h3>Track the trend, not the noise.</h3><p>Weigh 3–7 mornings per week and use the weekly average. Daily scale changes are mostly water, food, and sodium.</p></div></div><div className="rule-card"><span className="rule-number">02</span><div><h3>Hold the plan for 14 days.</h3><p>If your average is not moving after two full weeks, reduce 100–150 kcal or add 1,500 daily steps—not both at once.</p></div></div><div className="rule-card"><span className="rule-number">03</span><div><h3>Protect the big lifts.</h3><p>When cutting, maintaining strength is a win. Add reps first; add load only when technique and target reps are solid.</p></div></div></div>
            <div className="disclaimer"><CircleHelp size={17} /><p><strong>Use your judgment.</strong> This is a starting plan, not medical advice. Adjust around fatigue, pain, or health conditions; a qualified professional can personalize it further.</p></div>
          </section>

          <footer className="footer"><div className="brand-name">CUT<span>STRONG</span></div><span>Built for the next 8 weeks · start steady, finish proud.</span><a href="#overview">Back to top <ArrowUpRight size={14} /></a></footer>
        </div>
      </main>
    </div>
  );
}
