/**
 * ORIANZI ATELIER - JAVASCRIPT CONTROLLER
 * Author: Oluwakemi Jejeloye Orianzi Brand & Atelier Console
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- 0. Dynamic Navbar Height Synchronization for Viewport-Bound Sections ---
  const navbar = document.getElementById('navbar');
  function syncNavbarHeight() {
    if (!navbar) return;
    const h = navbar.getBoundingClientRect().height;
    document.documentElement.style.setProperty('--navbar-h', `${Math.round(h)}px`);
  }
  syncNavbarHeight();
  window.addEventListener('resize', syncNavbarHeight);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(syncNavbarHeight);
  }

  // --- 1. Sticky Navigation & Active Link Tracker ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let scrollY = window.pageYOffset;
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  // --- 2. Mobile Navigation Toggle ---
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navLinks');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileToggle.querySelector('.material-symbols-outlined');
      if (navMenu.classList.contains('active')) {
        icon.textContent = 'close';
      } else {
        icon.textContent = 'menu';
      }
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('.material-symbols-outlined');
        if (icon) icon.textContent = 'menu';
      });
    });
  }

  // --- 3. Collection Filter Tabs ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const lookbookItems = document.querySelectorAll('.lookbook-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      lookbookItems.forEach(item => {
        if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
          item.style.display = 'flex';
          setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 50);
        } else {
          item.style.opacity = '0';
          item.style.transform = 'translateY(20px)';
          setTimeout(() => {
            item.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // --- 4. Interactive VIP Consultation Form & Modal ---
  const contactForm = document.getElementById('vipConsultationForm');
  const successModal = document.getElementById('successModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('clientName').value.trim();
      const email = document.getElementById('clientEmail').value.trim();
      const garmentType = document.getElementById('coutureCategory').value;
      const phone = document.getElementById('clientPhone').value.trim();
      const location = document.getElementById('salonLocation').value;
      const eventDate = document.getElementById('eventDate').value;
      const notes = document.getElementById('coutureNotes').value.trim();

      if (!name || !email || !garmentType) {
        alert('Please provide your name, email address, and desired couture creation.');
        return;
      }

      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = '<span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span> Transmitting VIP Booking...';
      submitBtn.disabled = true;

      try {
        const res = await fetch('https://api.formsend.ezeroandone.io/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: 'd6ea269b0297c71983993439c61cfe512300e8d69ce53dd7b138f2569ca761a8',
            name: name,
            email: email,
            subject: `VIP Private Fitting Request – ${garmentType}`,
            message: `Couture Commission: ${garmentType}\nPreferred Studio: ${location}\nTarget Occasion Date: ${eventDate || 'Not specified'}\nPhone / WhatsApp: ${phone || 'Not provided'}\n\nDesign Vision & Specifications:\n${notes || 'None provided'}`,
          }),
        });

        const data = await res.json();

        if (data.success) {
          contactForm.reset();
          const clientSpan = document.getElementById('modalClientName');
          if (clientSpan) clientSpan.textContent = name;
          if (successModal) successModal.classList.add('active');
        } else {
          alert(`Submission error: ${data.message || 'Please try again.'}`);
        }
      } catch (err) {
        alert('A network error occurred. Please check your connection and try again.');
      } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  if (closeModalBtn && successModal) {
    closeModalBtn.addEventListener('click', () => {
      successModal.classList.remove('active');
    });

    successModal.addEventListener('click', (e) => {
      if (e.target === successModal) {
        successModal.classList.remove('active');
      }
    });
  }
});
