document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollEffects();
    initTyped();
    initProjectFilters();
    initModals();
    initBackToTop();
    initContactForm();
});

// --- Theme Management ---
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const icon = themeToggle.querySelector('i');

    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });

    function updateThemeIcon(theme) {
        if (theme === 'light') {
            icon.classList.replace('fa-moon', 'fa-sun');
        } else {
            icon.classList.replace('fa-sun', 'fa-moon');
        }
    }
}

// --- Scroll Effects ---
function initScrollEffects() {
    const navbar = document.querySelector('.navbar');
    const scrollProgress = document.getElementById('scroll-progress');
    const reveals = document.querySelectorAll('.reveal');

    window.addEventListener('scroll', () => {
        // Navbar sticky effect
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        scrollProgress.style.width = scrolled + "%";

        // Scroll reveal
        reveals.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            const elementVisible = 150;
            if (elementTop < window.innerHeight - elementVisible) {
                el.classList.add('active');
                
                // Trigger skill bars and counters if in view
                if (el.id === 'skills' || el.classList.contains('skill-category')) {
                    const bars = el.querySelectorAll('.skill-progress');
                    const counters = el.querySelectorAll('.skill-percentage');
                    
                    bars.forEach(bar => {
                        bar.style.width = bar.getAttribute('data-percent') + '%';
                    });
                    
                    counters.forEach(counter => {
                        if (!counter.classList.contains('animated')) {
                            animateCounter(counter);
                            counter.classList.add('animated');
                        }
                    });
                }
            }
        });
    });
}

// --- Counter Animation ---
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    let count = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps

    const updateCount = () => {
        count += increment;
        if (count < target) {
            el.innerText = Math.ceil(count) + '%';
            requestAnimationFrame(updateCount);
        } else {
            el.innerText = target + '%';
        }
    };
    updateCount();
}

// --- Typed.js Implementation ---
function initTyped() {
    if (document.getElementById('typed-roles')) {
        new Typed('#typed-roles', {
            strings: ['Data Analyst', 'Aspiring Data Engineer', 'ML Enthusiast'],
            typeSpeed: 50,
            backSpeed: 30,
            loop: true,
            backDelay: 2000
        });
    }
}

// --- Project Filtering ---
function initProjectFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => card.style.display = 'none', 400);
                }
            });
        });
    });
}

