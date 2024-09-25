// mobile menu toggle
const burgerIcon = document.querySelector('#burger');
const navbarMenu = document.querySelector('#nav-links');

// Toggle the mobile menu (burger menu)
burgerIcon.addEventListener('click', () => {
  navbarMenu.classList.toggle('is-active');
});

// Toggle submenus on mobile
const dropdowns = document.querySelectorAll('.navbar-item.has-dropdown');

dropdowns.forEach(dropdown => {
  const dropdownLink = dropdown.querySelector('.navbar-link');
  
  dropdownLink.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default anchor behavior
    const isActive = dropdown.classList.toggle('is-active');
    
    // Update the aria-expanded attribute based on the dropdown's active state
    dropdownLink.setAttribute('aria-expanded', isActive ? 'true' : 'false');
  });
});
