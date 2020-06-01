// UI VARS
// Menu
const menu = document.querySelector(".navbar__menu");
const menuEnter = document.querySelector(".navbar__btn-enter");
const menuClose = document.querySelector(".navbar__menu__btn-close");
const menuLinks = document.querySelectorAll(".navbar__menu__link");
const navbarFlags = document.querySelectorAll(".navbar__flag");
let menuOpened = false;
// Paralax
const parallaxElements = document.querySelectorAll(
  ".section__parallax, .section__parallax--img"
);
// Animate on scroll
const sections = document.querySelectorAll(".section__content");
const socials = document.querySelectorAll(".social__link");
const logo = document.querySelector(".secrion--hero, .section__parallax__logo");
const windowPadded = window.innerHeight * 1.1;
let scrollTop = 0;
// Form
const form = document.querySelector(".contact-form");
const clietInputs = document.querySelectorAll(
  ".contact-form__consignor__input__spot, .contact-form__message__textarea"
);

// EVENT LISTENERS
// Add click event listeners for menu buttons and links
menuEnter.addEventListener("click", openMenu);
menuClose.addEventListener("click", closeMenu);
[].forEach.call(menuLinks, function (el) {
  el.addEventListener("click", function (event) {
    event.stopPropagation();
    event.preventDefault();
    closeMenu();
    document
      .querySelector(
        `.section--${event.currentTarget
          .getAttribute("href")
          .substr(1)} .section__container`
      )
      .scrollIntoView({
        block: "start",
        behavior: "smooth",
      });
  });
});

// Add scroll event listener for window - Paralax
window.addEventListener("scroll", function () {
  scrollTop = document.documentElement.scrollTop;

  // Animate Socials and logo
  if (scrollTop > 0 && !logo.classList.contains("slide-in")) {
    logo.classList.add("slide-in");
    socials.forEach(function (el) {
      el.classList.add("slide-in");
    });
  }

  // Init Animate on scroll
  animateOnScroll();

  // Init parallax
  parallax();
});

// FUNCTIONS
// Menu
function openMenu() {
  if (menuOpened) {
    return;
  }
  menu.style.transform = "translateX(0)";
  menuOpened = true;
}

function closeMenu() {
  if (!menuOpened) {
    return;
  }
  menu.style.transform = "translateX(-100%)";
  menuOpened = false;
}

// Paralax
function parallax() {
  [].forEach.call(parallaxElements, function (el) {
    let offset = null;

    if (el.parentElement.classList.contains("section")) {
      offset = el.offsetTop;
    } else {
      offset =
        el.parentElement.parentElement.offsetTop +
        el.parentElement.parentElement.offsetHeight;
    }

    const newPos = ((scrollTop - offset) / 2) * 0.5;
    el.style.transform = `translateY(${newPos}px)`;
  });
}

// Animate on scroll
function animateOnScroll() {
  [].forEach.call(sections, function (el) {
    if (
      scrollTop > el.offsetTop &&
      scrollTop < el.offsetTop + el.offsetHeight
    ) {
      // Already animated?
      const animated = document.querySelector(`${el.className} .slide-in`);
      if (animated) {
        return;
      }

      // Animate all slide el in section
      const slides = el.querySelectorAll(".slide");
      [].forEach.call(slides, function (el) {
        el.classList.add("slide-in");
      });

      // Update navbar flags
      const elIndex = [].slice.call(sections).indexOf(el);
      if (!navbarFlags[elIndex].classList.contains("active")) {
        navbarFlags.forEach(function (el) {
          el.classList.remove("active");
        });
        navbarFlags[elIndex].classList.add("active");
      }
    }
  });
}

// Form validation
// Add event listeners on input elements
clietInputs.forEach(function (el) {
  el.addEventListener("input", function (event) {
    if (el.validity.valid) {
      // If its valid, clear error message...
      el.nextElementSibling.innerHTML = "";
      el.nextElementSibling.className = "error";
    } else {
      // ... or show error
      showError(el);
    }
  });
});

// Add event listener on submit button
form.addEventListener("submit", function (event) {
  clietInputs.forEach(function (el) {
    if (!el.validity.valid) {
      // Error handling
      showError(el);
      event.preventDefault();
    }
  });
});

// Show error function
function showError(el) {
  if (el.validity.valueMissing) {
    // Empty
    if (el.id == "message") {
      el.nextElementSibling.textContent =
        "Správa musí obsahovať aspoň 10 znakov!";
    } else {
      el.nextElementSibling.textContent = "Toto pole musí byť vyplnené!";
    }
  } else if (el.id == "email" && el.validity.typeMismatch) {
    // Incorect email value
    el.nextElementSibling.textContent =
      "Entered value needs to be an e-mail address.";
  } else if (el.id == "message" && el.validity.tooShort) {
    // Too short message
    el.nextElementSibling.textContent = `Ešte aspoň aspoň ${
      el.minLength - el.value.length
    } znakov.`;
  }

  // Set error styling
  el.nextElementSibling.className = "error active";
}
