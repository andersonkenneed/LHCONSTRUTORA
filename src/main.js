import './style.css'

/**
 * MOTOR DE SINCRONIA SUAVE (SMOOTH VIDEO SCROLL)
 * Usa Interpolação Linear (Lerp) para remover os "pulos" do vídeo.
 */
function initVideoScroll() {
  const video = document.querySelector('#construction-video');
  const hero = document.querySelector('.hero');
  if (!video || !hero) return;

  let targetTime = 0;
  let currentTime = 0;
  const lerpFactor = 0.08; // Quanto menor, mais suave e "lento" o ajuste (0.05 a 0.1 é o ideal)

  // Função que roda a cada frame da tela (60fps ou 120fps)
  function render() {
    if (video.duration) {
      // Suavização: currentTime caminha em direção ao targetTime gradualmente
      currentTime += (targetTime - currentTime) * lerpFactor;
      
      // Evita processamento desnecessário se a diferença for mínima
      if (Math.abs(targetTime - currentTime) > 0.001) {
        video.currentTime = currentTime;
      }
    }
    requestAnimationFrame(render);
  }

  // Atualiza apenas o objetivo (target) no scroll
  const handleScroll = () => {
    const scrollY = window.scrollY;
    const scrollMax = hero.offsetHeight; // Ajuste para a altura da seção hero
    const progress = Math.max(0, Math.min(scrollY / scrollMax, 1));
    targetTime = progress * video.duration;
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  // Desbloqueio para Mobile (Obrigatório para iOS/Android permitirem controle de seek)
  const unlock = () => {
    video.play().then(() => {
      video.pause();
    }).catch(() => {});
    window.removeEventListener('touchstart', unlock);
    window.removeEventListener('click', unlock);
  };
  window.addEventListener('touchstart', unlock, { passive: true });
  window.addEventListener('click', unlock, { passive: true });

  // Inicia o loop de renderização
  requestAnimationFrame(render);
}

// Animações de Interseção (Fade-in das seções)
function initUI() {
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

// Formulário de WhatsApp
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

// Inicialização ao carregar a página
window.addEventListener('load', () => {
  initVideoScroll();
  initUI();
  initForm();
});
