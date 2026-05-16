import { useState } from "react";

const TENSE = {
  present: {
    label: "Present Simple Passive",
    formula: "IS / ARE  +  V3",
    signals: ["every day", "always", "twice a week", "regularly"],
    bg: "#dbeafe", border: "#1d4ed8", text: "#1e40af", chip: "#bfdbfe", emoji: "🔵",
  },
  past: {
    label: "Past Simple Passive",
    formula: "WAS / WERE  +  V3",
    signals: ["in 1889", "last year", "yesterday", "three weeks ago", "in the 15th century"],
    bg: "#ffedd5", border: "#c2410c", text: "#9a3412", chip: "#fed7aa", emoji: "🟠",
  },
  presentPerf: {
    label: "Present Perfect Passive",
    formula: "HAS / HAVE  +  BEEN  +  V3",
    signals: ["since", "recently", "yet", "already", "just", "not yet", "so far"],
    bg: "#f3e8ff", border: "#7e22ce", text: "#6b21a8", chip: "#e9d5ff", emoji: "🟣",
  },
  pastPerf: {
    label: "Past Perfect Passive",
    formula: "HAD  +  BEEN  +  V3",
    signals: ["before (+ past event)", "when she arrived", "by the time", "already (past)"],
    bg: "#dcfce7", border: "#15803d", text: "#166534", chip: "#bbf7d0", emoji: "🟢",
  },
};

const questions = [
  {
    parts: ["The clock mechanism", "wound by hand twice a week."],
    signal: "twice a week", signalType: "regular habit → present",
    options: ["is", "was", "has been", "had been"],
    answer: "is", tense: "present",
    rule: '"Twice a week" = regular present habit. No past time given. → IS + V3',
  },
  {
    parts: ["The Elizabeth Tower", "inaugurated in 1859."],
    signal: "in 1859", signalType: "specific past year → past simple",
    options: ["is", "has been", "was", "had been"],
    answer: "was", tense: "past",
    rule: '"In 1859" = a specific year in the past. Always past simple. → WAS + V3',
  },
  {
    parts: ["Several artefacts", "carefully preserved since the project began."],
    signal: "since", signalType: "connects past to present → present perfect",
    options: ["were", "has been", "have been", "are"],
    answer: "have been", tense: "presentPerf",
    rule: '"Since" connects a past action to the present. Plural subject (artefacts) → HAVE BEEN + V3',
  },
  {
    parts: ["The restoration", "not completed yet."],
    signal: "yet", signalType: "not finished up to now → present perfect",
    options: ["was", "is", "has been", "had been"],
    answer: "has been", tense: "presentPerf",
    rule: '"Not yet" = typical present perfect signal. Something unfinished up to now. → HAS BEEN + V3',
  },
  {
    parts: ["The broadcasting licence", "revoked three weeks ago."],
    signal: "three weeks ago", signalType: "specific past time → past simple",
    options: ["has been", "was", "is", "had been"],
    answer: "was", tense: "past",
    rule: '"Three weeks ago" = a specific past time. Always past simple. → WAS + V3',
  },
  {
    parts: ["When the investigators arrived, the documents", "already destroyed."],
    signal: "before 'arrived' (a past event)", signalType: "before another past action → past perfect",
    options: ["were", "have been", "had been", "are"],
    answer: "had been", tense: "pastPerf",
    rule: 'The documents were destroyed BEFORE the investigators arrived. One past action before another → HAD BEEN + V3',
  },
  {
    parts: ["The artefact", "not yet examined by the specialists."],
    signal: "not yet", signalType: "unfinished up to now → present perfect",
    options: ["was", "has been", "is", "had been"],
    answer: "has been", tense: "presentPerf",
    rule: '"Not yet" = the examination has not happened yet, up to the present. → HAS BEEN + V3',
  },
  {
    parts: ["The maps", "deteriorating for years before Amara restored them."],
    signal: "before Amara restored them", signalType: "before another past event → past perfect",
    options: ["are", "were", "have been", "had been"],
    answer: "had been", tense: "pastPerf",
    rule: 'Deteriorating happened BEFORE Amara restored them. One past action before another → HAD BEEN + V3',
  },
  {
    parts: ["Performances", "held here every evening throughout the season."],
    signal: "every evening", signalType: "regular present habit → present simple",
    options: ["has been", "had been", "are", "were"],
    answer: "are", tense: "present",
    rule: '"Every evening" = ongoing regular schedule. → ARE + V3',
  },
  {
    parts: ["The singer's new album", "only just released to the public."],
    signal: "only just", signalType: "very recently, connected to now → present perfect",
    options: ["was", "has been", "is", "had been"],
    answer: "has been", tense: "presentPerf",
    rule: '"Only just" = extremely recent, still relevant now. Treat like "recently" or "just". → HAS BEEN + V3',
  },
];

