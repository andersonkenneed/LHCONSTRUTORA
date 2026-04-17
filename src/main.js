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
  
  // No Desktop usamos um valor suave.
  // No Mobile vamos ignorar essa variável e aplicar a rotação direta (zero delay).
  const accel = 0.12; 

  // Função para atualizar o frame do vídeo (Apenas Desktop)
  function updateVideo() {
    if (!isMobile && video.readyState >= 2 && !isNaN(targetTime)) {
      currentTime += (targetTime - currentTime) * accel;
      
      if (Math.abs(targetTime - currentTime) > 0.001) {
        try {
          video.currentTime = currentTime;
        } catch(e) {}
      }
    }
    if (!isMobile) {
      requestAnimationFrame(updateVideo);
    }
  }

  // Listener de Scroll
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const maxScroll = heroSection.offsetHeight - window.innerHeight;
    
    if (maxScroll > 0 && scrollY <= heroSection.offsetHeight) {
      let progress = scrollY / maxScroll;
      progress = Math.min(Math.max(progress, 0), 1); 
      
      if (video.duration && !isNaN(video.duration)) {
        targetTime = progress * video.duration;
        
        // No celular, o arrastar do dedo já atualiza pixel por pixel (60fps). 
        // Aplicamos direto na raiz do vídeo para garantir ZERO atraso de cálculo.
        if (isMobile && video.readyState >= 2) {
            try {
                video.currentTime = targetTime;
            } catch(e) {}
        }
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
  // Navbar dinâmico e Botão do WhatsApp
  const nav = document.querySelector('nav');
  const floatingBtn = document.getElementById('floating-whatsapp');
  
  if (nav || floatingBtn) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      
      if (nav) {
        if (scrollY > 50) {
          nav.classList.add('bg-surface/90', 'shadow-2xl', 'backdrop-blur-xl');
          nav.classList.remove('bg-surface/60');
        } else {
          nav.classList.remove('bg-surface/90', 'shadow-2xl', 'backdrop-blur-xl');
          nav.classList.add('bg-surface/60');
        }
      }

      // Mostra o botão flutuante apenas após passar da primeira tela (Hero)
      if (floatingBtn) {
        if (scrollY > window.innerHeight * 0.5) {
          floatingBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-10');
          floatingBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
        } else {
          floatingBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-10');
          floatingBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
        }
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
