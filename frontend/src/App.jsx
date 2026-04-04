import { useState, useRef, useEffect } from "react";
import axios from "axios";

const API = "http://127.0.0.1:8000";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #f4f3ef;
    --surface: #ffffff;
    --surface2: #f9f8f5;
    --sidebar: #141414;
    --sidebar-hover: #222222;
    --sidebar-active: #1a3a2a;
    --text: #1a1a1a;
    --text-muted: #6b6b6b;
    --text-light: #9a9a9a;
    --green: #2d6a4f;
    --green-light: #40916c;
    --green-pale: #d8f3dc;
    --gold: #c8960c;
    --gold-pale: #fef3c7;
    --border: #e8e6e0;
    --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
    --shadow-lg: 0 8px 32px rgba(0,0,0,0.10);
    --radius: 12px;
    --radius-sm: 8px;
  }

  body { font-family: 'DM Sans', sans-serif; background: var(--bg); color: var(--text); }

  .dashboard { display: flex; height: 100vh; overflow: hidden; }

  /* SIDEBAR */
  .sidebar {
    width: 220px; min-width: 220px; background: var(--sidebar);
    display: flex; flex-direction: column; padding: 0;
    border-right: 1px solid #2a2a2a;
  }

  .sidebar-logo {
    padding: 24px 20px 20px;
    border-bottom: 1px solid #2a2a2a;
  }

  .sidebar-logo .logo-icon {
    width: 36px; height: 36px; background: var(--green);
    border-radius: 8px; display: flex; align-items: center;
    justify-content: center; font-size: 18px; margin-bottom: 10px;
  }

  .sidebar-logo h2 {
    font-size: 13px; font-weight: 600; color: #fff;
    letter-spacing: 0.04em; line-height: 1.3;
  }

  .sidebar-logo p { font-size: 11px; color: #666; margin-top: 2px; }

  .sidebar-nav { padding: 16px 12px; flex: 1; }

  .nav-label {
    font-size: 10px; font-weight: 600; color: #444;
    letter-spacing: 0.1em; text-transform: uppercase;
    padding: 0 8px; margin-bottom: 8px; margin-top: 16px;
  }

  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 8px; cursor: pointer;
    color: #888; font-size: 13px; font-weight: 500;
    transition: all 0.15s ease; margin-bottom: 2px;
    border: none; background: none; width: 100%; text-align: left;
  }

  .nav-item:hover { background: var(--sidebar-hover); color: #ccc; }

  .nav-item.active {
    background: var(--sidebar-active);
    color: #fff;
  }

  .nav-item.active .nav-icon { color: #52b788; }

  .nav-icon { font-size: 16px; width: 20px; text-align: center; }

  .sidebar-footer {
    padding: 16px 20px;
    border-top: 1px solid #2a2a2a;
  }

  .stat-pill {
    background: #1e1e1e; border-radius: 8px; padding: 10px 12px;
    margin-bottom: 8px;
  }

  .stat-pill .sp-label { font-size: 10px; color: #555; text-transform: uppercase; letter-spacing: 0.08em; }
  .stat-pill .sp-value { font-size: 18px; font-weight: 700; color: #52b788; font-family: 'DM Mono', monospace; }
  .stat-pill .sp-sub { font-size: 10px; color: #444; }

  /* MAIN */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }

  .topbar {
    background: var(--surface); border-bottom: 1px solid var(--border);
    padding: 0 32px; height: 60px; display: flex; align-items: center;
    justify-content: space-between; flex-shrink: 0;
  }

  .topbar-left { display: flex; align-items: center; gap: 12px; }

  .page-title { font-size: 16px; font-weight: 600; color: var(--text); }
  .page-sub { font-size: 12px; color: var(--text-muted); margin-top: 1px; }

  .topbar-right { display: flex; align-items: center; gap: 12px; }

  .badge {
    background: var(--green-pale); color: var(--green);
    font-size: 11px; font-weight: 600; padding: 4px 10px;
    border-radius: 20px; letter-spacing: 0.02em;
  }

  .badge.gold { background: var(--gold-pale); color: var(--gold); }

  /* CONTENT */
  .content { flex: 1; overflow-y: auto; padding: 28px 32px; }

  /* STAT CARDS ROW */
  .stat-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 28px; }

  .stat-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px; position: relative; overflow: hidden;
  }

  .stat-card::before {
    content: ''; position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: var(--green);
  }

  .stat-card.gold::before { background: var(--gold); }

  .stat-card-label { font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; }
  .stat-card-value { font-size: 26px; font-weight: 700; color: var(--text); font-family: 'DM Mono', monospace; }
  .stat-card-sub { font-size: 11px; color: var(--text-light); margin-top: 4px; }
  .stat-card-icon { position: absolute; right: 16px; top: 16px; font-size: 22px; opacity: 0.15; }

  /* FORM CARD */
  .form-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 28px;
    box-shadow: var(--shadow);
  }

  .form-card-header { margin-bottom: 24px; }
  .form-card-title { font-size: 15px; font-weight: 600; color: var(--text); }
  .form-card-desc { font-size: 13px; color: var(--text-muted); margin-top: 4px; }

  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .form-grid-3 { grid-template-columns: 1fr 1fr 1fr; }

  .field label {
    display: block; font-size: 12px; font-weight: 600;
    color: var(--text-muted); text-transform: uppercase;
    letter-spacing: 0.06em; margin-bottom: 8px;
  }

  .field input, .field select {
    width: 100%; padding: 10px 14px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius-sm); color: var(--text);
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s;
    appearance: none;
  }

  .field input:focus, .field select:focus {
    outline: none; border-color: var(--green-light);
    background: #fff;
  }

  .btn-primary {
    padding: 11px 28px; background: var(--green); color: #fff;
    border: none; border-radius: var(--radius-sm); font-weight: 600;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: background 0.15s;
    display: inline-flex; align-items: center; gap: 8px;
  }

  .btn-primary:hover { background: var(--green-light); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  /* RESULTS */
  .results-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 24px; }

  .result-card {
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px; text-align: center;
    transition: transform 0.15s, box-shadow 0.15s;
  }

  .result-card:hover { transform: translateY(-2px); box-shadow: var(--shadow-lg); }

  .result-rank {
    font-size: 10px; font-weight: 700; color: var(--text-light);
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px;
  }

  .result-rank.first { color: var(--gold); }

  .result-crop { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 12px; }

  .score-ring {
    width: 72px; height: 72px; border-radius: 50%;
    border: 3px solid var(--green-pale); display: flex;
    align-items: center; justify-content: center; margin: 0 auto 12px;
    position: relative;
  }

  .score-ring.high { border-color: var(--green); }
  .score-ring.med { border-color: var(--gold); }

  .score-value { font-size: 20px; font-weight: 700; color: var(--text); font-family: 'DM Mono', monospace; }
  .score-label { font-size: 10px; color: var(--text-muted); }

  .mini-bar { height: 4px; background: var(--border); border-radius: 2px; margin-top: 12px; overflow: hidden; }
  .mini-bar-fill { height: 100%; background: var(--green); border-radius: 2px; transition: width 0.6s ease; }
  .mini-bar-label { display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-top: 4px; }

  /* YIELD RESULT */
  .yield-result {
    background: var(--sidebar); color: #fff;
    border-radius: var(--radius); padding: 32px; text-align: center;
    margin-top: 24px;
  }

  .yield-number { font-size: 56px; font-weight: 700; color: #52b788; font-family: 'DM Mono', monospace; line-height: 1; }
  .yield-unit { font-size: 16px; color: #888; margin-top: 8px; }
  .yield-meta { font-size: 12px; color: #555; margin-top: 16px; }

  /* CHAT */
  .chat-container { display: flex; flex-direction: column; height: calc(100vh - 180px); }

  .chat-messages {
    flex: 1; overflow-y: auto; padding: 20px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: var(--radius); margin-bottom: 16px;
    display: flex; flex-direction: column; gap: 16px;
  }

  .msg { display: flex; gap: 10px; align-items: flex-start; }
  .msg.user { flex-direction: row-reverse; }

  .msg-avatar {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700;
  }

  .msg.bot .msg-avatar { background: var(--green); color: #fff; }
  .msg.user .msg-avatar { background: var(--sidebar); color: #52b788; }

  .msg-bubble {
    max-width: 72%; padding: 12px 16px; border-radius: 12px;
    font-size: 14px; line-height: 1.6;
  }

  .msg.bot .msg-bubble { background: var(--surface); border: 1px solid var(--border); color: var(--text); border-top-left-radius: 2px; }
  .msg.user .msg-bubble { background: var(--green); color: #fff; border-top-right-radius: 2px; }

  .chat-input-row { display: flex; gap: 12px; }

  .chat-input {
    flex: 1; padding: 13px 16px;
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius-sm); font-size: 14px;
    font-family: 'DM Sans', sans-serif; color: var(--text);
    transition: border-color 0.15s;
  }

  .chat-input:focus { outline: none; border-color: var(--green-light); }

  /* ROTATION */
  .rotation-reason {
    background: var(--gold-pale); border: 1px solid #fde68a;
    border-radius: var(--radius); padding: 16px 20px; margin-top: 24px;
    border-left: 4px solid var(--gold);
  }

  .rotation-reason p { font-size: 13px; color: #92400e; line-height: 1.6; }

  .rotation-crops { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 16px; }

  .rotation-crop-card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px; text-align: center;
    border-top: 3px solid var(--green-light);
  }

  .rotation-crop-card .crop-emoji { font-size: 28px; margin-bottom: 8px; }
  .rotation-crop-card .crop-name { font-size: 15px; font-weight: 600; color: var(--text); }
  .rotation-crop-card .crop-tag { font-size: 11px; color: var(--text-muted); margin-top: 4px; }

  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #ddd; border-radius: 3px; }
`;

const TAB_META = {
  recommend: { icon: "🌱", label: "Crop Advisor", desc: "Rule-based recommendation" },
  yield: { icon: "📊", label: "Yield Forecast", desc: "ML prediction model" },
  chat: { icon: "🤖", label: "AI Assistant", desc: "Powered by LLaMA" },
  rotation: { icon: "🔄", label: "Crop Rotation", desc: "Seasonal planning" },
};

const SOILS = ["Loamy", "Sandy", "Clay/Loamy", "Black soil", "Sandy Loam"];
const SEASONS = ["Kharif", "Rabi", "Annual", "Whole Year", "Summer", "Autumn", "Winter"];
const CROPS = ["Rice", "Wheat", "Maize", "Cotton", "Sugarcane", "Groundnut", "Soybean", "Mustard", "Gram", "Potato", "Onion", "Tur (Arhar)", "Moong", "Barley", "Sunflower"];

export default function App() {
  const [tab, setTab] = useState("recommend");

  const [recForm, setRecForm] = useState({ rainfall: "", temperature: "", soil: "Loamy", season: "Kharif" });
  const [recResults, setRecResults] = useState(null);
  const [recLoading, setRecLoading] = useState(false);

  const [yieldForm, setYieldForm] = useState({ crop: "", state: "", season: "Kharif", area: "", rainfall: "", fertilizer: "", pesticide: "" });
  const [yieldResult, setYieldResult] = useState(null);
  const [yieldLoading, setYieldLoading] = useState(false);

  const [messages, setMessages] = useState([{ role: "bot", text: "Hello! I'm your AI farming assistant. Ask me anything about crops, fertilizers, pest control, or farming practices in India." }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [rotationCrop, setRotationCrop] = useState("");
  const [rotationResult, setRotationResult] = useState(null);
  const [rotationLoading, setRotationLoading] = useState(false);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleRecommend = async () => {
    setRecLoading(true);
    try {
      const res = await axios.post(`${API}/recommend`, { rainfall: parseFloat(recForm.rainfall), temperature: parseFloat(recForm.temperature), soil: recForm.soil, season: recForm.season });
      setRecResults(res.data.recommendations);
    } catch { alert("Cannot connect to backend. Is uvicorn running?"); }
    setRecLoading(false);
  };

  const handleYield = async () => {
    setYieldLoading(true);
    try {
      const res = await axios.post(`${API}/predict-yield`, { crop: yieldForm.crop, state: yieldForm.state, season: yieldForm.season, area: parseFloat(yieldForm.area), rainfall: parseFloat(yieldForm.rainfall), fertilizer: parseFloat(yieldForm.fertilizer), pesticide: parseFloat(yieldForm.pesticide) });
      setYieldResult(res.data);
    } catch { alert("Cannot connect to backend."); }
    setYieldLoading(false);
  };

  const handleChat = async () => {
    if (!chatInput.trim()) return;
    const q = chatInput;
    setMessages(p => [...p, { role: "user", text: q }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await axios.post(`${API}/chat`, { question: q, context: {} });
      setMessages(p => [...p, { role: "bot", text: res.data.response }]);
    } catch {
      setMessages(p => [...p, { role: "bot", text: "Sorry, I couldn't connect to the server." }]);
    }
    setChatLoading(false);
  };

  const handleRotation = async () => {
    if (!rotationCrop) return;
    setRotationLoading(true);
    try {
      const res = await axios.post(`${API}/crop-rotation`, { current_crop: rotationCrop });
      setRotationResult(res.data);
    } catch { alert("Cannot connect to backend."); }
    setRotationLoading(false);
  };

  const meta = TAB_META[tab];

  return (
    <>
      <style>{styles}</style>
      <div className="dashboard">

        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-icon">🌾</div>
            <h2>AgriAI Platform</h2>
            <p>Agricultural Intelligence</p>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-label">Tools</div>
            {Object.entries(TAB_META).map(([key, val]) => (
              <button key={key} className={`nav-item ${tab === key ? "active" : ""}`} onClick={() => setTab(key)}>
                <span className="nav-icon">{val.icon}</span>
                <span>{val.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-footer">
            <div className="stat-pill">
              <div className="sp-label">Model Accuracy</div>
              <div className="sp-value">98.07%</div>
              <div className="sp-sub">Random Forest R²</div>
            </div>
            <div className="stat-pill">
              <div className="sp-label">Training Data</div>
              <div className="sp-value">19,691</div>
              <div className="sp-sub">Indian crop records</div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main">
          <div className="topbar">
            <div className="topbar-left">
              <div>
                <div className="page-title">{meta.icon} {meta.label}</div>
                <div className="page-sub">{meta.desc}</div>
              </div>
            </div>
            <div className="topbar-right">
              <span className="badge">ML Powered</span>
              <span className="badge gold">AI Assistant Active</span>
            </div>
          </div>

          <div className="content">

            {/* STAT ROW */}
            <div className="stat-row">
              {[
                { label: "Crops Covered", value: "23", sub: "In recommendation DB", icon: "🌿" },
                { label: "ML Accuracy", value: "98%", sub: "R² score on test set", icon: "📈", gold: true },
                { label: "Data Points", value: "19.6K", sub: "Training records", icon: "🗄️" },
                { label: "AI Model", value: "LLaMA", sub: "Groq powered assistant", icon: "🤖", gold: true },
              ].map((s, i) => (
                <div key={i} className={`stat-card ${s.gold ? "gold" : ""}`}>
                  <div className="stat-card-icon">{s.icon}</div>
                  <div className="stat-card-label">{s.label}</div>
                  <div className="stat-card-value">{s.value}</div>
                  <div className="stat-card-sub">{s.sub}</div>
                </div>
              ))}
            </div>

            {/* RECOMMEND TAB */}
            {tab === "recommend" && (
              <div className="form-card">
                <div className="form-card-header">
                  <div className="form-card-title">Enter Farm Conditions</div>
                  <div className="form-card-desc">Our rule-based engine scores each crop against your soil, rainfall, temperature, and season.</div>
                </div>
                <div className="form-grid">
                  {[["Rainfall (mm)", "rainfall", "number"], ["Temperature (°C)", "temperature", "number"]].map(([label, key, type]) => (
                    <div className="field" key={key}>
                      <label>{label}</label>
                      <input type={type} value={recForm[key]} onChange={e => setRecForm({ ...recForm, [key]: e.target.value })} placeholder="Enter value" />
                    </div>
                  ))}
                  <div className="field">
                    <label>Soil Type</label>
                    <select value={recForm.soil} onChange={e => setRecForm({ ...recForm, soil: e.target.value })}>
                      {SOILS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="field">
                    <label>Season</label>
                    <select value={recForm.season} onChange={e => setRecForm({ ...recForm, season: e.target.value })}>
                      {SEASONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button className="btn-primary" onClick={handleRecommend} disabled={recLoading}>
                  {recLoading ? "⏳ Analyzing..." : "🌱 Get Recommendations"}
                </button>

                {recResults && (
                  <div className="results-row">
                    {recResults.map((r, i) => (
                      <div className="result-card" key={i}>
                        <div className={`result-rank ${i === 0 ? "first" : ""}`}>{i === 0 ? "⭐ Top Pick" : `#${i + 1} Recommended`}</div>
                        <div className="result-crop">{r.crop}</div>
                        <div className={`score-ring ${r.score >= 70 ? "high" : "med"}`}>
                          <div>
                            <div className="score-value">{r.score}</div>
                            <div className="score-label">score</div>
                          </div>
                        </div>
                        <div className="mini-bar">
                          <div className="mini-bar-fill" style={{ width: `${r.rain_score}%` }} />
                        </div>
                        <div className="mini-bar-label"><span>Rain fit</span><span>{r.rain_score}%</span></div>
                        <div className="mini-bar">
                          <div className="mini-bar-fill" style={{ width: `${r.temp_score}%`, background: "#c8960c" }} />
                        </div>
                        <div className="mini-bar-label"><span>Temp fit</span><span>{r.temp_score}%</span></div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* YIELD TAB */}
            {tab === "yield" && (
              <div className="form-card">
                <div className="form-card-header">
                  <div className="form-card-title">Predict Crop Yield</div>
                  <div className="form-card-desc">Random Forest model trained on 19,691 Indian crop records. Predicts yield in tonnes per hectare.</div>
                </div>
                <div className="form-grid form-grid-3">
                  {[["Crop Name", "crop", "text"], ["State", "state", "text"], ["Area (ha)", "area", "number"], ["Rainfall (mm)", "rainfall", "number"], ["Fertilizer (kg)", "fertilizer", "number"], ["Pesticide (kg)", "pesticide", "number"]].map(([label, key, type]) => (
                    <div className="field" key={key}>
                      <label>{label}</label>
                      <input type={type} value={yieldForm[key]} onChange={e => setYieldForm({ ...yieldForm, [key]: e.target.value })} placeholder="Enter value" />
                    </div>
                  ))}
                  <div className="field">
                    <label>Season</label>
                    <select value={yieldForm.season} onChange={e => setYieldForm({ ...yieldForm, season: e.target.value })}>
                      {SEASONS.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <button className="btn-primary" onClick={handleYield} disabled={yieldLoading}>
                  {yieldLoading ? "⏳ Predicting..." : "📊 Predict Yield"}
                </button>

                {yieldResult && (
                  <div className="yield-result">
                    <div className="yield-number">{yieldResult.predicted_yield}</div>
                    <div className="yield-unit">tonnes / hectare</div>
                    <div className="yield-meta">Predicted by Random Forest Regressor · R² = 0.9807 · MAE = 9.44</div>
                  </div>
                )}
              </div>
            )}

            {/* CHAT TAB */}
            {tab === "chat" && (
              <div className="form-card" style={{ padding: "24px" }}>
                <div className="form-card-header">
                  <div className="form-card-title">AI Farming Assistant</div>
                  <div className="form-card-desc">Powered by LLaMA 3.1 via Groq. Ask about fertilizers, pests, crop care, and Indian farming practices.</div>
                </div>
                <div className="chat-container">
                  <div className="chat-messages">
                    {messages.map((m, i) => (
                      <div key={i} className={`msg ${m.role}`}>
                        <div className="msg-avatar">{m.role === "bot" ? "AI" : "You"}</div>
                        <div className="msg-bubble">{m.text}</div>
                      </div>
                    ))}
                    {chatLoading && (
                      <div className="msg bot">
                        <div className="msg-avatar">AI</div>
                        <div className="msg-bubble" style={{ color: "#999" }}>Thinking...</div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="chat-input-row">
                    <input className="chat-input" value={chatInput} onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleChat()}
                      placeholder="Ask about crops, fertilizers, pest control..." />
                    <button className="btn-primary" onClick={handleChat} disabled={chatLoading}>Send →</button>
                  </div>
                </div>
              </div>
            )}

            {/* ROTATION TAB */}
            {tab === "rotation" && (
              <div className="form-card">
                <div className="form-card-header">
                  <div className="form-card-title">Crop Rotation Advisor</div>
                  <div className="form-card-desc">Select your current crop to get science-based recommendations for next season. Prevents soil depletion and improves yield.</div>
                </div>
                <div className="form-grid" style={{ maxWidth: "500px" }}>
                  <div className="field">
                    <label>Current / Last Crop Grown</label>
                    <select value={rotationCrop} onChange={e => setRotationCrop(e.target.value)}>
                      <option value="">— Select a crop —</option>
                      {CROPS.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <button className="btn-primary" onClick={handleRotation} disabled={rotationLoading}>
                  {rotationLoading ? "⏳ Analyzing..." : "🔄 Get Rotation Advice"}
                </button>

                {rotationResult && (
                  <>
                    <div className="rotation-reason">
                      <p>💡 <strong>Why rotate?</strong> {rotationResult.reason}</p>
                    </div>
                    <div style={{ marginTop: "20px", marginBottom: "12px" }}>
                      <div className="form-card-title">Recommended for Next Season</div>
                    </div>
                    <div className="rotation-crops">
                      {rotationResult.recommended_next.map((crop, i) => (
                        <div className="rotation-crop-card" key={i}>
                          <div className="crop-emoji">🌿</div>
                          <div className="crop-name">{crop}</div>
                          <div className="crop-tag">Next season pick #{i + 1}</div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}