const errorQs = [
  {
    sentence: "The tower has inaugurated in 1859.",
    correct: false,
    fix: "The tower was inaugurated in 1859.",
    why: '"In 1859" = specific past year → needs WAS, not HAS. Also missing BEEN.',
  },
  {
    sentence: "The artefacts have been discovered last year.",
    correct: false,
    fix: "The artefacts were discovered last year.",
    why: '"Last year" = specific past time → WAS/WERE, not HAVE BEEN.',
  },
  {
    sentence: "The documents have destroyed before she arrived.",
    correct: false,
    fix: "The documents had been destroyed before she arrived.",
    why: 'Missing BEEN. Also wrong tense — before a past event needs HAD BEEN.',
  },
  {
    sentence: "The clock mechanism is wound by hand twice a week.",
    correct: true,
    fix: null,
    why: '"Twice a week" = regular habit → IS + V3. ✓ Correct.',
  },
  {
    sentence: "The artefacts is not yet examined by the specialists.",
    correct: false,
    fix: "The artefacts have not been examined by the specialists yet.",
    why: 'Two errors: plural subject needs HAVE (not is), and BEEN is missing.',
  },
];

export default function PassiveVoiceActivity() {
  const [tab, setTab] = useState("quiz");
  const [showRef, setShowRef] = useState(true);
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [quizDone, setQuizDone] = useState(false);

  const [errIdx, setErrIdx] = useState(0);
  const [errAnswer, setErrAnswer] = useState(null);
  const [errSubmitted, setErrSubmitted] = useState(false);
  const [errScore, setErrScore] = useState(0);
  const [errDone, setErrDone] = useState(false);

  const q = questions[idx];
  const info = TENSE[q.tense];
  const eq = errorQs[errIdx];

  const handleSelect = (opt) => { if (!submitted) setSelected(opt); };
  const handleSubmit = () => {
    if (!selected) return;
    const correct = selected === q.answer;
    setSubmitted(true);
    if (correct) setScore(s => s + 1);
    setHistory(h => [...h, { correct, answer: q.answer, selected, rule: q.rule, tense: q.tense }]);
  };
  const handleNext = () => {
    if (idx === questions.length - 1) { setQuizDone(true); return; }
    setIdx(i => i + 1); setSelected(null); setSubmitted(false);
  };
  const restart = () => {
    setIdx(0); setSelected(null); setSubmitted(false); setScore(0); setHistory([]); setQuizDone(false);
  };

  const handleErrAnswer = (val) => { if (!errSubmitted) setErrAnswer(val); };
  const handleErrSubmit = () => {
    if (errAnswer === null) return;
    setErrSubmitted(true);
    if ((errAnswer === "correct") === eq.correct) setErrScore(s => s + 1);
  };
  const handleErrNext = () => {
    if (errIdx === errorQs.length - 1) { setErrDone(true); return; }
    setErrIdx(i => i + 1); setErrAnswer(null); setErrSubmitted(false);
  };
  const restartErr = () => {
    setErrIdx(0); setErrAnswer(null); setErrSubmitted(false); setErrScore(0); setErrDone(false);
  };

  const N = "#1a3a6b";

  return (
    <div style={{ fontFamily: "Arial, sans-serif", maxWidth: 680, margin: "0 auto", padding: 20, background: "#f8f9fc", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: N, color: "#fff", borderRadius: 14, padding: "18px 24px", marginBottom: 18 }}>
        <div style={{ fontSize: 22, fontWeight: 900 }}>🔍 Passive Voice Detective</div>
        <div style={{ fontSize: 13, opacity: 0.8, marginTop: 3 }}>Is/Are/Was/Were  vs  Has/Have/Had + BEEN  —  master the difference</div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {[["quiz", "Part 1: Choose the Auxiliary"], ["errors", "Part 2: Spot the Error"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ flex: 1, padding: "11px 8px", border: `2px solid ${N}`, borderRadius: 9, background: tab === id ? N : "#fff", color: tab === id ? "#fff" : N, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>
            {label}
          </button>
        ))}
      </div>

      {/* ══ REFERENCE CARD ══ */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setShowRef(r => !r)} style={{ width: "100%", background: "#e8edf6", border: `2px solid ${N}`, borderRadius: 9, padding: "10px 16px", fontSize: 13, fontWeight: 700, color: N, cursor: "pointer", textAlign: "left" }}>
          {showRef ? "▲" : "▼"}  Reference Card — click to {showRef ? "hide" : "show"}
        </button>
        {showRef && (
          <div style={{ border: `2px solid ${N}`, borderRadius: "0 0 9px 9px", padding: 14, background: "#fff" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {Object.entries(TENSE).map(([key, t]) => (
                <div key={key} style={{ background: t.bg, border: `2px solid ${t.border}`, borderRadius: 9, padding: 12 }}>
                  <div style={{ fontWeight: 900, color: t.text, fontSize: 12, marginBottom: 4 }}>{t.emoji} {t.label}</div>
                  <div style={{ fontFamily: "monospace", fontWeight: 900, color: t.text, fontSize: 15, marginBottom: 6 }}>{t.formula}</div>
                  <div style={{ fontSize: 11, color: "#555", marginBottom: 3 }}>Signal words:</div>
                  <div style={{ fontSize: 11, fontStyle: "italic", color: t.text }}>{t.signals.slice(0, 3).join("  ·  ")}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12, padding: "10px 14px", background: "#fff8e1", border: "1.5px solid #f0a500", borderRadius: 8, fontSize: 12 }}>
              <strong style={{ color: "#7a4f00" }}>⚠️ The most common mistake:</strong>
              <span style={{ color: "#555" }}> Writing </span>
              <code style={{ background: "#fee2e2", padding: "1px 6px", borderRadius: 4, color: "#c62828" }}>has restored</code>
              <span style={{ color: "#555" }}> instead of </span>
              <code style={{ background: "#dcfce7", padding: "1px 6px", borderRadius: 4, color: "#166534" }}>has been restored</code>
              <span style={{ color: "#555" }}>. Passive always needs the extra </span>
              <strong>BEEN</strong>.
            </div>
          </div>
        )}
      </div>

      {/* ══ QUIZ PART 1 ══ */}
      {tab === "quiz" && !quizDone && (
        <div>
          {/* Progress */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555", marginBottom: 6 }}>
            <span>Question {idx + 1} of {questions.length}</span>
            <span style={{ fontWeight: 700, color: N }}>Score: {score}</span>
          </div>
          <div style={{ background: "#e8edf6", borderRadius: 99, height: 7, marginBottom: 18, overflow: "hidden" }}>
            <div style={{ background: N, height: "100%", width: `${((idx + 1) / questions.length) * 100}%`, borderRadius: 99, transition: "width 0.3s" }} />
          </div>

          {/* Question card */}
          <div style={{ background: "#fff", border: "2px solid #ddd", borderRadius: 14, padding: 24, marginBottom: 14 }}>
            {/* Signal word badge */}
            <div style={{ background: info.chip, border: `1.5px solid ${info.border}`, borderRadius: 7, padding: "4px 12px", display: "inline-block", fontSize: 12, color: info.text, fontWeight: 700, marginBottom: 16 }}>
              🔑 Signal: &quot;{q.signal}&quot; → {q.signalType}
            </div>
            {/* Sentence */}
            <div style={{ fontSize: 20, lineHeight: 1.9, textAlign: "center", color: "#111" }}>
              {q.parts[0]}&nbsp;
              <span style={{ display: "inline-block", minWidth: 150, padding: "3px 12px", border: `3px solid ${submitted ? (selected === q.answer ? "#16a34a" : "#dc2626") : N}`, borderRadius: 8, background: submitted ? (selected === q.answer ? "#dcfce7" : "#fee2e2") : "#e8edf6", color: submitted ? (selected === q.answer ? "#15803d" : "#b91c1c") : N, fontWeight: 900, textAlign: "center", transition: "all 0.2s" }}>
                {selected || "  ___  "}
              </span>
              &nbsp;{q.parts[1]}
            </div>
          </div>

          {/* Options */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
            {q.options.map(opt => {
              let bg = "#fff", border = "#d1d5db", col = "#111", fw = 400;
              if (selected === opt && !submitted) { bg = "#e8edf6"; border = N; col = N; fw = 700; }
              if (submitted) {
                if (opt === q.answer) { bg = "#dcfce7"; border = "#16a34a"; col = "#15803d"; fw = 700; }
                else if (selected === opt && opt !== q.answer) { bg = "#fee2e2"; border = "#dc2626"; col = "#b91c1c"; }
              }
              return (
                <button key={opt} onClick={() => handleSelect(opt)} disabled={submitted}
                  style={{ background: bg, border: `2px solid ${border}`, borderRadius: 9, padding: "14px 10px", fontSize: 18, fontWeight: fw, color: col, cursor: submitted ? "default" : "pointer", fontFamily: "monospace", transition: "all 0.15s" }}>
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {submitted && (
            <div style={{ background: selected === q.answer ? "#f0fdf4" : "#fff7ed", border: `2px solid ${selected === q.answer ? "#16a34a" : "#ea580c"}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontWeight: 900, fontSize: 15, color: selected === q.answer ? "#15803d" : "#c2410c", marginBottom: 6 }}>
                {selected === q.answer ? "✓ Correct!" : `✗ Answer: ${q.answer}`}
              </div>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: "#333" }}>
                <span style={{ fontWeight: 700, color: TENSE[q.tense].text }}>{TENSE[q.tense].emoji} {TENSE[q.tense].label}</span>
                <br />{q.rule}
              </div>
            </div>
          )}

          {!submitted
            ? <button onClick={handleSubmit} disabled={!selected} style={{ width: "100%", padding: 14, background: selected ? N : "#9ca3af", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: selected ? "pointer" : "default" }}>Check Answer</button>
            : <button onClick={handleNext} style={{ width: "100%", padding: 14, background: N, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                {idx === questions.length - 1 ? "See Results →" : "Next Question →"}
              </button>
          }
        </div>
      )}

      {/* ══ QUIZ RESULTS ══ */}
      {tab === "quiz" && quizDone && (
        <div>
          <div style={{ background: N, color: "#fff", borderRadius: 14, padding: 28, textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 48 }}>{score >= 8 ? "🏆" : score >= 6 ? "💪" : "📚"}</div>
            <div style={{ fontSize: 30, fontWeight: 900, marginTop: 8 }}>{score} / {questions.length}</div>
            <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
              {score >= 8 ? "Excellent — you've mastered the patterns!" : score >= 6 ? "Good. Review the missed ones below." : "Keep practising — look for the signal words!"}
            </div>
          </div>
          {history.map((h, i) => {
            const hq = questions[i];
            const hi = TENSE[h.tense];
            return (
              <div key={i} style={{ border: `2px solid ${h.correct ? "#16a34a" : "#dc2626"}`, borderRadius: 10, padding: 12, marginBottom: 10, background: h.correct ? "#f0fdf4" : "#fff7ed" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ fontSize: 13, flex: 1 }}>
                    <span style={{ fontWeight: 700 }}>Q{i + 1}:</span> {hq.parts[0]} <strong style={{ background: h.correct ? "#bbf7d0" : "#fecaca", padding: "1px 6px", borderRadius: 4 }}>{h.answer}</strong> {hq.parts[1]}
                  </div>
                  <span style={{ fontSize: 18, marginLeft: 10 }}>{h.correct ? "✓" : "✗"}</span>
                </div>
                {!h.correct && <div style={{ fontSize: 12, color: "#555", marginTop: 6 }}>{h.rule}</div>}
              </div>
            );
          })}
          <button onClick={restart} style={{ width: "100%", padding: 14, background: N, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>Try Again</button>
        </div>
      )}

      {/* ══ ERROR SPOTTING PART 2 ══ */}
      {tab === "errors" && !errDone && (
        <div>
          <div style={{ background: "#fff8e1", border: "1.5px solid #f0a500", borderRadius: 10, padding: "10px 14px", marginBottom: 18, fontSize: 13 }}>
            <strong style={{ color: "#7a4f00" }}>How to play:</strong> Read each sentence. Is the passive verb form <strong>correct</strong> or does it contain an <strong>error</strong>?
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#555", marginBottom: 6 }}>
            <span>Sentence {errIdx + 1} of {errorQs.length}</span>
            <span style={{ fontWeight: 700, color: N }}>Score: {errScore}</span>
          </div>
          <div style={{ background: "#e8edf6", borderRadius: 99, height: 7, marginBottom: 18, overflow: "hidden" }}>
            <div style={{ background: N, height: "100%", width: `${((errIdx + 1) / errorQs.length) * 100}%`, borderRadius: 99, transition: "width 0.3s" }} />
          </div>

          <div style={{ background: "#fff", border: "2px solid #ddd", borderRadius: 14, padding: 24, marginBottom: 16, fontSize: 19, lineHeight: 1.8, textAlign: "center", color: "#111" }}>
            {eq.sentence}
          </div>

          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            {[["correct", "✓  Correct", "#dcfce7", "#16a34a", "#15803d"], ["wrong", "✗  Contains an Error", "#fee2e2", "#dc2626", "#b91c1c"]].map(([val, label, bg, border, col]) => {
              const isSelected = errAnswer === val;
              const showResult = errSubmitted;
              let finalBg = isSelected ? bg : "#fff";
              let finalBorder = isSelected ? border : "#d1d5db";
              let finalCol = isSelected ? col : "#555";
              if (showResult) {
                const isThisRight = (val === "correct") === eq.correct;
                if (isSelected) { finalBg = isThisRight ? "#dcfce7" : "#fee2e2"; finalBorder = isThisRight ? "#16a34a" : "#dc2626"; }
                if (!isSelected && isThisRight) { finalBg = "#dcfce7"; finalBorder = "#16a34a"; finalCol = "#15803d"; }
              }
              return (
                <button key={val} onClick={() => handleErrAnswer(val)} disabled={errSubmitted}
                  style={{ flex: 1, padding: 16, background: finalBg, border: `2px solid ${finalBorder}`, borderRadius: 10, fontSize: 15, fontWeight: 700, color: finalCol, cursor: errSubmitted ? "default" : "pointer", transition: "all 0.15s" }}>
                  {label}
                </button>
              );
            })}
          </div>

          {errSubmitted && (
            <div style={{ background: (errAnswer === "correct") === eq.correct ? "#f0fdf4" : "#fff7ed", border: `2px solid ${(errAnswer === "correct") === eq.correct ? "#16a34a" : "#ea580c"}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
              <div style={{ fontWeight: 900, fontSize: 14, marginBottom: 6, color: (errAnswer === "correct") === eq.correct ? "#15803d" : "#c2410c" }}>
                {(errAnswer === "correct") === eq.correct ? "✓ Correct!" : "✗ Not quite"}
              </div>
              <div style={{ fontSize: 13, color: "#333", lineHeight: 1.6 }}>
                {eq.why}
                {eq.fix && <><br /><span style={{ fontWeight: 700 }}>Should be: </span><code style={{ background: "#dcfce7", padding: "2px 8px", borderRadius: 4, color: "#15803d" }}>{eq.fix}</code></>}
              </div>
            </div>
          )}

          {!errSubmitted
            ? <button onClick={handleErrSubmit} disabled={errAnswer === null} style={{ width: "100%", padding: 14, background: errAnswer !== null ? N : "#9ca3af", color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: errAnswer !== null ? "pointer" : "default" }}>Check</button>
            : <button onClick={handleErrNext} style={{ width: "100%", padding: 14, background: N, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>
                {errIdx === errorQs.length - 1 ? "See Results →" : "Next →"}
              </button>
          }
        </div>
      )}

      {tab === "errors" && errDone && (
        <div style={{ textAlign: "center" }}>
          <div style={{ background: N, color: "#fff", borderRadius: 14, padding: 28, marginBottom: 20 }}>
            <div style={{ fontSize: 48 }}>{errScore >= 4 ? "🎉" : "📚"}</div>
            <div style={{ fontSize: 28, fontWeight: 900 }}>{errScore} / {errorQs.length}</div>
            <div style={{ fontSize: 14, opacity: 0.85, marginTop: 4 }}>
              {errScore >= 4 ? "You can spot the errors clearly!" : "Review the reference card, then try again."}
            </div>
          </div>
          <button onClick={restartErr} style={{ width: "100%", padding: 14, background: N, color: "#fff", border: "none", borderRadius: 10, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Try Again</button>
        </div>
      )}
    </div>
  );
}
