const overlay = document.getElementById('modalOverlay');
const modalBox = document.getElementById('modalBox');
const closeBtn = document.getElementById('modalClose');
const modalBadge = document.getElementById('modalBadge');
const modalTitle = document.getElementById('modalTitle');
const modalRegion = document.getElementById('modalRegion');
const modalImgWrapper = document.getElementById('modalImgWrapper');
const modalImg = document.getElementById('modalImg');
const modalDesc = document.getElementById('modalDesc');
const modalLearning = document.getElementById('modalLearning');
const modalReflection = document.getElementById('modalReflection');
const modalDefaultContent = document.getElementById('modalDefaultContent');
const modalRichContent = document.getElementById('modalRichContent');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const heroBackground = document.querySelector('.hero-background');

const sectionAccentColors = {
  'wie-ben-ik': '#c4855a',
  innovatie: '#3a7a9c',
  internationalisering: '#6b9465',
  seminaries: '#7a5c8a',
  'persoonlijke-ontwikkeling': '#c9a84c',
  eindreflectie: '#aa2f8b',
};

const galleryState = {
  images: [],
  index: 0,
  imageEl: null,
  counterEl: null,
};

function clearGalleryState() {
  galleryState.images = [];
  galleryState.index = 0;
  galleryState.imageEl = null;
  galleryState.counterEl = null;
}

function updateGalleryImage() {
  if (!galleryState.images.length || !galleryState.imageEl) return;

  const total = galleryState.images.length;
  const safeIndex = (galleryState.index + total) % total;
  const currentSrc = galleryState.images[safeIndex];

  galleryState.index = safeIndex;
  galleryState.imageEl.src = currentSrc;
  galleryState.imageEl.alt = `${modalTitle?.textContent || 'Activiteit'} (${safeIndex + 1}/${total})`;

  if (galleryState.counterEl) {
    galleryState.counterEl.textContent = `${safeIndex + 1} / ${total}`;
  }
}

function moveGallery(step) {
  if (galleryState.images.length <= 1) return;
  galleryState.index += step;
  updateGalleryImage();
}

function renderModalMedia(data) {
  if (!modalImg) return;

  const images = Array.isArray(data?.images)
    ? data.images.filter((path) => typeof path === 'string' && path.trim().length > 0)
    : [];

  modalImgWrapper?.classList.remove('modal-img--gallery');
  modalImgWrapper?.removeAttribute('data-gallery-images');
  modalImgWrapper?.removeAttribute('data-gallery-alt');
  modalImg.innerHTML = '';
  clearGalleryState();

  if (!images.length) {
    modalImg.textContent = data?.icon || '📷';
    return;
  }

  modalImgWrapper?.classList.add('modal-img--gallery');
  modalImgWrapper?.setAttribute('data-gallery-images', images.join('|'));
  modalImgWrapper?.setAttribute('data-gallery-alt', data?.title || 'Activiteit');

  const imageEl = document.createElement('img');
  imageEl.className = 'modal-photo';
  imageEl.loading = 'lazy';

  modalImg.appendChild(imageEl);

  galleryState.images = images;
  galleryState.imageEl = imageEl;

  if (images.length > 1) {
    const prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'modal-gallery-btn modal-gallery-btn--prev';
    prevBtn.setAttribute('aria-label', 'Vorige foto');
    prevBtn.textContent = '‹';

    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'modal-gallery-btn modal-gallery-btn--next';
    nextBtn.setAttribute('aria-label', 'Volgende foto');
    nextBtn.textContent = '›';

    const counter = document.createElement('div');
    counter.className = 'modal-gallery-counter';

    prevBtn.addEventListener('click', () => moveGallery(-1));
    nextBtn.addEventListener('click', () => moveGallery(1));

    modalImg.appendChild(prevBtn);
    modalImg.appendChild(nextBtn);
    modalImg.appendChild(counter);

    galleryState.counterEl = counter;
  }

  updateGalleryImage();
}

function renderActivityParts(data) {
  if (!modalRichContent) return;

  modalRichContent.innerHTML = '';

  const parts = Array.isArray(data?.parts) ? data.parts : [];
  if (!parts.length) {
    modalRichContent.classList.add('is-hidden');
    return;
  }

  const section = document.createElement('div');
  section.className = 'modal-section';

  const label = document.createElement('p');
  label.className = 'modal-section-label';
  label.textContent = 'X-Factor onderdelen';
  section.appendChild(label);

  const grid = document.createElement('div');
  grid.className = 'reflection-grid';

  parts.forEach((part) => {
    const card = document.createElement('div');
    card.className = 'reflection-card';

    const icon = document.createElement('div');
    icon.className = 'reflection-card-icon';
    icon.textContent = part.icon || '';

    const heading = document.createElement('h3');
    heading.textContent = part.title || 'Onderdeel';

    const text = document.createElement('p');
    text.textContent = part.text || '';

    card.appendChild(icon);
    card.appendChild(heading);
    card.appendChild(text);
    grid.appendChild(card);
  });

  section.appendChild(grid);
  modalRichContent.appendChild(section);
  modalRichContent.classList.remove('is-hidden');
}

