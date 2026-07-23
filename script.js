/* ==========================================================================
   INTERACTIVE PORTFOLIO — DAY 11 SCRIPT
   Vanilla JavaScript only — no frameworks/libraries
   Handles: smooth scrolling, active nav highlighting, mobile menu,
   scroll-reveal animations, animated counters & progress bars,
   ripple effect, back-to-top, form validation, toast notification.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------------ */
  /* 1. NAVBAR — sticky scroll state + mobile hamburger menu             */
  /* ------------------------------------------------------------------ */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  const handleNavbarScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  const closeMobileMenu = () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });


  /* ------------------------------------------------------------------ */
  /* 2. SMOOTH SCROLLING — for every internal anchor link                */
  /* ------------------------------------------------------------------ */
  const scrollLinks = document.querySelectorAll('.nav-link-scroll');

  /**
   * Reusable function: smoothly scrolls the page to a given element,
   * accounting for the fixed navbar height.
   */
  const scrollToElement = (targetEl) => {
    const headerHeight = navbar.offsetHeight;
    const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
    window.scrollTo({ top: targetPosition, behavior: 'smooth' });
  };

  scrollLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;

      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();
      scrollToElement(targetEl);
      closeMobileMenu();
    });
  });


  /* ------------------------------------------------------------------ */
  /* 3. ACTIVE NAV LINK HIGHLIGHTING WHILE SCROLLING                     */
  /* ------------------------------------------------------------------ */
  const sections = document.querySelectorAll('main > section[id]');
  const navItems = document.querySelectorAll('.nav-link[data-section]');

  const setActiveLink = (sectionId) => {
    navItems.forEach((item) => {
      item.classList.toggle('active', item.dataset.section === sectionId);
    });
  };

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveLink(entry.target.id);
        }
      });
    },
    { rootMargin: `-${navbar.offsetHeight + 40}px 0px -55% 0px`, threshold: 0 }
  );

  sections.forEach((section) => sectionObserver.observe(section));


  /* ------------------------------------------------------------------ */
  /* 4. SCROLL REVEAL ANIMATIONS (fade-up, fade-left, fade-right, etc.)  */
  /* ------------------------------------------------------------------ */
  const revealSelector = '.fade-in, .fade-up, .fade-left, .fade-right, .scale-in, .zoom-in';
  const revealEls = document.querySelectorAll(revealSelector);

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
  );

  revealEls.forEach((el, index) => {
    // Stagger skill cards for a cascading reveal
    if (el.classList.contains('skill-card') && !el.style.getPropertyValue('--delay')) {
      el.style.setProperty('--delay', `${(index % 8) * 0.08}s`);
    }
    revealObserver.observe(el);
  });


  /* ------------------------------------------------------------------ */
  /* 5. HERO TYPING ANIMATION                                            */
  /* ------------------------------------------------------------------ */
  const typingTextEl = document.getElementById('typingText');
  const phrases = ['Frontend Developer', 'UI/UX Enthusiast', 'Problem Solver', 'Web Development Intern'];
  let phraseIndex = 0, charIndex = 0, isDeleting = false;

  const typeLoop = () => {
    const currentPhrase = phrases[phraseIndex];
    charIndex += isDeleting ? -1 : 1;
    typingTextEl.textContent = currentPhrase.substring(0, charIndex);

    let speed = isDeleting ? 45 : 90;

    if (!isDeleting && charIndex === currentPhrase.length) {
      speed = 1400;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 400;
    }

    setTimeout(typeLoop, speed);
  };
  typeLoop();


  /* ------------------------------------------------------------------ */
  /* 6. ANIMATED HERO STAT COUNTERS                                      */
  /* ------------------------------------------------------------------ */
  /**
   * Reusable function: animates a number from 0 to a target value with
   * an ease-out curve, writing the result into the given element.
   */
  const animateCounter = (el, target, duration = 1600) => {
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const statNumbers = document.querySelectorAll('.stat-number');
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCounter(el, parseInt(el.dataset.target, 10) || 0);
          statObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.5 }
  );
  statNumbers.forEach((el) => statObserver.observe(el));


  /* ------------------------------------------------------------------ */
  /* 7. ANIMATED "ABOUT" PROGRESS BARS                                   */
  /* ------------------------------------------------------------------ */
  const miniProgressItems = document.querySelectorAll('.mini-progress');

  const progressObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const item = entry.target;
        const bar = item.querySelector('.mini-bar');
        const countEl = item.querySelector('.count');
        const target = parseInt(item.dataset.percent, 10) || 0;

        requestAnimationFrame(() => { bar.style.width = `${target}%`; });
        animateCounter(countEl, target, 1300);

        progressObserver.unobserve(item);
      });
    },
    { threshold: 0.4 }
  );

  miniProgressItems.forEach((item) => progressObserver.observe(item));


  /* ------------------------------------------------------------------ */
  /* 8. BUTTON RIPPLE EFFECT                                             */
  /* ------------------------------------------------------------------ */
  document.querySelectorAll('.ripple-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);

      ripple.classList.add('ripple');
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });


  /* ------------------------------------------------------------------ */
  /* 9. BACK TO TOP BUTTON                                               */
  /* ------------------------------------------------------------------ */
  const backToTop = document.getElementById('backToTop');
  const toggleBackToTop = () => backToTop.classList.toggle('show', window.scrollY > 480);
  toggleBackToTop();
  window.addEventListener('scroll', toggleBackToTop, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));


  /* ------------------------------------------------------------------ */
  /* 10. FOOTER YEAR                                                     */
  /* ------------------------------------------------------------------ */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();


  /* ------------------------------------------------------------------ */
  /* 11. CONTACT FORM VALIDATION                                         */
  /* ------------------------------------------------------------------ */
  const form = document.getElementById('contactForm');
  const sendBtn = document.getElementById('sendBtn');
  const toast = document.getElementById('toast');

  const fields = {
    fullName: {
      input: document.getElementById('fullName'),
      error: document.getElementById('fullNameError'),
      validate: (value) => {
        if (!value.trim()) return 'Full name is required.';
        if (value.trim().length < 3) return 'Name must be at least 3 characters.';
        return '';
      },
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (value) => {
        if (!value.trim()) return 'Email address is required.';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value.trim())) return 'Please enter a valid email address.';
        return '';
      },
    },
    subject: {
      input: document.getElementById('subject'),
      error: document.getElementById('subjectError'),
      validate: (value) => (!value.trim() ? 'Subject is required.' : ''),
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: (value) => {
        if (!value.trim()) return 'Message is required.';
        if (value.trim().length < 20) return 'Message must be at least 20 characters.';
        return '';
      },
    },
  };

  const setFieldState = (key, errorText) => {
    const { input, error } = fields[key];
    const group = input.closest('.input-group');

    if (errorText) {
      group.classList.add('has-error');
      group.classList.remove('has-success');
      error.textContent = errorText;
    } else {
      group.classList.remove('has-error');
      group.classList.add('has-success');
      error.textContent = '';
    }
  };

  const validateField = (key) => {
    const { input, validate } = fields[key];
    const errorText = validate(input.value);
    setFieldState(key, errorText);
    return !errorText;
  };

  Object.keys(fields).forEach((key) => {
    const { input } = fields[key];
    let touched = false;

    input.addEventListener('blur', () => {
      touched = true;
      validateField(key);
    });

    input.addEventListener('input', () => {
      if (touched) validateField(key);
    });
  });

  const messageInput = fields.message.input;
  const charCount = document.getElementById('charCount');

  messageInput.addEventListener('input', () => {
    const len = messageInput.value.trim().length;
    charCount.textContent = len >= 20 ? `${len} characters — looks good!` : `${len} / 20 min characters`;
    charCount.classList.toggle('valid', len >= 20);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const results = Object.keys(fields).map((key) => validateField(key));
    const allValid = results.every(Boolean);

    if (!allValid) {
      const firstInvalidKey = Object.keys(fields).find(
        (key) => fields[key].input.closest('.input-group').classList.contains('has-error')
      );
      if (firstInvalidKey) fields[firstInvalidKey].input.focus();
      return;
    }

    sendBtn.classList.add('is-loading');
    sendBtn.disabled = true;

    setTimeout(() => {
      sendBtn.classList.remove('is-loading');
      sendBtn.disabled = false;

      form.reset();
      Object.keys(fields).forEach((key) => {
        const group = fields[key].input.closest('.input-group');
        group.classList.remove('has-error', 'has-success');
        fields[key].error.textContent = '';
      });
      charCount.textContent = '0 / 20 min characters';
      charCount.classList.remove('valid');

      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3800);
    }, 1400);
  });

});
