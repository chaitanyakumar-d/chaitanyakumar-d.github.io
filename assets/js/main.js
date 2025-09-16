// Initialize AOS
AOS.init({
    duration: 1000,
    once: true
});

// Typing Effect
const typedTextSpan = document.querySelector(".typed-text");
const cursorSpan = document.querySelector(".cursor");

const textArray = ["Data Scientist", "ML Engineer", "AI Specialist"];
const typingDelay = 100;
const erasingDelay = 100;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if(!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
        typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex-1);
        charIndex--;
        setTimeout(erase, erasingDelay);
    } 
    else {
        cursorSpan.classList.remove("typing");
        textArrayIndex++;
        if(textArrayIndex>=textArray.length) textArrayIndex=0;
        setTimeout(type, typingDelay + 1100);
    }
}

document.addEventListener("DOMContentLoaded", function() {
    if(textArray.length) setTimeout(type, newTextDelay + 250);

    // Dynamic footer year
    const yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // Mobile Menu Toggle with ARIA
    const menuBtn = document.querySelector('.menu-btn');
    const navLinks = document.querySelector('.nav-links');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            const expanded = menuBtn.getAttribute('aria-expanded') === 'true';
            menuBtn.setAttribute('aria-expanded', String(!expanded));
            navLinks.classList.toggle('active');
            menuBtn.classList.toggle('active');
        });
    }

    // Removed dark mode toggle logic (simplified to single light theme)
    const body = document.body;

    // Style toggle (Glass vs Neumorphic vs Mixed)
    const styleBtn = document.querySelector('.style-toggle');
    const savedStyle = localStorage.getItem('style') || 'glass';

    function setStyleClass(style) {
        body.classList.remove('style-glass', 'style-neo', 'style-mixed');
        if (style === 'neo') body.classList.add('style-neo');
        else if (style === 'mixed') body.classList.add('style-mixed');
        else body.classList.add('style-glass');
        if (styleBtn) {
            const map = { glass: { icon: 'fa-magic', title: 'Switch to Neumorphism' }, neo: { icon: 'fa-layer-group', title: 'Switch to Mixed' }, mixed: { icon: 'fa-clone', title: 'Switch to Glass' } };
            const cfg = map[style];
            styleBtn.innerHTML = `<i class="fas ${cfg.icon}"></i>`;
            styleBtn.setAttribute('title', cfg.title);
        }
    }

    function nextStyle(current) {
        return current === 'glass' ? 'neo' : current === 'neo' ? 'mixed' : 'glass';
    }

    setStyleClass(savedStyle);

    if (styleBtn) {
        styleBtn.addEventListener('click', () => {
            const current = body.classList.contains('style-neo') ? 'neo' : body.classList.contains('style-mixed') ? 'mixed' : 'glass';
            const next = nextStyle(current);
            setStyleClass(next);
            localStorage.setItem('style', next);
        });
    }

    // Collapsible Skills Toggle
    const skillsToggle = document.getElementById('skillsToggle');
    const extendedSkills = document.getElementById('extendedSkills');
    if (skillsToggle && extendedSkills) {
        skillsToggle.addEventListener('click', () => {
            const expanded = skillsToggle.getAttribute('aria-expanded') === 'true';
            const nextState = !expanded;
            skillsToggle.setAttribute('aria-expanded', String(nextState));
            if (nextState) {
                extendedSkills.hidden = false;
                skillsToggle.textContent = 'Hide Additional Skills';
            } else {
                extendedSkills.hidden = true;
                skillsToggle.textContent = 'Show More Skills';
            }
        });
    }

    // AI Chat Assistant (Rule-based resume Q&A)
    const launcher = document.getElementById('chatLauncher');
    const footerChatHint = document.getElementById('footerChatHint');
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatClose');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    const messagesEl = document.getElementById('chatMessages');

    // Step 3 state: conversation history + debug
    const chatState = {
        history: [],
        maxHistory: 8,
        lastBestId: null,
        debug: false,
        lastDebugScores: null
    };
    let lastFocusBeforeOpen = null;
    if (footerChatHint) {
        footerChatHint.addEventListener('click', () => {
            if (!panel.classList.contains('active')) {
                lastFocusBeforeOpen = footerChatHint;
                panel.classList.add('active');
                panel.setAttribute('aria-hidden','false');
                setTimeout(() => input && input.focus(), 20);
            } else if (input) {
                input.focus();
            }
        });
    }

    // Persistence helpers
    const STORAGE_KEY = 'chat_assistant_state_v1';
    function saveState(){
        try {
            const payload = {
                history: chatState.history.slice(-chatState.maxHistory),
                lastBestId: chatState.lastBestId
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch(e) {/* ignore */}
    }
    function loadState(){
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const data = JSON.parse(raw);
            if (Array.isArray(data.history)) chatState.history = data.history.slice(-chatState.maxHistory);
            if (data.lastBestId) chatState.lastBestId = data.lastBestId;
            // Reconstruct visible messages from stored history (user only) as a light bootstrap
            if (messagesEl && chatState.history.length){
                chatState.history.slice(-4).forEach(q => addMessage(q, 'user'));
            }
        } catch(e) {/* ignore */}
    }
    loadState();

    // Knowledge base derived from resume/portfolio
    // Step 2: Embedding-ready KB structure (adds id + vector placeholder)
    const kb = [
        { id: 1, tags: ['piper','current','role','gpt','rag','neo4j','fraud','trading','agent'], answer: 'At Piper Sandler I deployed a GPT-4 + RAG research assistant (50% faster analyst turnaround), built a Neo4j + LLM retrieval layer, prototyped autonomous trading/risk agents (15% better backtested risk-adjusted returns), and implemented a graph+NLP fraud pipeline that improved precision by 20%.', vector: null },
        { id: 2, tags: ['graduate','research','assistant','retention','university','concordia','88%','grant'], answer: 'As a Graduate Research Assistant I engineered an 88% accuracy student retention model, co-authored a successful $50K AI ethics grant, and ran large-scale NLP sentiment analysis for strategic dashboards.', vector: null },
        { id: 3, tags: ['cvs','aetna','healthcare','infosys','segmentation','vertex','bert','gan','risk','readmission','12%'], answer: 'For CVS Aetna I built patient segmentation (12% reduction in readmissions), cost & risk models on Vertex AI (85% accuracy), applied BERT for clinical entity extraction, and generated HIPAA-compliant synthetic data with GANs.', vector: null },
        { id: 4, tags: ['schwab','charles','finance','databricks','agentic','automation','llm','fraud','pipeline','30%'], answer: 'At Charles Schwab I implemented agentic automation (ETL + anomaly detection), prototyped LLM chatbot workflows, optimized Databricks pipelines (30% faster), and applied ML for fraud & segmentation to improve client risk stratification.', vector: null },
        { id: 5, tags: ['twilight','analyst','churn','forecast','pca','etl','tableau'], answer: 'At Twilight Software I delivered churn & demand forecasts, applied statistical methods + PCA, engineered ETL/warehousing for BI, and built Tableau dashboards for leadership KPIs.', vector: null },
        { id: 6, tags: ['skills','stack','core','tech','technology'], answer: 'Core stack: Python, SQL, Machine Learning, LLMs (RAG), Spark, Cloud (GCP/Azure/AWS), Databricks, Neo4j. Extended: PyTorch, Scikit-learn, XGBoost, TensorFlow, LangChain, Vertex AI, SageMaker, ETL, Graph Analytics, NLP, Time Series, GANs, MLOps, Tableau, Power BI.', vector: null },
        { id: 7, tags: ['education','degree','ms','master','bsc','college','university'], answer: 'Education: M.S. Data Analytics (Concordia University St. Paul, GPA 3.91) and B.Sc. (Nizam College, GPA 8.22).', vector: null },
        { id: 8, tags: ['contact','email','location','visa','work','status','opt','h1b'], answer: 'Contact: Email chaitanyadasari09@outlook.com · Location Eden Prairie, MN · Work Status: F-1 STEM OPT (through Feb 2028), H-1B Cap Approved.', vector: null },
        { id: 9, tags: ['llm','rag','gpt','language','model','openai'], answer: 'LLM experience: Built GPT-4 + RAG assistant (50% faster research), experimented with fine-tuning/chatbot workflows, integrated Neo4j knowledge graph for contextual retrieval.', vector: null },
        { id: 10, tags: ['fraud','risk','detection','anomaly'], answer: 'Fraud/Risk: Graph community + NLP sentiment pipeline (20% precision lift), anomaly detection automation at Charles Schwab, risk modeling for trading & healthcare cost prediction.', vector: null },
        { id: 11, tags: ['tools','mlops','deployment','monitoring','ci','cd'], answer: 'MLOps/Tools: CI/CD, model deployment & monitoring, ETL pipelines, Databricks optimization, Vertex AI orchestration, model performance tracking.', vector: null }
    ];

    // --- Vector / Embedding Scaffolding (client-only, placeholder for real embeddings later) ---
    function tokenize(text){
        return text.toLowerCase().split(/[^a-z0-9%]+/).filter(w => w && w.length > 2 && !stopWords.has(w));
    }
    const stopWords = new Set(['the','and','for','with','that','this','was','are','one','two','from','into','plus','about','into','your','you','yet','not','sure','ask','built','model','data']);
    function buildVocabulary(items){
        const freq = new Map();
        items.forEach(it => {
            const all = it.tags.join(' ') + ' ' + it.answer;
            tokenize(all).forEach(t => freq.set(t, (freq.get(t)||0)+1));
        });
        // keep words that appear at least once (could raise threshold later)
        return Array.from(freq.keys()).sort();
    }
    function vectorize(tokens, vocab){
        const vec = new Array(vocab.length).fill(0);
        tokens.forEach(t => { const idx = vocab.indexOf(t); if (idx !== -1) vec[idx] += 1; });
        // l2 normalize
        let norm = Math.sqrt(vec.reduce((s,v)=>s+v*v,0)) || 1;
        for (let i=0;i<vec.length;i++) vec[i] = vec[i]/norm;
        return vec;
    }
    function cosine(a,b){
        let s=0; for (let i=0;i<a.length;i++) s += a[i]*b[i];
        return s; // already normalized
    }
    const vocab = buildVocabulary(kb);
    kb.forEach(item => {
        const baseText = item.tags.join(' ') + ' ' + item.answer;
        const toks = tokenize(baseText);
        item.vector = vectorize(toks, vocab);
        // term frequency map for lexical scoring
        const tf = new Map();
        toks.forEach(t => tf.set(t, (tf.get(t)||0)+1));
        item._tf = tf;
    });

    // Build document frequency & idf
    const df = new Map();
    kb.forEach(item => {
        const seen = new Set(item._tf.keys());
        seen.forEach(term => df.set(term, (df.get(term)||0)+1));
    });
    const N_DOCS = kb.length;
    const idf = new Map();
    df.forEach((count, term) => {
        // add 0.5 smoothing
        idf.set(term, Math.log((N_DOCS - count + 0.5)/(count + 0.5) + 1));
    });

    function addMessage(text, sender='bot') {
        if (!messagesEl) return;
        const div = document.createElement('div');
        div.className = `chat-msg ${sender}`;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return div;
    }

    // Streaming simulation: reveal answer text gradually
    function streamAnswer(fullText){
        const div = addMessage('', 'bot');
        if (!div) return;
        const tokens = fullText.split(/(\s+)/); // keep spacing tokens
        let i = 0;
        function step(){
            if (i >= tokens.length) return;
            div.textContent += tokens[i];
            i++;
            messagesEl.scrollTop = messagesEl.scrollHeight;
            const delay = 15 + Math.min(120, tokens[i-1].length * 2);
            setTimeout(step, delay);
        }
        step();
    }

    // Highlight matched tags in a final message (after streaming)
    function highlightTerms(container, tags){
        if (!container) return;
        const text = container.textContent;
        const uniq = Array.from(new Set(tags.filter(t=>t.length>3))).slice(0,8);
        const pattern = new RegExp('\\b(' + uniq.map(t=>t.replace(/[-/\\^$*+?.()|[\]{}]/g,'\\$&')).join('|') + ')\\b','gi');
        const html = text.replace(pattern, m=>`<span class="chat-highlight">${m}</span>`);
        container.innerHTML = html;
    }

    function renderSuggestions(topItems){
        if (!messagesEl || !topItems.length) return;
        const wrap = document.createElement('div');
        wrap.className = 'chat-suggestions';
        topItems.slice(0,3).forEach(obj => {
            const tag = obj.item.tags[0];
            if (!tag) return;
            const btn = document.createElement('button');
            btn.type='button';
            btn.className='chat-suggestion';
            btn.textContent = tag;
            btn.addEventListener('click', () => {
                input.value = tag;
                form.dispatchEvent(new Event('submit'));
            });
            wrap.appendChild(btn);
        });
        messagesEl.appendChild(wrap);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function normalize(str){ return str.toLowerCase(); }

    function answerQuery(rawQ) {
        // Pronoun resolution using last best hit
        function augment(q){
            if (/^(it|that|this|they|those|he|she|these)\b/i.test(q) && chatState.lastBestId){
                const ref = kb.find(k=>k.id===chatState.lastBestId);
                if (ref){
                    return ref.tags.slice(0,3).join(' ') + ' ' + q;
                }
            }
            return q;
        }
        const q = rawQ.trim();
        const augmented = augment(q);
        const nq = normalize(augmented);
        const words = nq.split(/[^a-z0-9%]+/).filter(Boolean);
        const qTokens = tokenize(nq);
        const qVector = vectorize(qTokens, vocab);
        const scored = [];

        // BM25 parameters
        const k1 = 1.2, b = 0.75;
        const avgdl = kb.reduce((s,it)=> s + it._tf.size, 0)/kb.length;
        function bm25(item){
            let score = 0; const dl = item._tf.size;
            qTokens.forEach(t => {
                if (!item._tf.has(t)) return;
                const freq = item._tf.get(t);
                const termIdf = idf.get(t) || 0;
                score += termIdf * (freq * (k1 + 1)) / (freq + k1 * (1 - b + b * (dl/avgdl)));
            });
            return score;
        }

        function heuristicScore(item){
            let score = 0;
            item.tags.forEach(t => { if (nq.includes(t)) score += 3; });
            words.forEach(w => {
                if (item.tags.includes(w)) score += 2;
                else if (item.answer.toLowerCase().includes(w)) score += 1;
                else if (w.length > 4) {
                    const partial = item.tags.find(t => t.startsWith(w.slice(0,4)));
                    if (partial) score += 1;
                }
            });
            return score;
        }

        const maxHeuristic = Math.max(10, words.length * 6 + 15);
        kb.forEach(item => {
            const h = heuristicScore(item) / maxHeuristic;
            const c = cosine(item.vector, qVector);
            const bscore = bm25(item);
            scored.push({ item, h, c, b: bscore });
        });
        const maxB = scored.reduce((m,s)=> s.b>m?s.b:m, 0) || 1;
        scored.forEach(s => { s.bn = s.b / maxB; });
        const weights = window.ChatAssistant.weights || { heuristic: 0.4, cosine: 0.35, bm25: 0.25 };
        scored.forEach(s => { s.combined = weights.heuristic * s.h + weights.cosine * s.c + weights.bm25 * s.bn; });
        scored.sort((a,b)=> b.combined - a.combined);

        const best = scored[0];
        let answerText = '';
        let confidence = best ? best.combined : 0;
        let usedMulti = false;

        if (best && confidence >= 0.22){
            // consider 2nd result if reasonably close and above softer floor
            const second = scored[1];
            if (second && second.combined >= 0.18 && second.combined >= best.combined * 0.78){
                if (second.item.id !== best.item.id){
                    usedMulti = true;
                    answerText = best.item.answer + ' \n\nAlso: ' + second.item.answer;
                }
            }
            if (!answerText) answerText = best.item.answer;
            chatState.lastBestId = best.item.id;
            return { text: answerText, confidence, usedMulti, debugScores: scored.slice(0,3) };
        }

        // targeted heuristic fallbacks
        if (/experience|work|role/.test(nq)) return { text: 'Ask about specific roles: Piper Sandler, CVS Aetna, Charles Schwab, Twilight.', confidence, usedMulti, debugScores: scored.slice(0,3) };
        if (/project|portfolio/.test(nq)) return { text: 'Project: ChatGPT NLP Analyzer (OpenAI API, Streamlit, NLP).', confidence, usedMulti, debugScores: scored.slice(0,3) };
        if (/skill|tech|stack|tool/.test(nq)) return { text: kb.find(k=>k.tags.includes('skills')).answer, confidence, usedMulti, debugScores: scored.slice(0,3) };
        if (/education|degree/.test(nq)) return { text: kb.find(k=>k.tags.includes('education')).answer, confidence, usedMulti, debugScores: scored.slice(0,3) };

        // dynamic fallback suggestions based on top tags
        const suggest = scored.slice(0,3).map(s=>s.item.tags[0]).filter(Boolean);
        const suggestionLine = suggest.length ? ' Try asking about: ' + suggest.join(', ') + '.' : '';
        return { text: 'Not sure yet.' + suggestionLine, confidence, usedMulti, debugScores: scored.slice(0,3) };
    }

    function openChat(){ if (!panel) return; panel.classList.add('active'); panel.setAttribute('aria-hidden','false'); if (input) input.focus(); }
    function closeChat(){ if (!panel) return; panel.classList.remove('active'); panel.setAttribute('aria-hidden','true'); }
    function openChatAccessible(){ lastFocusBeforeOpen = document.activeElement; openChat(); }
    function closeChatAccessible(){ closeChat(); if (lastFocusBeforeOpen && typeof lastFocusBeforeOpen.focus==='function') lastFocusBeforeOpen.focus(); else if (launcher) launcher.focus(); }

    if (launcher) launcher.addEventListener('click', () => { const isOpen = panel.classList.contains('active'); if (isOpen) closeChatAccessible(); else { openChatAccessible(); if (!messagesEl.dataset.boot){ addMessage('Hi! Ask me about Chaitanya\'s experience, skills, LLM work, or education.'); messagesEl.dataset.boot='1'; } } });
    if (closeBtn) closeBtn.addEventListener('click', closeChatAccessible);
    // Utilities for export and summarization
    function exportTranscript(){
        const transcript = Array.from(messagesEl.querySelectorAll('.chat-msg')).map(m=>({sender: m.classList.contains('user')?'user':'bot', text: m.textContent}));
        const payload = { transcript, lastBestId: chatState.lastBestId, ts: Date.now() };
        const blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a'); a.href=url; a.download='chat_transcript.json'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url), 2000);
    }
    function maybeSummarize(){
        const USER_THRESHOLD = 12;
        if (chatState.history.length < USER_THRESHOLD) return;
        const tagCounts = new Map();
        (chatState.lastDebugScores||[]).forEach(s => s.item.tags.slice(0,3).forEach(t=>tagCounts.set(t,(tagCounts.get(t)||0)+1)));
        const topTags = Array.from(tagCounts.entries()).sort((a,b)=>b[1]-a[1]).slice(0,6).map(e=>e[0]);
        const summary = 'Summary so far: ' + (topTags.length? topTags.join(', '):'multiple topics') + '. Context compressed.';
        chatState.history = chatState.history.slice(-6);
        addMessage(summary, 'bot');
        saveState();
    }
    // Embedding override hook
    window.ChatAssistant = window.ChatAssistant || {};
    window.ChatAssistant.injectEmbeddings = function(map){
        kb.forEach(item => { if (map[item.id]) item.vector = map[item.id]; });
    };
    window.ChatAssistant.export = exportTranscript;
    window.ChatAssistant.weights = { heuristic: 0.4, cosine: 0.35, bm25: 0.25 };
    window.ChatAssistant.setConfig = function(cfg){
        if (cfg && cfg.weights){
            const w = cfg.weights;
            ['heuristic','cosine','bm25'].forEach(k => { if (typeof w[k] === 'number') window.ChatAssistant.weights[k] = w[k]; });
            const sum = Object.values(window.ChatAssistant.weights).reduce((a,b)=>a+b,0) || 1;
            // normalize to sum ~1
            Object.keys(window.ChatAssistant.weights).forEach(k => window.ChatAssistant.weights[k] = +(window.ChatAssistant.weights[k]/sum).toFixed(3));
        }
    };

    // External embeddings loader (optional)
    async function loadExternalEmbeddings(){
        try {
            const res = await fetch('assets/data/embeddings.json', { cache: 'no-store' });
            if (!res.ok) return; // silent fallback
            const data = await res.json(); // expected: { dimension: N, vectors: { "1": [...], ... } }
            if (!data || !data.vectors) return;
            const sample = Object.values(data.vectors)[0];
            if (!Array.isArray(sample)) return;
            const dim = data.dimension || sample.length;
            // Ensure dimension matches existing vector length; if mismatch skip
            if (kb[0] && Array.isArray(kb[0].vector) && kb[0].vector.length !== dim) {
                console.warn('[ChatAssistant] Embedding dimension mismatch; skipping external embeddings');
                return;
            }
            const injected = {};
            Object.keys(data.vectors).forEach(id => {
                const vec = data.vectors[id];
                if (Array.isArray(vec) && vec.length === dim) {
                    injected[Number(id)] = vec;
                }
            });
            if (Object.keys(injected).length) {
                window.ChatAssistant.injectEmbeddings(injected);
                console.log('[ChatAssistant] External embeddings loaded for', Object.keys(injected).length, 'items.');
            }
        } catch(e) {
            // silent fail
        }
    }
    loadExternalEmbeddings();

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const q = input.value.trim();
            if (!q) return;
            if (q === '/debug') { chatState.debug = !chatState.debug; addMessage('Debug mode ' + (chatState.debug?'enabled':'disabled') + '.', 'bot'); input.value=''; return; }
            if (q === '/reset') { chatState.history=[]; chatState.lastBestId=null; saveState(); addMessage('Chat context cleared.', 'bot'); input.value=''; return; }
            if (q === '/export') { exportTranscript(); input.value=''; return; }
            if (q === '/why') {
                if (!chatState.lastDebugScores){ addMessage('No prior answer context available.', 'bot'); input.value=''; return; }
                const explain = chatState.lastDebugScores.map(s=>`#${s.item.id} h=${s.h.toFixed(2)} c=${s.c.toFixed(2)} b=${(s.bn||0).toFixed(2)} total=${s.combined.toFixed(2)}`).join(' | ');
                addMessage('Scoring: ' + explain, 'bot'); input.value=''; return; }
            if (q === '/stats') { const w = window.ChatAssistant.weights || {heuristic:0.4,cosine:0.35,bm25:0.25}; addMessage(`Weights h:${w.heuristic} c:${w.cosine} b:${w.bm25} vocab:${vocab.length} docs:${kb.length}`, 'bot'); input.value=''; return; }
            addMessage(q, 'user');
            chatState.history.push(q); if (chatState.history.length > chatState.maxHistory) chatState.history.shift(); saveState(); input.value='';
            const typing = document.createElement('div'); typing.className='chat-typing'; typing.textContent='Thinking...'; messagesEl.appendChild(typing); messagesEl.scrollTop = messagesEl.scrollHeight;
            setTimeout(()=>{
                typing.remove();
                const ans = answerQuery(q);
                const preMsgCount = messagesEl.children.length;
                streamAnswer(ans.text);
                const estTime = Math.min(2000, ans.text.length * 6);
                setTimeout(()=>{ const newMsg = messagesEl.children[preMsgCount]; if (newMsg) highlightTerms(newMsg, (ans.debugScores||[]).flatMap(s=>s.item.tags)); }, estTime);
                if (chatState.debug && ans.debugScores){
                    const dbg = ans.debugScores.map(s=>`#${s.item.id} h:${s.h.toFixed(2)} c:${s.c.toFixed(2)} b:${(s.bn||0).toFixed(2)} total:${s.combined.toFixed(2)}`).join(' | ');
                    addMessage('[debug] ' + dbg, 'bot');
                }
                if (ans.debugScores){ chatState.lastDebugScores = ans.debugScores; renderSuggestions(ans.debugScores); }
                chatState.lastBestId && saveState();
                maybeSummarize();
            }, 450);
        });
    }

    // Close on ESC
    document.addEventListener('keydown', (e)=>{ if (e.key==='Escape' && panel.classList.contains('active')) closeChatAccessible(); });

    // Chip keyboard navigation
    messagesEl.addEventListener('keydown', (e)=>{
        if (!e.target.classList.contains('chat-suggestion')) return;
        const chips = Array.from(messagesEl.querySelectorAll('.chat-suggestion'));
        const idx = chips.indexOf(e.target);
        if (e.key==='ArrowRight'){ e.preventDefault(); chips[(idx+1)%chips.length].focus(); }
        else if (e.key==='ArrowLeft'){ e.preventDefault(); chips[(idx-1+chips.length)%chips.length].focus(); }
        else if (e.key==='Enter'){ e.preventDefault(); e.target.click(); }
        else if (e.key==='Escape'){ input.focus(); }
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Active Navigation Highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= (sectionTop - sectionHeight/3)) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});
