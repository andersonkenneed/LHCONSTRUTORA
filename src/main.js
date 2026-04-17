import './style.css'

// Motor de Sincronia de Vídeo de Alta Performance
function initVideoScroll() {
  const heroSection = document.querySelector('.hero');
  const video = document.querySelector('#construction-video');
  if (!heroSection || !video) return;

  let targetTime = 0;
  let currentTime = 0;
  const accel = 0.15; // Aceleração levemente maior para resposta mais rápida

  // Função principal de atualização
  function updateVideo() {
    if (video.duration) {
      // Cálculo de interpolação (suavização)
      currentTime += (targetTime - currentTime) * accel;
      
      // Só atualiza se o vídeo não estiver ocupado processando e a diferença for relevante
      if (!video.seeking && Math.abs(targetTime - currentTime) > 0.01) {
        video.currentTime = currentTime;
      }
    }
    
    // Usa a API mais moderna se disponível, senão volta para requestAnimationFrame
    if ('requestVideoFrameCallback' in video) {
      video.requestVideoFrameCallback(updateVideo);
    } else {
      requestAnimationFrame(updateVideo);
    }
  }

  // Atualiza o tempo alvo baseado no scroll
  const onScroll = () => {
    const scrollY = window.pageYOffset || window.scrollY;
    const height = heroSection.offsetHeight;
    if (scrollY <= height) {
      const progress = Math.max(0, Math.min(scrollY / height, 1));
      targetTime = progress * (video.duration || 0);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });

  // TRUQUE PARA MOBILE: "Acorda" o hardware de vídeo no primeiro toque
  const unlock = () => {
    video.play().then(() => {
      video.pause();
      console.log("Vídeo desbloqueado para scroll");
    }).catch(err => console.log("Aguardando interação para vídeo..."));
    
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('click', unlock);
  };

  window.addEventListener('touchstart', unlock, { passive: true });
  window.addEventListener('click', unlock, { passive: true });

  // Inicia o loop
  if ('requestVideoFrameCallback' in video) {
    video.requestVideoFrameCallback(updateVideo);
  } else {
    requestAnimationFrame(updateVideo);
  }
}

// Interface e Animações
function initUI() {
  const nav = document.querySelector('nav');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  // Navbar
  window.addEventListener('scroll', () => {
    if (nav) {
      if (window.scrollY > 50) {
        nav.classList.add('bg-surface/90', 'backdrop-blur-xl', 'shadow-xl');
      } else {
        nav.classList.remove('bg-surface/90', 'backdrop-blur-xl', 'shadow-xl');
      }
    }
  }, { passive: true });

  // Ativa observador apenas se os elementos existirem
  document.querySelectorAll('.fade-in-up, .reveal-mask').forEach(el => {
    observer.observe(el);
    // Força visibilidade inicial mínima para segurança
    el.style.opacity = "1"; 
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

// Start
window.addEventListener('load', () => {
  initVideoScroll();
  initUI();
  initForm();
});
