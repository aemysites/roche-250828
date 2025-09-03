import {
  createOptimizedPicture,
  decorateIcons,
  fetchPlaceholders,
  getMetadata,
} from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia('(min-width: 1025px)');

function closeOnEscape(e) {
  if (e.code === 'Escape') {
    const nav = document.getElementById('nav');
    const navSections = nav.querySelector('.nav-sections');
    const navSectionExpanded = navSections.querySelector('[aria-expanded="true"]');
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector('button').focus();
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === 'nav-drop';
  if (isNavDrop && (e.code === 'Enter' || e.code === 'Space')) {
    const dropExpanded = focused.getAttribute('aria-expanded') === 'true';
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest('.nav-sections'));
    focused.setAttribute('aria-expanded', dropExpanded ? 'false' : 'true');
  }
}

function focusNavSection() {
  document.activeElement.addEventListener('keydown', openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections.querySelectorAll('.nav-sections .nav-drop').forEach((section) => {
    section.setAttribute('aria-expanded', expanded);
  });
}

/**
 * Toggles other nav sections
 * @param {Element} sections The container element
 * @param exception
 */
function closeOtherNavSections(sections, exception) {
  sections.querySelectorAll('.nav-sections .nav-drop').forEach((section) => {
    if (section !== exception && !section.contains(exception)) {
      section.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Processes sections with metadata to organize them by placement
 * @param {Element} nav The nav element containing all sections
 * @returns {Object} Object with topSections, mainSections, and bottomSections arrays
 */
function processSectionsWithMetadata(nav) {
  return Array.from(nav.children).reduce((acc, section) => {
    const placement = ['top', 'bottom'].find((pos) => section.classList.contains(pos)) || 'main';

    acc[`${placement}Sections`].push(section);
    return acc;
  }, { topSections: [], mainSections: [], bottomSections: [] });
}

function closeSearch(navSearch) {
  navSearch.classList.remove('expanded');
  navSearch.setAttribute('aria-expanded', 'false');
  document.body.style.overflowY = '';
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded = forceExpanded !== null ? !forceExpanded : nav.getAttribute('aria-expanded') === 'true';
  const button = nav.querySelector('.nav-hamburger button');
  nav.setAttribute('aria-expanded', expanded ? 'false' : 'true');
  if (expanded) {
    toggleAllNavSections(navSections, 'false');
  } else {
    closeSearch(nav.querySelector('.nav-search'));
  }
  document.body.style.overflowY = expanded ? '' : 'hidden';
  button.setAttribute('aria-label', expanded ? 'Open navigation' : 'Close navigation');
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll('.nav-drop > p .nav-link');
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute('tabindex')) {
        drop.setAttribute('tabindex', 0);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute('tabindex');
      drop.removeEventListener('focus', focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

function buildHamburger(nav, navSections, placeholders) {
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <div class="nav-hamburger-icon">
        <div class="nav-hamburger-icon__start nav-hamburger-icon__stroke"></div>
        <div class="nav-hamburger-icon__mid nav-hamburger-icon__stroke"></div>
        <div class="nav-hamburger-icon__end nav-hamburger-icon__stroke"></div>
      </div>
      <div class="nav-close-icon">
        <div class="nav-close-icon__cross"></div>
      </div>
      <span class="nav-hamburger__label">${placeholders.navigationHamburgerLabel || 'Menu'}</span>
    </button>`;
  hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  return hamburger;
}

function buildClose(placeholders) {
  const close = document.createElement('div');
  close.classList.add('nav-close');
  close.innerHTML = `<button type="button" aria-controls="nav" aria-label="Close navigation">
      <div class="nav-close-icon">
        <div class="nav-close-icon__cross"></div>
      </div>
      <span class="nav-close__label">${placeholders.navigationHamburgerLabel || 'Menu'}</span>
    </button>`;
  return close;
}

function toggleCustomizationPanel(nav, navSections, panel, skipMenu = false) {
  if (window.location.hash === '#customize') {
    if (!skipMenu) {
      toggleMenu(nav, navSections, false);
    }
    panel.setAttribute('aria-expanded', 'true');
    document.body.style.overflowY = 'hidden';
  } else {
    panel.setAttribute('aria-expanded', 'false');
    document.body.style.overflowY = '';
  }
}

function closeCustomizationPanel(nav, navSections, panel) {
  const noHashURL = window.location.href.replace(/#.*$/, '');
  window.history.replaceState('', document.title, noHashURL);
  toggleCustomizationPanel(nav, navSections, panel);
}

function buildCustomizationPanel(nav, navSections, placeholders) {
  const panel = document.createElement('div');
  panel.classList.add('nav-customization-panel');

  const closeButton = buildClose(placeholders);
  closeButton.classList.add('nav-customization-panel__close');
  panel.append(closeButton);
  closeButton.addEventListener('click', () => {
    closeCustomizationPanel(nav, navSections, panel);
  });

  const title = document.createElement('div');
  title.classList.add('nav-customization-panel__title');
  const span = document.createElement('span');
  span.textContent = placeholders.customizationMenuTitle;
  title.append(span);
  panel.append(title);

  const img = createOptimizedPicture('/icons/custom.svg');
  img.classList.add('nav-customization-panel__img');
  panel.append(img);

  window.addEventListener('hashchange', () => {
    toggleCustomizationPanel(nav, navSections, panel);
  });

  toggleCustomizationPanel(nav, navSections, panel, true);

  return panel;
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/global-nav';
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.classList.add('nav');
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const placeholders = await fetchPlaceholders();

  const { topSections, mainSections, bottomSections } = processSectionsWithMetadata(nav);
  nav.replaceChildren(...mainSections);

  const classes = ['brand', 'sections', 'secondary-menu', 'search'];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  // create containers for extra sections
  const createContainer = (sections, containerClass, sectionClass) => {
    const container = document.createElement('div');
    container.className = containerClass;
    sections.forEach((section) => {
      section.classList.add(sectionClass);
      container.append(section);
    });
    return container;
  };

  const topContainer = createContainer(topSections, 'nav-top-container', 'nav-top-section');
  const bottomContainer = createContainer(bottomSections, 'nav-bottom-container', 'nav-bottom-section');

  const navBrand = nav.querySelector('.nav-brand');
  const brandLinks = navBrand.querySelectorAll('.button');
  brandLinks.forEach((brandLink, i) => {
    brandLink.className = '';
    brandLink.closest('.button-container').className = '';

    if (i === 0) {
      brandLink.classList.add('nav-top-bar__primary-logo');
    } else if (i === 1) {
      brandLink.classList.add('nav-top-bar__secondary-logo');
    }
  });

  const navSections = nav.querySelector('.nav-sections');
  if (navSections) {
    navSections.querySelectorAll('a').forEach((link) => {
      link.classList.remove('button');
      if (link.closest('.button-container')) {
        link.closest('.button-container').className = '';
      }
    });

    const getAllTextNodes = (element) => Array.from(element.childNodes)
      .filter((node) => node.nodeType === 3 && node.textContent.trim().length > 1);

    const handleMenus = (parent, nested = false) => {
      parent.querySelectorAll(':scope > ul > li').forEach((item) => {
        const submenu = item.querySelector('ul');
        const link = item.querySelector('a');
        const text = document.createElement('span');
        text.classList.add('nav-link__text');
        text.append(...getAllTextNodes(link));
        link.append(text);
        link.classList.add('nav-link');

        if (nested) {
          item.classList.add('nav-nested');
        } else {
          item.classList.add('nav-root-item');
        }

        if (submenu) {
          submenu.classList.add('nav-submenu');
          item.classList.add('nav-drop');

          link.addEventListener('click', (event) => {
            event.preventDefault();
            const expanded = item.getAttribute('aria-expanded') === 'true';

            if (!expanded) {
              closeOtherNavSections(navSections, item);
            }

            item.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          });

          handleMenus(item, true);
        }
      });
    };

    handleMenus(navSections.querySelector(':scope .default-content-wrapper'));
  }

  nav.setAttribute('aria-expanded', 'false');

  const navMenu = document.createElement('div');
  navMenu.classList.add('nav-menu');
  const navSecondaryMenu = nav.querySelector('.nav-secondary-menu');
  const closeButton = buildClose(placeholders);
  closeButton.addEventListener('click', () => toggleMenu(nav, navSections, false));
  navMenu.append(closeButton, navSections, navSecondaryMenu);

  // Search for mobile
  const navSearch = nav.querySelector('.nav-search');
  const searchTrigger = document.createElement('div');
  searchTrigger.classList.add('nav-search-trigger');
  searchTrigger.innerHTML = `<button type="button">
      <span class="icon icon-search-white"></span>
    </button>`;
  decorateIcons(searchTrigger);
  searchTrigger.addEventListener('click', () => {
    if (navSearch.getAttribute('aria-expanded') === 'true') {
      closeSearch(navSearch);
    } else {
      navSearch.classList.add('expanded');
      navSearch.setAttribute('aria-expanded', 'true');
      document.body.style.overflowY = 'hidden';
      toggleMenu(nav, navSections, false);
    }
  });
  isDesktop.addEventListener('change', () => {
    closeSearch(navSearch);
  });

  const sideBar = document.createElement('div');
  sideBar.classList.add('nav-sidebar');
  sideBar.innerHTML = `<svg class="nav-sidebar__accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 5 777" width="5" height="777">
      <path d="M2.4 391L0 397.3l3 33-.6-39.3zM.2 290.2C1.6 320.4 2.4 378.1 5 379l-2.3-54.5c1.9-7.6 1.8-43.5 1.2-75.2l.1 36c-.3-9.3-1.5-3.4-1.7-12.6 1-55-1.7-69.1.4-120l.2 2.9-1.2-40.1c.3-12.6 1.2-7.6 1.5-3.6C2.2 76 1.1 48.8 1.2.3-2.3 37.9 3.9 106.7.4 144.1l-.2-2.8c1.3 47-.9 101.4 0 148.9zm0 438.1C1.6 758.5 2.4 816.1 5 817l-2.3-54.5c1.9-7.6 1.8-43.5 1.2-75.2l.1 36c-.3-9.3-1.5-3.4-1.7-12.6 1-55-1.7-69.1.4-120l.2 2.9-1.2-40.1c.3-12.6 1.2-7.6 1.5-3.6-1-35.8-2.1-62.9-2-111.4C-2.3 476 3.9 544.8.4 582.2l-.2-2.8c1.3 46.9-.9 101.3 0 148.9z" fill="#ffd336"></path>
    </svg>`;
  const sideNavHamburger = buildHamburger(nav, navSections, placeholders);
  sideBar.prepend(sideNavHamburger);

  const sidebarLogo = createOptimizedPicture('../../icons/logo-sep-blanc.svg', '');
  const sidebarLogoLink = document.createElement('a');
  sidebarLogoLink.classList.add('nav-sidebar__logo');
  sidebarLogoLink.href = '/';
  sidebarLogoLink.append(sidebarLogo);
  sideBar.prepend(sidebarLogoLink);

  const navTop = document.createElement('div');
  navTop.classList.add('nav-top-bar');
  navTop.append(navBrand.querySelector('.nav-top-bar__primary-logo'), nav.querySelector('.nav-search'), navBrand.querySelector('.nav-top-bar__secondary-logo'));
  navBrand.remove();

  const customizationPanel = buildCustomizationPanel(nav, navSections, placeholders);

  const navPanelOverlay = document.createElement('div');
  navPanelOverlay.classList.add('nav-panel-overlay');
  navPanelOverlay.addEventListener('click', () => {
    toggleMenu(nav, navSections, false);
    closeCustomizationPanel(nav, navSections, customizationPanel);
  });

  nav.prepend(navMenu);
  nav.prepend(sideBar);
  nav.append(navTop);
  nav.append(searchTrigger);
  nav.append(customizationPanel);
  nav.append(navPanelOverlay);

  const intersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        sidebarLogoLink.classList.add('show');
      } else {
        sidebarLogoLink.classList.remove('show');
      }
    });
  });
  intersectionObserver.observe(navTop);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(topContainer, nav, bottomContainer);
  block.append(navWrapper);
}