function openModalShell() {
  if (!overlay) return;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  if (modalBox) {
    modalBox.scrollTop = 0;
  }
}

function resetModalContent() {
  modalBox?.classList.remove('modal--section');
  modalDefaultContent?.classList.remove('is-hidden');
  modalRichContent?.classList.add('is-hidden');
  modalImgWrapper?.classList.remove('modal-img--gallery');
  clearGalleryState();

  if (modalRichContent) {
    modalRichContent.innerHTML = '';
  }
}

function openActivityModal(key) {
  const data = window.activities?.[key];
  if (!data || !overlay) return;

  resetModalContent();

  modalTitle.textContent = data.title;
  modalRegion.textContent = data.region;
  modalDesc.textContent = data.desc;
  modalLearning.textContent = data.learning;
  modalReflection.textContent = data.reflection;
  renderModalMedia(data);
  renderActivityParts(data);

  modalBadge.textContent = data.badge;
  modalBadge.style.background = `${data.badgeColor}22`;
  modalBadge.style.color = data.badgeColor;
  modalBadge.style.border = `1px solid ${data.badgeColor}44`;

  openModalShell();
}

function openSectionModal(sectionId) {
  const section = document.getElementById(sectionId);
  const sectionContainer = section?.querySelector('.section-container');

  if (!section || !sectionContainer || !modalRichContent) return;

  resetModalContent();

  const labelText = section.querySelector('.section-label')?.textContent?.trim() || 'Sectie';
  const titleText = section.querySelector('.section-title')?.textContent?.trim() || 'Overzicht';
  const clone = sectionContainer.cloneNode(true);

  clone.querySelectorAll('[id]').forEach((element) => {
    element.removeAttribute('id');
  });

  clone.querySelector('.section-label')?.remove();
  clone.querySelector('.section-title')?.remove();
  clone.querySelectorAll('.skill-fill').forEach((fill) => {
    fill.classList.add('visible');
  });

  modalBox?.classList.add('modal--section');
  modalDefaultContent?.classList.add('is-hidden');
  modalRichContent.classList.remove('is-hidden');
  modalRichContent.appendChild(clone);

  const accentColor = sectionAccentColors[sectionId] || '#c4855a';

  modalBadge.textContent = labelText;
  modalBadge.style.background = `${accentColor}22`;
  modalBadge.style.color = accentColor;
  modalBadge.style.border = `1px solid ${accentColor}44`;

  modalTitle.textContent = titleText;
  modalRegion.textContent = '';

  openModalShell();
}

window.openSectionModal = openSectionModal;

function closeModal() {
  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function setupModalTriggers() {
  document.querySelectorAll('.marker[data-modal]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openActivityModal(element.dataset.modal);
    });
  });

  document.querySelectorAll('.topic-title-trigger[data-section-target]').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openSectionModal(element.dataset.sectionTarget);
    });
  });

  document.querySelectorAll('.topic-card--clickable[data-section-target]').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.topic-title-trigger')) {
        return;
      }

      openSectionModal(card.dataset.sectionTarget);
    });
  });
}

function setupModalClose() {
  closeBtn?.addEventListener('click', closeModal);

  overlay?.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (!overlay?.classList.contains('active')) return;
    if (modalDefaultContent?.classList.contains('is-hidden')) return;
    if (galleryState.images.length <= 1) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveGallery(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveGallery(1);
    }
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

function setupActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');

  if (!sections.length || !links.length) return;

  // Only enable scroll-based active-link highlighting when the
  // navigation contains same-page (hash) links. On multi-page sites
  // (links to other HTML files) this observer would remove the
  // explicitly-set active class — which breaks the portfolio page.
  const hasHashLinks = Array.from(links).some((l) => (l.getAttribute('href') || '').startsWith('#'));
  if (!hasHashLinks) return;

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      links.forEach((link) => link.classList.remove('active'));
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      activeLink?.classList.add('active');
    });
  }, { threshold: 0.3 });

  sections.forEach((section) => navObserver.observe(section));
}

function setupFadeIn() {
  const fadeElements = document.querySelectorAll('.fade-in');
  if (!fadeElements.length) return;

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  fadeElements.forEach((element) => fadeObserver.observe(element));

  setTimeout(() => {
    document.querySelectorAll('.topic-card.fade-in').forEach((element, index) => {
      setTimeout(() => element.classList.add('visible'), index * 80);
    });
  }, 200);
}

function setupSkillBars() {
  const skillList = document.getElementById('skillsList');
  if (!skillList) return;

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      entry.target.querySelectorAll('.skill-fill').forEach((fill) => {
        fill.classList.add('visible');
      });

      skillObserver.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  skillObserver.observe(skillList);
}

function setupParallax() {
  if (!heroBackground) return;

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroBackground.style.transform = `translateY(${scrolled * 0.25}px)`;
    }
  }, { passive: true });
}

function initializePage() {
  setupModalTriggers();
  setupModalClose();
  setupMobileNav();
  setupActiveNav();
  setupFadeIn();
  setupSkillBars();
  setupParallax();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializePage);
} else {
  initializePage();
}
