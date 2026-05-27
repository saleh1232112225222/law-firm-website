document.addEventListener('DOMContentLoaded', function() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      nav.classList.toggle('open');
    });
  }

  // Close menu on link click (mobile)
  document.querySelectorAll('.nav a').forEach(function(link) {
    link.addEventListener('click', function() {
      nav.classList.remove('open');
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Form submission handling (lead magnet & booking)
  const forms = document.querySelectorAll('form');
  forms.forEach(function(form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const formData = new FormData(form);
      const data = {};
      formData.forEach(function(value, key) {
        data[key] = value;
      });
      data.timestamp = new Date().toISOString();
      data.page = window.location.pathname;

      // Show loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        const originalText = submitBtn.innerHTML;
        const lang = document.documentElement.lang || 'ar';
        submitBtn.innerHTML = lang === 'en' ? 'Sending...' : 'جاري الإرسال...';
        submitBtn.disabled = true;
      }

      // Determine form type
      const isLeadForm = form.classList.contains('lead-form');

      // Web3Forms — إرسال فوري للبريد الإلكتروني (مجاني 250 استمارة/شهر)
      var WEB3FORMS_KEY = '7defb7ec-4170-43b5-9eb5-2d3e5158e40e';
      if (WEB3FORMS_KEY) {
        fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_key: WEB3FORMS_KEY,
            subject: isLeadForm ? '📘 طلب دليل 7 أخطاء قانونية' : '📞 حجز استشارة قانونية',
            from_name: 'Saleh Law',
            ...data
          })
        }).catch(function() {});
      }

      // Save to localStorage (local lead tracking)
      try {
        var leads = JSON.parse(localStorage.getItem('salehlaw_leads') || '[]');
        leads.push({ name: data.name || 'unknown', phone: data.phone || '', company: data.company || '', type: isLeadForm ? 'lead-magnet' : 'booking', timestamp: data.timestamp, page: data.page });
        if (leads.length > 50) leads = leads.slice(-50);
        localStorage.setItem('salehlaw_leads', JSON.stringify(leads));
      } catch(e) {}

      // Redirect based on form type
      var redirectUrl = isLeadForm ? 'pdf/7-mistakes.html' : 'thank-you.html';
      setTimeout(function() {
        window.location.href = redirectUrl;
      }, 800);
    });
  });

  // Active nav link highlighting
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function(link) {
    const linkPath = link.getAttribute('href');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
});
