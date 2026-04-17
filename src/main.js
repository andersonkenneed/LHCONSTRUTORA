import './style.css'

// Sincronia de Vídeo Simples e Eficaz
function initVideoScroll() {
  const video = document.querySelector('#construction-video');
  const hero = document.querySelector('.hero');
  if (!video || !hero) return;

  // Garante que o vídeo não tente tocar sozinho
  video.pause();

  const updateTime = () => {
    const scrollY = window.scrollY;
    const height = hero.offsetHeight - window.innerHeight;
    const progress = Math.max(0, Math.min(scrollY / hero.offsetHeight, 1));
    
    if (video.duration) {
      video.currentTime = video.duration * progress;
    }
  };

  window.addEventListener('scroll', updateTime, { passive: true });
  
  // Para Mobile: Alguns navegadores precisam de um "play" inicial
  const unlock = () => {
    video.play().then(() => {
      video.pause();
      updateTime();
    });
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('click', unlock);
  };
  window.addEventListener('touchstart', unlock);
  window.addEventListener('click', unlock);
}

// Mostrar Imagens e Animações Simples
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
