// script.js

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // THEME TOGGLE FUNCTIONALITY
    // ============================================
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;

    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    htmlElement.setAttribute('data-theme', savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);

            // Update cursor colors for light theme
            updateCursorForTheme(newTheme);
        });
    }

    function updateCursorForTheme(theme) {
        const cursorOrb = document.querySelector('.cursor-orb');
        const cursorCore = document.querySelector('.cursor-core');

        if (theme === 'light') {
            if (cursorOrb) {
                cursorOrb.style.background = 'radial-gradient(circle at center, rgba(102,126,234,0.4) 0%, rgba(102,126,234,0.2) 30%, rgba(102,126,234,0.1) 50%, transparent 70%)';
            }
            if (cursorCore) {
                cursorCore.style.background = 'radial-gradient(circle at center, #1a1a2e 0%, #667eea 40%, #764ba2 100%)';
                cursorCore.style.boxShadow = '0 0 10px #667eea, 0 0 20px #667eea, 0 0 30px #764ba2, 0 0 40px rgba(102,126,234,0.5)';
            }
        } else {
            if (cursorOrb) {
                cursorOrb.style.background = 'radial-gradient(circle at center, rgba(0, 255, 255, 0.4) 0%, rgba(0, 255, 255, 0.2) 30%, rgba(0, 255, 255, 0.1) 50%, transparent 70%)';
            }
            if (cursorCore) {
                cursorCore.style.background = 'radial-gradient(circle at center, #ffffff 0%, #00ffff 40%, #00cccc 100%)';
                cursorCore.style.boxShadow = '0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00cccc, 0 0 40px rgba(0, 255, 255, 0.5)';
            }
        }
    }

    // Initialize cursor colors based on current theme
    updateCursorForTheme(savedTheme);

    // ============================================
    // CUSTOM CURSOR
    // ============================================
    const cursorOrb = document.querySelector('.cursor-orb');
    const cursorCore = document.querySelector('.cursor-core');

    // Create trail container
    const trailContainer = document.createElement('div');
    trailContainer.className = 'cursor-trail-container';
    document.body.appendChild(trailContainer);

    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;

    if (!isTouchDevice && cursorOrb && cursorCore) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let orbX = mouseX;
        let orbY = mouseY;
        let coreX = mouseX;
        let coreY = mouseY;

        // Trail history for smooth trail effect
        const trailHistory = [];
        const maxTrailLength = 20;
        const trailDots = [];

        // Initialize trail dots
        for (let i = 0; i < maxTrailLength; i++) {
            const dot = document.createElement('div');
            dot.className = 'trail-dot';
            const size = 8 - (i * 0.3);
            dot.style.width = `${Math.max(2, size)}px`;
            dot.style.height = `${Math.max(2, size)}px`;
            dot.style.background = `radial-gradient(circle, 
                rgba(0, 255, 255, ${0.6 - (i * 0.03)}) 0%, 
                rgba(0, 200, 200, ${0.4 - (i * 0.02)}) 50%,
                transparent 100%)`;
            dot.style.boxShadow = `0 0 ${10 - i * 0.4}px rgba(0, 255, 255, ${0.5 - i * 0.025})`;
            trailContainer.appendChild(dot);
            trailDots.push(dot);
        }

        // Track mouse
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Add to trail history
            trailHistory.unshift({ x: mouseX, y: mouseY });
            if (trailHistory.length > maxTrailLength) {
                trailHistory.pop();
            }
        });

        // Animation loop
        let lastTime = 0;
        function animate(currentTime) {
            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            // Smooth follow for orb (slower)
            orbX += (mouseX - orbX) * 0.08;
            orbY += (mouseY - orbY) * 0.08;

            // Smoother follow for core (faster)
            coreX += (mouseX - coreX) * 0.15;
            coreY += (mouseY - coreY) * 0.15;

            // Update positions
            cursorOrb.style.left = `${orbX}px`;
            cursorOrb.style.top = `${orbY}px`;

            cursorCore.style.left = `${coreX}px`;
            cursorCore.style.top = `${coreY}px`;

            // Update trail dots with smooth interpolation
            trailDots.forEach((dot, index) => {
                const historyIndex = Math.min(index, trailHistory.length - 1);
                if (trailHistory[historyIndex]) {
                    const targetX = trailHistory[historyIndex].x;
                    const targetY = trailHistory[historyIndex].y;

                    // Get current position or initialize
                    let currentX = parseFloat(dot.style.left) || targetX;
                    let currentY = parseFloat(dot.style.top) || targetY;

                    // Smooth interpolation
                    currentX += (targetX - currentX) * 0.3;
                    currentY += (targetY - currentY) * 0.3;

                    dot.style.left = `${currentX}px`;
                    dot.style.top = `${currentY}px`;
                }
            });

            requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);

        // Hover effects
        const interactiveElements = document.querySelectorAll(
            'a, button, .btn, .nav-link, .project-card, .skill-category, ' +
            '.contact-method, .info-card, .tilt-card, input, textarea, select, ' +
            '.hamburger-menu, .overlay-link, .btn-hire-me, .mobile-nav-link, .social-icon'
        );

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursorOrb.classList.add('hover');
                cursorCore.classList.add('hover');
            });

            el.addEventListener('mouseleave', () => {
                cursorOrb.classList.remove('hover');
                cursorCore.classList.remove('hover');
            });
        });

        // Click effects
        document.addEventListener('mousedown', () => {
            cursorOrb.classList.add('click');
            cursorCore.classList.add('click');

            // Create burst effect
            createBurst(mouseX, mouseY);
        });

        document.addEventListener('mouseup', () => {
            cursorOrb.classList.remove('click');
            cursorCore.classList.remove('click');
        });

        // Burst effect on click
        function createBurst(x, y) {
            for (let i = 0; i < 8; i++) {
                const burst = document.createElement('div');
                const angle = (i / 8) * Math.PI * 2;
                const velocity = 50 + Math.random() * 50;

                burst.style.cssText = `
                    position: fixed;
                    left: ${x}px;
                    top: ${y}px;
                    width: 4px;
                    height: 4px;
                    background: #00ffff;
                    border-radius: 50%;
                    pointer-events: none;
                    z-index: 99997;
                    box-shadow: 0 0 10px #00ffff;
                `;
                document.body.appendChild(burst);

                let posX = x;
                let posY = y;
                let opacity = 1;
                let scale = 1;

                const animateBurst = () => {
                    posX += Math.cos(angle) * velocity * 0.1;
                    posY += Math.sin(angle) * velocity * 0.1;
                    opacity -= 0.05;
                    scale += 0.1;

                    burst.style.left = `${posX}px`;
                    burst.style.top = `${posY}px`;
                    burst.style.opacity = opacity;
                    burst.style.transform = `translate(-50%, -50%) scale(${scale})`;

                    if (opacity > 0) {
                        requestAnimationFrame(animateBurst);
                    } else {
                        burst.remove();
                    }
                };
                requestAnimationFrame(animateBurst);
            }
        }

        // Add glow effect on rapid movement
        let lastMouseX = mouseX;
        let lastMouseY = mouseY;

        setInterval(() => {
            const speed = Math.hypot(mouseX - lastMouseX, mouseY - lastMouseY);

            if (speed > 100) {
                // Intensify glow briefly
                cursorOrb.style.filter = 'blur(1px) brightness(1.3)';
                setTimeout(() => {
                    cursorOrb.style.filter = 'blur(2px)';
                }, 100);
            }

            lastMouseX = mouseX;
            lastMouseY = mouseY;
        }, 50);
    }

    // ============================================
    // ENHANCED NAVBAR FUNCTIONALITY
    // ============================================
    const hamburger = document.getElementById('hamburgerMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const body = document.body;

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function () {
            hamburger.classList.toggle('active');
            mobileMenuOverlay.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (mobileMenuOverlay.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
    }

    // Close menu with close button
    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', function () {
            hamburger.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
        });
    }

    // Close menu when clicking on a link
    mobileNavLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
        });
    });

    // Close menu when clicking outside
    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', function (e) {
            if (e.target === mobileMenuOverlay) {
                hamburger.classList.remove('active');
                mobileMenuOverlay.classList.remove('active');
                body.style.overflow = '';
            }
        });
    }

    // Close menu with Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenuOverlay.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenuOverlay.classList.remove('active');
            body.style.overflow = '';
        }
    });

    // Navbar scroll effect
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', function () {
            const currentScroll = window.scrollY;
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';

            if (currentScroll > 100) {
                if (currentTheme === 'light') {
                    navbar.style.background = 'rgba(255, 255, 255, 0.98)';
                    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
                } else {
                    navbar.style.background = 'rgba(10, 10, 20, 0.95)';
                    navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
                }
            } else {
                if (currentTheme === 'light') {
                    navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                } else {
                    navbar.style.background = 'rgba(10, 10, 20, 0.9)';
                }
                navbar.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        });
    }

    // Active nav link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function () {
        const scrollY = window.scrollY;

        sections.forEach(function (section) {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 150;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(function (link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // ============================================
    // MASCOT EYE TRACKING
    // ============================================
    const mascot = document.getElementById('mascot');
    const leftPupil = document.querySelector('.left-eye .pupil');
    const rightPupil = document.querySelector('.right-eye .pupil');

    if (mascot && !isTouchDevice) {
        document.addEventListener('mousemove', (e) => {
            const mascotRect = mascot.getBoundingClientRect();
            const mascotCenterX = mascotRect.left + mascotRect.width / 2;
            const mascotCenterY = mascotRect.top + mascotRect.height / 2;

            const angle = Math.atan2(e.clientY - mascotCenterY, e.clientX - mascotCenterX);
            const distance = Math.min(3, Math.hypot(e.clientX - mascotCenterX, e.clientY - mascotCenterY) / 50);

            const x = Math.cos(angle) * distance;
            const y = Math.sin(angle) * distance;

            leftPupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
            rightPupil.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        });
    }

    // ============================================
    // INTERACTIVE BACKGROUND CANVAS
    // ============================================
    const canvas = document.getElementById('bgCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');

        let width, height;
        let particles = [];
        let mousePos = { x: 0, y: 0 };

        function resizeCanvas() {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
                this.color = Math.random() > 0.5 ? 'rgba(255, 107, 107, 0.5)' : 'rgba(78, 205, 196, 0.5)';
            }

            update() {
                // Mouse interaction
                const dx = mousePos.x - this.x;
                const dy = mousePos.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200) {
                    const force = (200 - dist) / 200;
                    this.vx -= (dx / dist) * force * 0.02;
                    this.vy -= (dy / dist) * force * 0.02;
                }

                this.x += this.vx;
                this.y += this.vy;

                // Boundary check
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                // Damping
                this.vx *= 0.99;
                this.vy *= 0.99;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }
        }

        // Create particles
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }

        // Track mouse for canvas
        document.addEventListener('mousemove', (e) => {
            mousePos.x = e.clientX;
            mousePos.y = e.clientY;
        });

        // Animation loop
        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);

            // Draw connections
            particles.forEach((p1, i) => {
                p1.update();
                p1.draw();

                particles.slice(i + 1).forEach(p2 => {
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.1 * (1 - dist / 150)})`;
                        ctx.stroke();
                    }
                });
            });

            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }



    // ============================================
    // TEXT SCRAMBLE EFFECT
    // ============================================
    class TextScramble {
        constructor(el) {
            this.el = el;
            this.chars = '!<>-_\\/[]{}—=+*^?#________';
            this.update = this.update.bind(this);
        }

        setText(newText) {
            const oldText = this.el.innerText;
            const length = Math.max(oldText.length, newText.length);
            const promise = new Promise((resolve) => this.resolve = resolve);
            this.queue = [];

            for (let i = 0; i < length; i++) {
                const from = oldText[i] || '';
                const to = newText[i] || '';
                const start = Math.floor(Math.random() * 40);
                const end = start + Math.floor(Math.random() * 40);
                this.queue.push({ from, to, start, end });
            }

            cancelAnimationFrame(this.frameRequest);
            this.frame = 0;
            this.update();
            return promise;
        }

        update() {
            let output = '';
            let complete = 0;

            for (let i = 0, n = this.queue.length; i < n; i++) {
                let { from, to, start, end, char } = this.queue[i];

                if (this.frame >= end) {
                    complete++;
                    output += to;
                } else if (this.frame >= start) {
                    if (!char || Math.random() < 0.28) {
                        char = this.randomChar();
                        this.queue[i].char = char;
                    }
                    output += `<span class="scramble-char">${char}</span>`;
                } else {
                    output += from;
                }
            }

            this.el.innerHTML = output;

            if (complete === this.queue.length) {
                this.resolve();
            } else {
                this.frameRequest = requestAnimationFrame(this.update);
                this.frame++;
            }
        }

        randomChar() {
            return this.chars[Math.floor(Math.random() * this.chars.length)];
        }
    }

    // Apply scramble to section titles on scroll
    const scrambleElements = document.querySelectorAll('.scramble-text');
    const scrambleObservers = [];

    scrambleElements.forEach(el => {
        const fx = new TextScramble(el);
        let hasAnimated = false;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !hasAnimated) {
                    hasAnimated = true;
                    fx.setText(el.getAttribute('data-text'));
                    observer.unobserve(el);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(el);
        scrambleObservers.push(observer);
    });

    // ============================================
    // HERO TITLE ANIMATION
    // ============================================
    const titleLines = document.querySelectorAll('.title-line');
    setTimeout(() => {
        titleLines.forEach((line, i) => {
            setTimeout(() => line.classList.add('animate'), i * 200);
        });
    }, 500);

    // ============================================
    // 3D TILT EFFECT
    // ============================================
    const tiltCards = document.querySelectorAll('.tilt-card');

    if (!isTouchDevice) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // ============================================
    // SKILL BARS ANIMATION
    // ============================================
    const skillItems = document.querySelectorAll('.skill-item');

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.querySelector('.skill-progress');
                const level = entry.target.getAttribute('data-level');
                progress.style.width = `${level}%`;
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => skillObserver.observe(item));

    // ============================================
    // MAGNETIC BUTTONS
    // ============================================
    const magneticBtns = document.querySelectorAll('.magnetic-btn');

    if (!isTouchDevice) {
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ============================================
    // SMOOTH SCROLL
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // CONTACT FORM
    // ============================================
    //const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showToast('Message sent! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // ============================================
    // TOAST NOTIFICATION
    // ============================================
    window.showToast = function (message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');

        if (toast && toastMessage) {
            toastMessage.textContent = message;
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    };

    // ============================================
    // LAST UPDATED
    // ============================================
    const lastUpdated = document.getElementById('lastUpdated');
    if (lastUpdated) {
        const now = new Date();
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        lastUpdated.textContent = now.toLocaleDateString('en-US', options);
    }

    // ============================================
    // SCROLL REVEAL
    // ============================================
    const revealElements = document.querySelectorAll('.project-card, .skill-category, .info-card');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(el);
    });

    // ============================================
    // PARALLAX SCROLL
    // ============================================
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const parallax = document.querySelector('.hero-visual');
                if (parallax) {
                    parallax.style.transform = `translateY(${scrolled * 0.3}px)`;
                }
                ticking = false;
            });
            ticking = true;
        }
    });

    // ============================================
    // CONTACT FORM AJAX SUBMISSION
    // ============================================
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = new FormData(this);
            const csrfToken = formData.get('csrfmiddlewaretoken');

            try {
                const response = await fetch('/contact/', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest'
                    }
                });

                const data = await response.json();

                if (data.success) {
                    showToast(data.message);
                    contactForm.reset();
                } else {
                    showToast(data.message || 'Something went wrong. Please try again.');
                }
            } catch (error) {
                // Fallback to regular form submission if fetch fails
                console.log('Fetch failed, submitting form normally');
                this.submit();
            }
        });
    }
});