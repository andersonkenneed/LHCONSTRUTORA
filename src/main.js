import './style.css'

// Sincronização do vídeo com scroll suave (Lerp)
function initVideoScroll() {
  const heroSection = document.querySelector('.hero');
  const video = document.querySelector('#construction-video');
  if (!heroSection || !video) return;

  let targetTime = 0;
  let currentTime = 0;
  const accel = 0.1;

  function updateVideo() {
    if (video.readyState >= 2) {
      currentTime += (targetTime - currentTime) * accel;
      if (Math.abs(targetTime - currentTime) > 0.001) {
        video.currentTime = currentTime;
      }
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

// Navbar e Animações
function initUI() {
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

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

  // Só esconde os elementos para animar se o JS estiver ativo aqui
  document.querySelectorAll('.fade-in-up, .reveal-mask').forEach(el => {
    el.classList.add('ready'); // Agora sim o elemento fica invisível para animar
    observer.observe(el);
  });
}

// Formulário
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

// Execução imediata
initVideoScroll();
initUI();
initForm();