// --- Modals (Certificates & Case Studies) ---
function initModals() {
    const modal = document.getElementById('globalModal');
    const modalBody = document.getElementById('modal-body-content');
    const modalTitle = document.getElementById('modal-title-text');
    const closeModal = document.getElementById('close-modal');

    window.openCert = (certUrl, title) => {
        modalTitle.innerText = title;
        
        // Add loading state
        modalBody.innerHTML = `
            <div class="modal-loader" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 300px; gap: 1.5rem;">
                <div class="spinner" style="width: 50px; height: 50px; border: 4px solid rgba(168, 85, 247, 0.1); border-top-color: var(--accent-primary); border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <p style="color: var(--text-muted); font-size: 0.9rem;">Loading Certificate...</p>
            </div>
            <iframe src="${certUrl}" id="cert-iframe" style="width:100%; height:75vh; border:none; border-radius: 12px; display: none;" onload="this.style.display='block'; document.querySelector('.modal-loader').style.display='none';"></iframe>
        `;

        // Error handling fallback
        const iframe = document.getElementById('cert-iframe');
        iframe.onerror = () => {
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #ef4444; margin-bottom: 1rem;"></i>
                    <h3>Failed to load certificate</h3>
                    <p style="color: var(--text-muted);">The certificate file might be missing or corrupted.</p>
                    <a href="${certUrl}" target="_blank" class="btn btn-secondary" style="margin-top: 1.5rem;">Open in New Tab</a>
                </div>
            `;
        };

        openModal();
    };

    window.openCaseStudy = (projectId) => {
        const caseStudies = {
            'job-fraud': {
                title: 'Fraudulent Job Post Detection',
                content: `
                    <div class="case-study-content">
                        <h3><i class="fas fa-exclamation-triangle"></i> Problem Statement</h3>
                        <p>The rise in recruitment scams led to significant data privacy risks for job seekers. Traditional rule-based filters failed to capture evolving fraudulent patterns in unstructured job descriptions.</p>
                        <h3><i class="fas fa-tools"></i> Technical Solution</h3>
                        <ul>
                            <li><strong>Pipeline:</strong> Engineered a robust NLP pipeline using TF-IDF vectorization and text preprocessing.</li>
                            <li><strong>Modeling:</strong> Evaluated multiple algorithms, selecting <strong>XGBoost</strong> for its superior handling of imbalanced datasets.</li>
                            <li><strong>Innovation:</strong> Implemented a confidence-score thresholding system to reduce false positives by 12%.</li>
                        </ul>
                        <h3><i class="fas fa-chart-line"></i> Business Impact</h3>
                        <p>Delivered <strong>93.4% precision</strong> in fraud detection, effectively protecting platform integrity and enhancing user trust across 18,000+ analyzed postings.</p>
                    </div>
                `
            },
            'dpr': {
                title: 'Dense Passage Retrieval (DPR)',
                content: `
                    <div class="case-study-content">
                        <h3><i class="fas fa-search"></i> Challenge</h3>
                        <p>Legacy keyword search systems struggled with semantic nuance, resulting in low relevance for complex, natural language queries in large-scale document repositories.</p>
                        <h3><i class="fas fa-cog"></i> Technical Implementation</h3>
                        <ul>
                            <li><strong>Architecture:</strong> Developed a bi-encoder framework using <strong>BERT</strong> to generate high-dimensional vector embeddings.</li>
                            <li><strong>Optimization:</strong> Integrated <strong>FAISS</strong> (Facebook AI Similarity Search) for sub-millisecond similarity search across millions of vectors.</li>
                            <li><strong>Tech:</strong> Leveraged PyTorch and HuggingFace Transformers for model deployment.</li>
                        </ul>
                        <h3><i class="fas fa-check-double"></i> Results</h3>
                        <p>Achieved a <strong>25% lift in retrieval accuracy</strong> compared to BM25 baselines, significantly improving the efficiency of automated Q&A systems.</p>
                    </div>
                `
            },
            'ecommerce': {
                title: 'E-Commerce Strategic Analytics',
                content: `
                    <div class="case-study-content">
                        <h3><i class="fas fa-business-time"></i> Context</h3>
                        <p>A rapidly scaling e-commerce platform required real-time visibility into sales performance and inventory health to optimize marketing spend and stock levels.</p>
                        <h3><i class="fas fa-database"></i> Data Architecture</h3>
                        <ul>
                            <li><strong>ETL:</strong> Automated data extraction from MySQL into Power BI using optimized SQL views.</li>
                            <li><strong>Modeling:</strong> Designed a Star Schema to handle 500k+ transaction records with high performance.</li>
                            <li><strong>Visualization:</strong> Built dynamic dashboards for Executive KPI tracking, Sales Forecasting, and Cohort Analysis.</li>
                        </ul>
                        <h3><i class="fas fa-rocket"></i> Impact</h3>
                        <p>Enabled the marketing team to reallocate 15% of budget toward high-performing segments, driving an estimated <strong>8% increase in month-over-month revenue</strong>.</p>
                    </div>
                `
            }
        };

        const study = caseStudies[projectId];
        if (study) {
            modalTitle.innerText = study.title;
            modalBody.innerHTML = study.content;
            openModal();
        }
    };

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        modalBody.innerHTML = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// --- Back to Top ---
function initBackToTop() {
    const btt = document.getElementById('back-to-top');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btt.classList.add('show');
        } else {
            btt.classList.remove('show');
        }
    });
    btt.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// --- Contact Form ---
function initContactForm() {
    const form = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const btn = document.getElementById('submit-btn');
    const btnText = btn?.querySelector('.btn-text');
    const btnIcon = btn?.querySelector('i');

    if (!form || !btn) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = new FormData(form);
        
        // Loading State
        btn.disabled = true;
        if (btnText) btnText.innerText = 'Sending...';
        if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';
        if (status) {
            status.style.display = 'block';
            status.style.color = 'var(--text-muted)';
            status.innerText = 'Transmitting data...';
        }

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: data,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                if (status) {
                    status.style.color = '#10b981';
                    status.innerHTML = '<i class="fas fa-check-circle"></i> Message sent successfully!';
                }
                form.reset();
                if (btnText) btnText.innerText = 'Sent!';
                if (btnIcon) btnIcon.className = 'fas fa-check';
                setTimeout(() => {
                    btn.disabled = false;
                    if (btnText) btnText.innerText = 'Send Message';
                    if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
                    if (status) status.style.display = 'none';
                }, 5000);
            } else {
                throw new Error();
            }
        } catch (error) {
            if (status) {
                status.style.color = '#ef4444';
                status.innerHTML = '<i class="fas fa-exclamation-circle"></i> Submission failed.';
            }
            btn.disabled = false;
            if (btnText) btnText.innerText = 'Send Message';
            if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
        }
    });
}

function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed; bottom: 2rem; right: 2rem;
        background: var(--accent-gradient); color: white;
        padding: 1rem 2rem; border-radius: 12px;
        z-index: 100000; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        animation: slideIn 0.5s forwards;
    `;
    toast.innerText = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.5s forwards';
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
