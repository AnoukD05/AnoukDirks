const lightboxState = {
  overlay: null,
  content: null,
  image: null,
  closeButton: null,
  prevButton: null,
  nextButton: null,
  counter: null,
  isOpen: false,
  images: [],
  index: 0,
};

function ensureLightbox() {
  if (lightboxState.overlay) return lightboxState;

  const overlay = document.createElement('div');
  overlay.className = 'lightbox-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="lightbox-content" role="dialog" aria-modal="true" aria-label="Afbeelding vergroot">
      <button class="lightbox-close" type="button" aria-label="Sluiten">×</button>
      <button class="lightbox-nav lightbox-nav--prev" type="button" aria-label="Vorige afbeelding">‹</button>
      <img class="lightbox-image" alt="">
      <button class="lightbox-nav lightbox-nav--next" type="button" aria-label="Volgende afbeelding">›</button>
      <div class="lightbox-counter" aria-live="polite"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  lightboxState.overlay = overlay;
  lightboxState.content = overlay.querySelector('.lightbox-content');
  lightboxState.closeButton = overlay.querySelector('.lightbox-close');
  lightboxState.prevButton = overlay.querySelector('.lightbox-nav--prev');
  lightboxState.nextButton = overlay.querySelector('.lightbox-nav--next');
  lightboxState.counter = overlay.querySelector('.lightbox-counter');
  lightboxState.image = overlay.querySelector('.lightbox-image');

  lightboxState.closeButton?.addEventListener('click', closeLightbox);
  lightboxState.prevButton?.addEventListener('click', () => moveLightbox(-1));
  lightboxState.nextButton?.addEventListener('click', () => moveLightbox(1));
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) {
      closeLightbox();
    }
  });

  return lightboxState;
}

function setLightboxImage() {
  const state = ensureLightbox();

  if (!state.image || !state.images.length) return;

  const total = state.images.length;
  const safeIndex = (state.index + total) % total;
  const currentSrc = state.images[safeIndex];

  state.index = safeIndex;
  state.image.src = currentSrc;
  state.image.alt = state.image.dataset.baseAlt ? `${state.image.dataset.baseAlt} (${safeIndex + 1}/${total})` : `Afbeelding ${safeIndex + 1} van ${total}`;

  if (state.counter) {
    state.counter.textContent = `${safeIndex + 1} / ${total}`;
    state.counter.classList.toggle('is-hidden', total <= 1);
  }

  state.prevButton?.classList.toggle('is-hidden', total <= 1);
  state.nextButton?.classList.toggle('is-hidden', total <= 1);
}

function moveLightbox(step) {
  if (!lightboxState.images.length) return;

  lightboxState.index += step;
  setLightboxImage();
}

function getGalleryImagesFor(imageElement) {
  const gallery = imageElement.closest('[data-gallery-images]');
  const currentSrc = imageElement.getAttribute('src') || imageElement.currentSrc || imageElement.src;

  if (!gallery) return [currentSrc];

  const images = (gallery.dataset.galleryImages || '')
    .split('|')
    .map((path) => path.trim())
    .filter(Boolean);

  if (!images.length) return [currentSrc];

  const currentIndex = Math.max(
    0,
    images.findIndex((path) => currentSrc.includes(path) || path.includes(currentSrc))
  );

  return {
    images,
    currentIndex,
    baseAlt: gallery.dataset.galleryAlt || imageElement.alt || 'Vergrote afbeelding',
  };
}

function openLightboxFromImage(imageElement) {
  if (!imageElement || imageElement.closest('.lightbox-overlay')) return;

  const state = ensureLightbox();
  const galleryData = getGalleryImagesFor(imageElement);
  const source = imageElement.getAttribute('src') || imageElement.currentSrc || imageElement.src;
  const altText = imageElement.alt || 'Vergrote afbeelding';

  if (Array.isArray(galleryData)) {
    state.images = [source];
    state.index = 0;
    if (state.image) {
      state.image.dataset.baseAlt = altText;
    }
  } else {
    state.images = galleryData.images;
    state.index = galleryData.currentIndex;
    if (state.image) {
      state.image.dataset.baseAlt = galleryData.baseAlt;
    }
  }

  if (!state.images.length) {
    state.images = [source];
    state.index = 0;
    if (state.image) {
      state.image.dataset.baseAlt = altText;
    }
  }

  setLightboxImage();

  state.overlay?.classList.add('active');
  state.overlay?.setAttribute('aria-hidden', 'false');
  state.isOpen = true;
}

function closeLightbox() {
  if (!lightboxState.overlay) return;

  lightboxState.overlay.classList.remove('active');
  lightboxState.overlay.setAttribute('aria-hidden', 'true');
  lightboxState.isOpen = false;
  lightboxState.images = [];
  lightboxState.index = 0;
}

function setupImageLightbox() {
  ensureLightbox();

  document.addEventListener('click', (event) => {
    const imageElement = event.target.closest('img');
    if (!imageElement) return;

    openLightboxFromImage(imageElement);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightboxState.isOpen) {
      closeLightbox();
      return;
    }

    if (!lightboxState.isOpen || !lightboxState.images.length) return;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      moveLightbox(-1);
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      moveLightbox(1);
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupImageLightbox);
} else {
  setupImageLightbox();
}
