import './style.css'

// Controle do Vídeo com Sincronia de Scroll (Smooth & Mobile Friendly)
function initVideoScroll() {
  const heroSection = document.querySelector('.hero');
  const video = document.querySelector('#construction-video');
  if (!heroSection || !video) return;

  // Reforço no mobile: setar atributos explicitamente para garantir que iOS permita autoplay inline
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');
  video.setAttribute('muted', '');
  video.muted = true;

  // Forçar autoplay dinâmico inicial para baixar logo o frame
  video.play().then(() => video.pause()).catch(() => {});

  // Detecta se é mobile pelo User Agent ou tamanho de tela
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth <= 768;

  let targetTime = 0;
  let currentTime = 0;
  
  // No Desktop usamos um valor maior para resposta mais rápida, 
  // No mobile usamos um valor ajustado especificamente para curar o "delay" da tela ao arrastar
  const accel = isMobile ? 0.18 : 0.12; 

  // Função para atualizar o frame do vídeo
  function updateVideo() {
    if (video.readyState >= 2 && !isNaN(targetTime)) {
      currentTime += (targetTime - currentTime) * accel;
      
      // No mobile compensamos travamentos se o tempo atual já estourar quase na frente
      if (Math.abs(targetTime - currentTime) > 0.001) {
        try {
          video.currentTime = currentTime;
        } catch(e) {}
      }
    }
    requestAnimationFrame(updateVideo);
  }

  // Listener de Scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    // Diferença correta. A seção rola enquanto a altura for maior que a janela.
    const maxScroll = heroSection.offsetHeight - window.innerHeight;
    
    if (maxScroll > 0 && scrollY <= heroSection.offsetHeight) {
      let progress = scrollY / maxScroll;
      progress = Math.min(Math.max(progress, 0), 1); // Clamp entre 0 e 1
      
      // Guardar contra video.duration que começa como NaN
      if (video.duration && !isNaN(video.duration)) {
        targetTime = progress * video.duration;
      }
    }
  }, { passive: true });

  // "Destrava" o vídeo no mobile ao primeiro toque/scroll (ajuda no iOS Safari)
  const unlockVideo = () => {
    video.play().then(() => {
      video.pause();
      window.removeEventListener('touchstart', unlockVideo);
      window.removeEventListener('touchmove', unlockVideo);
      window.removeEventListener('click', unlockVideo);
    }).catch(e => {
       // Silencioso se o usuário não interagir adequadamente
    });
  };
  
  window.addEventListener('touchstart', unlockVideo, { passive: true, once: true });
  window.addEventListener('touchmove', unlockVideo, { passive: true, once: true });
  window.addEventListener('click', unlockVideo, { passive: true, once: true });

  requestAnimationFrame(updateVideo);
}

// Navbar e Animações de Elementos
function initUI() {
  // Navbar dinâmico
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
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px -50px 0px' });

  // Seleciona e ativa a animação nos elementos
  document.querySelectorAll('.fade-in-up, .reveal-mask').forEach(el => {
    el.classList.add('ready'); // Só agora o CSS aplica o estado de animação
    observer.observe(el);
  });
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

// Inicialização segura
const start = () => {
  initVideoScroll();
  initUI();
  initForm();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', start);
} else {
  start();
}
