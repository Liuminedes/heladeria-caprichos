document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.menu-section');
  const hero = document.querySelector('.hero');
  const categoryButton = document.getElementById('categoryButton');
  const categoryButtonLabel = document.getElementById('categoryButtonLabel');
  const categoryOverlay = document.getElementById('categoryOverlay');
  const categoryCards = document.querySelectorAll('.category-card');

  // Initialize: hide all sections except the first one
  sections.forEach((section, index) => {
    if (index !== 0) {
      section.classList.add('hidden');
    }
  });

  const openPanel = () => {
    categoryOverlay.classList.add('open');
    categoryButton.setAttribute('aria-expanded', 'true');
  };

  const closePanel = () => {
    categoryOverlay.classList.remove('open');
    categoryButton.setAttribute('aria-expanded', 'false');
  };

  categoryButton.addEventListener('click', () => {
    const isOpen = categoryOverlay.classList.contains('open');
    if (isOpen) {
      closePanel();
    } else {
      openPanel();
    }
  });

  // Close the panel when tapping the dimmed backdrop (not the panel itself)
  categoryOverlay.addEventListener('click', (e) => {
    if (e.target === categoryOverlay) closePanel();
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && categoryOverlay.classList.contains('open')) {
      closePanel();
    }
  });

  // Scroll back to the top of the menu. We deliberately measure .hero
  // (a normal, never sticky/fixed element) instead of the sticky button
  // itself — once the button is "stuck" to the top of the viewport its
  // getBoundingClientRect().top is 0, which would make this a no-op when
  // scrolled down. Measuring .hero's bottom edge is reliable at any scroll
  // position. We also retry across two animation frames as a safety net
  // for mobile browsers that don't finish reflowing in a single frame.
  const scrollToMenuTop = () => {
    const top = hero.getBoundingClientRect().bottom + window.scrollY;
    window.scrollTo(0, top);
  };

  const goToCategory = (card) => {
    const targetId = card.getAttribute('data-target');
    const targetSection = document.getElementById(targetId);
    if (!targetSection) return;

    // Failsafe: if the product modal was ever closed in an unexpected way,
    // it could have left body.style.overflow = 'hidden', silently blocking
    // every future scrollTo on the page. Always clear it before scrolling.
    document.body.style.overflow = '';

    // Update active card + button label
    categoryCards.forEach(c => c.classList.remove('active'));
    card.classList.add('active');
    categoryButtonLabel.textContent = card.querySelector('span').textContent;

    // Hide all sections and show target
    sections.forEach(sec => sec.classList.add('hidden'));
    targetSection.classList.remove('hidden');

    closePanel();

    scrollToMenuTop();
    requestAnimationFrame(() => {
      scrollToMenuTop();
      requestAnimationFrame(scrollToMenuTop);
    });
  };

  categoryCards.forEach(card => {
    card.addEventListener('click', () => goToCategory(card));
  });

  // Modal Logic
  const modal = document.getElementById('product-modal');
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalClose = document.querySelector('.modal-close');
  const modalTitle = document.querySelector('.modal-title');
  const modalDesc = document.querySelector('.modal-desc');
  const modalPrice = document.querySelector('.modal-price');
  const modalImage = document.querySelector('.modal-image-placeholder');
  const modalOrderBtn = document.querySelector('.modal-order-btn');

  const openModal = (card) => {
    const nameEl = card.querySelector('.product-name');
    const descEl = card.querySelector('.product-desc');
    const priceEl = card.querySelector('.product-price');
    const imgPlaceholderEl = card.querySelector('.img-placeholder');
    const imgEl = card.querySelector('.product-image-element');

    const name = nameEl ? nameEl.childNodes[0].textContent.trim() : 'Producto';
    const desc = descEl ? descEl.textContent : '';
    const price = priceEl ? priceEl.textContent : '';

    modalTitle.textContent = name;
    modalDesc.textContent = desc;
    modalPrice.textContent = price;

    if (imgEl) {
      modalImage.innerHTML = `<img src="${imgEl.getAttribute('src')}" alt="${name}" class="modal-product-image">`;
    } else {
      modalImage.textContent = imgPlaceholderEl ? imgPlaceholderEl.textContent : '🍨';
    }

    // Update WhatsApp link text
    const message = encodeURIComponent(`Hola, quiero pedir un(a) ${name} 🍨`);
    modalOrderBtn.href = `https://wa.me/573225153616?text=${message}`;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  };

  document.querySelectorAll('.product-card').forEach(card => {
    // Add pointer cursor to indicate it's clickable
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => openModal(card));
  });

  modalClose.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', closeModal);

  // Close modal on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });

  // Payment Reminder Overlay Logic
  const paymentOverlay = document.getElementById('payment-reminder-overlay');
  const paymentCountdownSpan = document.getElementById('payment-countdown');
  
  if (paymentOverlay && paymentCountdownSpan) {
    let secondsLeft = 5;
    
    // Disable scrolling while overlay is active
    document.body.style.overflow = 'hidden';

    const interval = setInterval(() => {
      secondsLeft--;
      if (secondsLeft > 0) {
        paymentCountdownSpan.textContent = secondsLeft;
      } else {
        clearInterval(interval);
        paymentOverlay.classList.add('hidden');
        document.body.style.overflow = ''; // Restore scrolling
      }
    }, 1000);
  }
});
