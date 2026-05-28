const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function setupProjectGallery() {
  document.querySelectorAll('.project-gallery').forEach((gallery) => {
    const image = gallery.querySelector('.project-gallery-image');
    const prevButton = gallery.querySelector('.project-gallery-btn--prev');
    const nextButton = gallery.querySelector('.project-gallery-btn--next');
    const counter = gallery.querySelector('.project-gallery-counter');
    const altBase = gallery.dataset.galleryAlt || 'Project afbeelding';
    const imagePaths = (gallery.dataset.galleryImages || '')
      .split('|')
      .map((path) => path.trim())
      .filter(Boolean);

    if (!image || imagePaths.length === 0) return;

    let currentIndex = 0;

    function renderImage() {
      const currentPath = imagePaths[currentIndex];
      image.src = currentPath;
      image.alt = `${altBase} (${currentIndex + 1}/${imagePaths.length})`;

      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${imagePaths.length}`;
      }
    }

    function move(step) {
      currentIndex = (currentIndex + step + imagePaths.length) % imagePaths.length;
      renderImage();
    }

    prevButton?.addEventListener('click', () => move(-1));
    nextButton?.addEventListener('click', () => move(1));

    renderImage();
  });
}

function setupMobileNav() {
  navToggle?.addEventListener('click', () => {
    navLinks?.classList.toggle('open');
  });

  navLinks?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
}

function setupFadeIn() {
  const fadeElements = document.querySelectorAll('.fade-in');
  if (!fadeElements.length) return;

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = `${index * 0.12}s`;
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  fadeElements.forEach((element) => {
    fadeObserver.observe(element);
  });
}

function toggleReflection(button) {
  const body = button.nextElementSibling;
  if (!body) return;

  const isOpen = body.classList.toggle('open');
  button.classList.toggle('open', isOpen);
  button.setAttribute('aria-expanded', String(isOpen));

  const label = button.querySelector('span');
  if (label) {
    label.textContent = isOpen ? 'Sluit reflectie' : 'Lees mijn reflectie';
  }
}

function setupReflectionToggle() {
  document.querySelectorAll('[data-reflection-toggle]').forEach((button) => {
    button.addEventListener('click', () => {
      toggleReflection(button);
    });
  });
}

function initializeProjectPage() {
  setupMobileNav();
  setupFadeIn();
  setupReflectionToggle();
  setupProjectGallery();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeProjectPage);
} else {
  initializeProjectPage();
}
