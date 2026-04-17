import './style.css'

// Lógica para sincronizar o vídeo da Hero com o scroll
document.addEventListener('DOMContentLoaded', () => {
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
    });
  }

  // Navbar transparente/blur ao scrollar com borda dinâmica
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
    });
  }

  // Animações em Cascata (Staggered Animation)
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Se o elemento pai for um grid, aplica delay baseado na posição
        const parent = entry.target.parentElement;
        if (parent && (parent.classList.contains('grid') || parent.id === 'services' || parent.classList.contains('space-y-8'))) {
          const siblings = Array.from(parent.querySelectorAll('.fade-in-up, .reveal-mask'));
          const index = siblings.indexOf(entry.target);
          if (index !== -1) {
            entry.target.style.transitionDelay = `${index * 0.15}s`;
          }
        }
        
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up, .reveal-mask').forEach(el => observer.observe(el));

  // Lógica do Formulário de WhatsApp
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
});
