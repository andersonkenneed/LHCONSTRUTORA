const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

// Replace duplicated loading attributes
html = html.replace(/loading="lazy" decoding="async" loading="lazy" decoding="async"/g, 'loading="lazy" decoding="async"');

// Replace data-alt with alt
html = html.replace(/data-alt=/g, 'alt=');

// Fix trailing slashes before the loading attributes `<img ... / loading=`
html = html.replace(/\/\s*loading="lazy"/g, 'loading="lazy"');

// Fix the head section
html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com\?plugins=forms,container-queries"><\/script>[\s\S]*?<\/style>/, '<link rel="stylesheet" href="/src/style.css">');

// Fix text-5xl md:text-8xl conflict
html = html.replace(/text-4xl md:text-5xl md:text-8xl/g, 'text-4xl md:text-8xl fade-in-up');

// Fix the pt-12 to md:pt-12 in portfolio
html = html.replace(/<div class="space-y-8 pt-12">/, '<div class="space-y-8 md:pt-12 fade-in-up">');

// Add fade-in classes to a few key elements
html = html.replace(/<h2 class="font-headline/g, '<h2 class="font-headline fade-in-up');
html = html.replace(/<div class="space-y-8">/g, '<div class="space-y-8 fade-in-up">');
html = html.replace(/<div class="bg-surface p-12/g, '<div class="bg-surface p-12 fade-in-up');

// Inject Intersection Observer
const scriptBlock = `
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
  });
`;

html = html.replace(/<\/script>\s*<\/body>/, scriptBlock + '\n</script>\n</body>');

fs.writeFileSync('index.html', html, 'utf8');
console.log('Fixed index.html successfully!');
