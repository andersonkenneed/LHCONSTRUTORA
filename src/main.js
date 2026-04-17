import './style.css'

// Lógica de sincronização do vídeo com suavização (Smooth Scroll Video)
function initVideoScroll() {
  const heroSection = document.querySelector('.hero');
  const video = document.querySelector('#construction-video');
  if (!heroSection || !video) return;

  let targetTime = 0;
  let currentTime = 0;
  const accel = 0.1; // Fator de suavização (menor = mais suave)

  // Atualiza o tempo do vídeo via RequestAnimationFrame para máxima fluidez
  function updateVideo() {
    if (video.readyState >= 2) {
      currentTime += (targetTime - currentTime) * accel;
      video.currentTime = currentTime;
    }
    requestAnimationFrame(updateVideo);
  }

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const height = heroSection.offsetHeight;
    
    if (scrollY <= height) {
      const progress = scrollY / height;
      targetTime = progress * video.duration;
    }
  }, { passive: true });

  requestAnimationFrame(updateVideo);
}

// Navbar e Animações de Interseção
function initUI() {
  // Navbar
  const nav = document.querySelector('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('bg-surface/90', 'shadow-2xl', 'backdrop-blur-xl');
        nav.classList.remove('bg-surface/60');
      } else {
        nav.classList.remove('bg-surface/90', 'shadow-2xl', 'backdrop-blur-xl');
        nav.classList.add('bg-surface/60');
      }
    }, { passive: true });
  }

  // Intersection Observer para as máscaras e fades
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const parent = el.parentElement;
        
        if (parent && (parent.classList.contains('grid') || parent.classList.contains('space-y-8'))) {
          const siblings = Array.from(parent.querySelectorAll('.fade-in-up, .reveal-mask'));
          const index = siblings.indexOf(el);
          if (index !== -1) el.style.transitionDelay = `${index * 0.1}s`;
        }
        
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.fade-in-up, .reveal-mask').forEach(el => observer.observe(el));
}

// Formulário WhatsApp
function initForm() {
  const form = document.getElementById('whatsapp-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const location = document.getElementById('form-location').value;
    const service = document.getElementById('form-service').value;
    const details = document.getElementById('form-details').value;
    const text = `Olá Luiz! Meu nome é ${name}, gostaria de uma consultoria sobre ${service} para uma obra em ${location}.\n\nDetalhes:\n${details}`;
    window.open(`https://api.whatsapp.com/send?phone=5561991005256&text=${encodeURIComponent(text)}`, '_blank');
  });
}

// Iniciar todas as funções
initVideoScroll();
initUI();
initForm();
