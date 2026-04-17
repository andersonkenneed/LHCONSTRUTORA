import './style.css'

// Função para inicializar as animações
function initAnimations() {
  const heroSection = document.querySelector('.hero');
  const video = document.querySelector('#construction-video');

  if (heroSection && video) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const totalVisibleScroll = heroSection.offsetHeight;
      
      if (scrollY <= totalVisibleScroll) {
          const progress = Math.min(scrollY / totalVisibleScroll, 1);
          if (video.readyState >= 2) {
            video.currentTime = progress * video.duration;
          }
      }
    }, { passive: true });
  }

  // Navbar transparente/blur ao scrollar
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

  // Animações de Interseção
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -10% 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        
        // Aplica delay para elementos em grupo
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('grid') || parent.classList.contains('space-y-8'))) {
          const siblings = Array.from(parent.querySelectorAll('.fade-in-up, .reveal-mask'));
          const index = siblings.indexOf(el);
          if (index !== -1) {
            el.style.transitionDelay = `${index * 0.1}s`;
          }
        }
        
        el.classList.add('visible');
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up, .reveal-mask').forEach(el => {
    observer.observe(el);
  });
}

// Formulário de WhatsApp
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

// Inicializa tudo
initAnimations();
initForm();
