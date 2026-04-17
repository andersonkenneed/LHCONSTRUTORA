import './style.css'

// Sincronia de Vídeo Direta (Simples e Estável)
function initVideoScroll() {
  const video = document.querySelector('#construction-video');
  const hero = document.querySelector('.hero');
  if (!video || !hero) return;

  video.pause();

  const updateTime = () => {
    const scrollY = window.scrollY;
    const progress = Math.max(0, Math.min(scrollY / hero.offsetHeight, 1));
    
    if (video.duration) {
      video.currentTime = video.duration * progress;
    }
  };

  window.addEventListener('scroll', updateTime, { passive: true });
  
  const unlock = () => {
    video.play().then(() => {
      video.pause();
      updateTime();
    }).catch(() => {});
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('click', unlock);
  };
  window.addEventListener('touchstart', unlock);
  window.addEventListener('click', unlock);
}

// Animações de Interseção
function initAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.fade-in-up, .reveal-mask').forEach(el => {
    observer.observe(el);
  });
}

// Formulário
function initForm() {
  const form = document.getElementById('whatsapp-form');
  if (form) {
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
}

// Inicializa
initVideoScroll();
initAnimations();
initForm();
