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
    const panel = document.getElementById('chatPanel');
    const closeBtn = document.getElementById('chatClose');
    const form = document.getElementById('chatForm');
    const input = document.getElementById('chatInput');
    const messagesEl = document.getElementById('chatMessages');

    // Knowledge base derived from resume/portfolio
    const kb = [
        { tags: ['piper','current','role','gpt','rag','neo4j','fraud','trading','agent'], answer: 'At Piper Sandler I deployed a GPT-4 + RAG research assistant (50% faster analyst turnaround), built a Neo4j + LLM retrieval layer, prototyped autonomous trading/risk agents (15% better backtested risk-adjusted returns), and implemented a graph+NLP fraud pipeline that improved precision by 20%.' },
        { tags: ['graduate','research','assistant','retention','university','concordia','88%','grant'], answer: 'As a Graduate Research Assistant I engineered an 88% accuracy student retention model, co-authored a successful $50K AI ethics grant, and ran large-scale NLP sentiment analysis for strategic dashboards.' },
        { tags: ['cvs','aetna','healthcare','infosys','segmentation','vertex','bert','gan','risk','readmission','12%'], answer: 'For CVS Aetna I built patient segmentation (12% reduction in readmissions), cost & risk models on Vertex AI (85% accuracy), applied BERT for clinical entity extraction, and generated HIPAA-compliant synthetic data with GANs.' },
        { tags: ['schwab','charles','finance','databricks','agentic','automation','llm','fraud','pipeline','30%'], answer: 'At Charles Schwab I implemented agentic automation (ETL + anomaly detection), prototyped LLM chatbot workflows, optimized Databricks pipelines (30% faster), and applied ML for fraud & segmentation to improve client risk stratification.' },
        { tags: ['twilight','analyst','churn','forecast','pca','etl','tableau'], answer: 'At Twilight Software I delivered churn & demand forecasts, applied statistical methods + PCA, engineered ETL/warehousing for BI, and built Tableau dashboards for leadership KPIs.' },
        { tags: ['skills','stack','core','tech','technology'], answer: 'Core stack: Python, SQL, Machine Learning, LLMs (RAG), Spark, Cloud (GCP/Azure/AWS), Databricks, Neo4j. Extended: PyTorch, Scikit-learn, XGBoost, TensorFlow, LangChain, Vertex AI, SageMaker, ETL, Graph Analytics, NLP, Time Series, GANs, MLOps, Tableau, Power BI.' },
        { tags: ['education','degree','ms','master','bsc','college','university'], answer: 'Education: M.S. Data Analytics (Concordia University St. Paul, GPA 3.91) and B.Sc. (Nizam College, GPA 8.22).' },
        { tags: ['contact','email','location','visa','work','status','opt','h1b'], answer: 'Contact: Email chaitanyadasari09@outlook.com · Location Eden Prairie, MN · Work Status: F-1 STEM OPT (through Feb 2028), H-1B Cap Approved.' },
        { tags: ['llm','rag','gpt','language','model','openai'], answer: 'LLM experience: Built GPT-4 + RAG assistant (50% faster research), experimented with fine-tuning/chatbot workflows, integrated Neo4j knowledge graph for contextual retrieval.' },
        { tags: ['fraud','risk','detection','anomaly'], answer: 'Fraud/Risk: Graph community + NLP sentiment pipeline (20% precision lift), anomaly detection automation at Charles Schwab, risk modeling for trading & healthcare cost prediction.' },
        { tags: ['tools','mlops','deployment','monitoring','ci','cd'], answer: 'MLOps/Tools: CI/CD, model deployment & monitoring, ETL pipelines, Databricks optimization, Vertex AI orchestration, model performance tracking.' }
    ];

    function addMessage(text, sender='bot') {
        if (!messagesEl) return;
        const div = document.createElement('div');
        div.className = `chat-msg ${sender}`;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
    }

    function normalize(str){ return str.toLowerCase(); }

    function answerQuery(q) {
        const nq = normalize(q);
        const words = nq.split(/[^a-z0-9%]+/).filter(Boolean);
        let best = null; let bestScore = 0;

        function scoreItem(item){
            let score = 0;
            // tag matches (weighted)
            item.tags.forEach(t => { if (nq.includes(t)) score += 3; });
            // word overlap
            words.forEach(w => {
                // exact tag / substring overlap
                if (item.tags.includes(w)) score += 2;
                else if (item.answer.toLowerCase().includes(w)) score += 1;
                else if (w.length > 4) {
                    // partial (prefix) match
                    const partial = item.tags.find(t => t.startsWith(w.slice(0,4)));
                    if (partial) score += 1;
                }
            });
            return score;
        }

        kb.forEach(item => {
            const s = scoreItem(item);
            if (s > bestScore) { bestScore = s; best = item; }
        });

        const maxPossible = words.length * 6 + 15; // loose upper bound for normalization
        const confidence = bestScore / Math.max(10, maxPossible);

        if (best && confidence >= 0.18) return best.answer;

        // targeted heuristic fallbacks
        if (/experience|work|role/.test(nq)) return 'Ask about specific roles: Piper Sandler, CVS Aetna, Charles Schwab, Twilight.';
        if (/project|portfolio/.test(nq)) return 'Project: ChatGPT NLP Analyzer (OpenAI API, Streamlit, NLP).';
        if (/skill|tech|stack|tool/.test(nq)) return kb.find(k=>k.tags.includes('skills')).answer;
        if (/education|degree/.test(nq)) return kb.find(k=>k.tags.includes('education')).answer;

        return 'Not sure yet. Try: "Piper Sandler", "CVS Aetna", "LLM work", "skills", or "education".';
    }

    function openChat(){ if (!panel) return; panel.classList.add('active'); panel.setAttribute('aria-hidden','false'); if (input) input.focus(); }
    function closeChat(){ if (!panel) return; panel.classList.remove('active'); panel.setAttribute('aria-hidden','true'); }

    if (launcher) launcher.addEventListener('click', () => { const isOpen = panel.classList.contains('active'); if (isOpen) closeChat(); else { openChat(); if (!messagesEl.dataset.boot){ addMessage('Hi! Ask me about Chaitanya\'s experience, skills, LLM work, or education.'); messagesEl.dataset.boot='1'; } } });
    if (closeBtn) closeBtn.addEventListener('click', closeChat);
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const q = input.value.trim();
            if (!q) return;
            addMessage(q, 'user');
            input.value='';
            // typing indicator
            const typing = document.createElement('div');
            typing.className='chat-typing';
            typing.textContent='Thinking...';
            messagesEl.appendChild(typing); messagesEl.scrollTop = messagesEl.scrollHeight;
            setTimeout(()=>{
                typing.remove();
                const ans = answerQuery(q);
                addMessage(ans, 'bot');
            }, 450);
        });
    }

    // Close on ESC
    document.addEventListener('keydown', (e)=>{ if (e.key==='Escape' && panel.classList.contains('active')) closeChat(); });
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
