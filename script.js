/* ============================================
   PORTFOLIO — INTERACTIVITY & ANIMATIONS
   ============================================ */

(function () {
    'use strict';

    // Initialize Lucide icons
    lucide.createIcons();

    // ==========================================
    // CMS INTEGRATION (SUPABASE)
    // ==========================================

    const CMSIntegration = {
        isConnected: false,

        async init() {
            try {
                this.isConnected = await SupabaseAPI.checkConnection();

                if (this.isConnected) {
                    console.log('✓ Supabase connected successfully');
                    await this.loadAllContent();
                } else {
                    console.log('⚠ Supabase not available, using fallback content');
                    this.loadFallbackContent();
                }
            } catch (error) {
                console.warn('CMS initialization error:', error);
                this.loadFallbackContent();
            }

            // Hide loading overlay
            const loadingOverlay = document.getElementById('loading-overlay');
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
        },

        async loadAllContent() {
            await Promise.all([
                this.loadProjects(),
                this.loadTestimonials()
            ]);
        },

        async loadProjects() {
            const wrapper = document.getElementById('projects-swiper-wrapper');
            if (!wrapper) return;

            try {
                const response = await SupabaseAPI.getProjects();
                const projects = response.data || [];

                if (projects.length > 0) {
                    wrapper.innerHTML = projects.map(project => this.createProjectSlide(project)).join('');
                } else {
                    this.loadFallbackProjects();
                }
            } catch (error) {
                console.warn('Failed to load projects:', error);
                this.loadFallbackProjects();
            }

            this.initSwiper();
            lucide.createIcons();
        },

        createProjectSlide(project) {
            const imageUrl = project.thumbnail_url || '';

            return `
                <div class="swiper-slide">
                    <div class="project-card">
                        <div class="project-card__image" ${imageUrl ? `style="background-image: url('${imageUrl}')"` : ''}>
                            <span class="project-card__overlay-text">View Project</span>
                        </div>
                        <div class="project-card__info">
                            <h3 class="project-card__title">${project.title || 'Untitled Project'}</h3>
                            <span class="project-card__tag">${project.category || 'Webflow'} ${project.client ? '· ' + project.client : ''}</span>
                        </div>
                    </div>
                </div>
            `;
        },

        async loadTestimonials() {
            const track = document.getElementById('testimonials-track');
            if (!track) return;

            try {
                const response = await SupabaseAPI.getTestimonials();
                const testimonials = response.data || [];

                if (testimonials.length > 0) {
                    const firstPass = testimonials.map(t => this.createTestimonialCard(t)).join('');
                    const secondPass = testimonials.map(t => this.createTestimonialCard(t)).join('');
                    track.innerHTML = firstPass + secondPass;
                } else {
                    this.loadFallbackTestimonials();
                }
            } catch (error) {
                console.warn('Failed to load testimonials:', error);
                this.loadFallbackTestimonials();
            }
        },

        createTestimonialCard(testimonial) {
            return `
                <div class="testimonial-card">
                    <p class="testimonial-card__text">"${testimonial.quote || 'Great experience working together.'}"</p>
                    <div class="testimonial-card__author">
                        <span class="testimonial-card__name">${testimonial.name || 'Anonymous'}</span>
                        <span class="testimonial-card__role">${testimonial.role || ''}${testimonial.company ? ', ' + testimonial.company : ''}</span>
                    </div>
                </div>
            `;
        },

        loadFallbackProjects() {
            const wrapper = document.getElementById('projects-swiper-wrapper');
            if (!wrapper) return;

            wrapper.innerHTML = `
                <div class="swiper-slide">
                    <div class="project-card">
                        <div class="project-card__image" id="project-img-1">
                            <span class="project-card__overlay-text">View Project</span>
                        </div>
                        <div class="project-card__info">
                            <h3 class="project-card__title">Nexus Finance</h3>
                            <span class="project-card__tag">Fintech · Webflow</span>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="project-card">
                        <div class="project-card__image" id="project-img-2">
                            <span class="project-card__overlay-text">View Project</span>
                        </div>
                        <div class="project-card__info">
                            <h3 class="project-card__title">Solara Health</h3>
                            <span class="project-card__tag">Healthcare · CMS</span>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="project-card">
                        <div class="project-card__image" id="project-img-3">
                            <span class="project-card__overlay-text">View Project</span>
                        </div>
                        <div class="project-card__info">
                            <h3 class="project-card__title">Vertex Studio</h3>
                            <span class="project-card__tag">Creative Agency · Animations</span>
                        </div>
                    </div>
                </div>
                <div class="swiper-slide">
                    <div class="project-card">
                        <div class="project-card__image" id="project-img-4">
                            <span class="project-card__overlay-text">View Project</span>
                        </div>
                        <div class="project-card__info">
                            <h3 class="project-card__title">Echo Commerce</h3>
                            <span class="project-card__tag">E-commerce · Webflow</span>
                        </div>
                    </div>
                </div>
            `;
        },

        loadFallbackTestimonials() {
            const track = document.getElementById('testimonials-track');
            if (!track) return;

            const testimonials = [
                { name: 'Sarah Chen', role: 'CEO', company: 'Nexus Finance', quote: 'Alex transformed our outdated site into a conversion machine. The animations alone increased our engagement by 40%.' },
                { name: 'Marcus Webb', role: 'Founder', company: 'Vertex Studio', quote: 'Best Webflow developer I\'ve worked with. Fast, detail-oriented, and the final product always exceeds expectations.' },
                { name: 'Dr. Lisa Park', role: 'Director', company: 'Solara Health', quote: 'The CMS structure Alex built lets our team update content effortlessly. It\'s exactly what we needed to scale.' },
                { name: 'James Okafor', role: 'Co-founder', company: 'Echo Commerce', quote: 'Working with Alex felt like having a creative partner, not just a developer. Highly recommend.' }
            ];

            const firstPass = testimonials.map(t => `
                <div class="testimonial-card">
                    <p class="testimonial-card__text">"${t.quote}"</p>
                    <div class="testimonial-card__author">
                        <span class="testimonial-card__name">${t.name}</span>
                        <span class="testimonial-card__role">${t.role}, ${t.company}</span>
                    </div>
                </div>
            `).join('');

            track.innerHTML = firstPass + firstPass;
        },

        loadFallbackContent() {
            this.loadFallbackProjects();
            this.loadFallbackTestimonials();
            this.initSwiper();
            lucide.createIcons();
        },

        initSwiper() {
            // Destroy existing Swiper if any
            const existingSwiper = document.querySelector('.swiper.swiper-initialized');
            if (existingSwiper && existingSwiper.swiper) {
                existingSwiper.swiper.destroy(true, true);
            }

            const projectsSwiper = new Swiper('#projects-swiper', {
                slidesPerView: 1.2,
                spaceBetween: 20,
                speed: 600,
                grabCursor: true,
                pagination: {
                    el: '#swiper-pagination',
                    clickable: true,
                },
                navigation: {
                    prevEl: '#swiper-prev',
                    nextEl: '#swiper-next',
                },
                breakpoints: {
                    640: {
                        slidesPerView: 2,
                        spaceBetween: 20,
                    },
                    1024: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                    },
                },
            });

            return projectsSwiper;
        },

        showFormStatus(message, type) {
            const status = document.getElementById('form-status');
            if (!status) return;

            status.textContent = message;
            status.className = 'form-status visible ' + type;

            setTimeout(() => {
                status.classList.remove('visible');
            }, 5000);
        }
    };

    // Initialize CMS
    CMSIntegration.init();

    // ==========================================
    // LENIS SMOOTH SCROLL
    // ==========================================
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // ==========================================
    // CUSTOM CURSOR
    // ==========================================
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        // Cursor — slight lag
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';

        // Follower — more lag
        followerX += (mouseX - followerX) * 0.08;
        followerY += (mouseY - followerY) * 0.08;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Cursor hover effect on interactive elements
    const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, select, .service-card, .project-card'
    );

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
            follower.classList.add('hover');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
            follower.classList.remove('hover');
        });
    });

    // ==========================================
    // MAGNETIC BUTTONS
    // ==========================================
    const magneticElements = document.querySelectorAll('.magnetic');

    magneticElements.forEach(el => {
        const strength = parseInt(el.dataset.strength) || 20;

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x / strength * 4}px, ${y / strength * 4}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
            el.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        });

        el.addEventListener('mouseenter', () => {
            el.style.transition = 'none';
        });
    });

    // ==========================================
    // NAVBAR — HIDE ON SCROLL DOWN, SHOW ON UP
    // ==========================================
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 100) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }

        if (currentScroll > lastScroll && currentScroll > 200) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }

        lastScroll = currentScroll;
    }, { passive: true });

    // ==========================================
    // MOBILE MENU
    // ==========================================
    const burger = document.getElementById('nav-burger');
    const mobileMenu = document.getElementById('mobile-menu');

    burger.addEventListener('click', () => {
        burger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            burger.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // ==========================================
    // SCROLL REVEAL — INTERSECTION OBSERVER
    // ==========================================
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // Hero lines — clip reveal
    const heroLines = document.querySelectorAll('.hero__line');
    heroLines.forEach((line, i) => {
        setTimeout(() => {
            line.classList.add('visible');
        }, 300 + i * 200);
    });

    // ==========================================
    // COUNTER ANIMATION — STATS
    // ==========================================
    const statNumbers = document.querySelectorAll('.about__stat-number[data-target]');

    function animateCounter(el) {
        const target = parseInt(el.dataset.target);
        const suffix = el.dataset.suffix || '';
        const duration = 2000;
        const startTime = performance.now();

        function easeOutQuart(t) {
            return 1 - Math.pow(1 - t, 4);
        }

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeOutQuart(progress);
            const currentValue = Math.round(easedProgress * target);

            el.textContent = currentValue + suffix;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5
    });

    statNumbers.forEach(el => counterObserver.observe(el));

    // ==========================================
    // SWIPER — PROJECTS CAROUSEL
    // ==========================================
    // Note: Now initialized by CMSIntegration after content loads

    // ==========================================
    // SMOOTH SCROLL FOR NAV LINKS (via Lenis)
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            e.preventDefault();
            lenis.scrollTo(targetId, { offset: 0, duration: 1.5 });
        });
    });

    // ==========================================
    // CONTACT FORM — SUPABASE SUBMISSION
    // ==========================================
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const formData = {
                name: contactForm.name.value.trim(),
                email: contactForm.email.value.trim(),
                projectType: contactForm['project-type']?.value || 'other',
                message: contactForm.message.value.trim()
            };

            // Validate form
            if (!formData.name || !formData.email || !formData.message) {
                CMSIntegration.showFormStatus('Please fill in all required fields.', 'error');
                return;
            }

            // Show loading state
            const originalHTML = btn.innerHTML;
            btn.innerHTML = '<span>Sending...</span>';
            btn.disabled = true;
            CMSIntegration.showFormStatus('Sending your message...', 'loading');

            try {
                if (CMSIntegration.isConnected) {
                    await SupabaseAPI.submitContactForm(formData);
                    CMSIntegration.showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
                } else {
                    // Fallback: simulate submission
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    CMSIntegration.showFormStatus('Message sent! (Demo mode - configure Supabase for real submissions)', 'success');
                }

                btn.innerHTML = '<span>Sent! ✓</span>';
                btn.style.background = '#22c55e';

            } catch (error) {
                console.error('Form submission error:', error);
                CMSIntegration.showFormStatus('Failed to send message. Please try again or email directly.', 'error');
                btn.innerHTML = originalHTML;
            }

            btn.disabled = false;

            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                contactForm.reset();
            }, 3000);
        });
    }

})();
