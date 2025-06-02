// script1.js
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const navItems = document.querySelectorAll('#side_nav li a');
    const mobileNavItems = document.querySelectorAll('#mobile-menu li a');
    const projectCards = document.querySelectorAll('.card');
    const sections = document.querySelectorAll('section');
    
  // Mobile menu toggle
  hamburger.addEventListener('click', () => {
    mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
}); 
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (mobileMenu.style.display === 'block' && !mobileMenu.contains(e.target)) {
            mobileMenu.style.display = 'none';
        }
    });
    
    // Add active class to nav items when scrolling
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if(window.pageYOffset >= (sectionTop - sectionHeight/3)) {
                current = section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if(item.getAttribute('href').includes(current)) {
                item.classList.add('active');
            }
        });
    });
    
    // Smooth scroll for navigation (both side and mobile)
    const allNavItems = [...navItems, ...mobileNavItems];
    
    allNavItems.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
            
            // Close mobile menu after clicking
            if(mobileMenu.style.display === 'block') {
                mobileMenu.style.display = 'none';
            }
        });
    });
    
    // Reveal animations when scrolling
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, {threshold: 0.1});
    
    document.querySelectorAll('.square, .card, #Textmain4, #Textmain5').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });
    
    // Project cards animation for mobile
    const projectTitles = document.querySelectorAll('.project-title');
    
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Make project titles always visible on mobile
        projectTitles.forEach(title => {
            title.style.transform = 'translateY(0)';
        });
    }
    
    // Recalculate on window resize
    window.addEventListener('resize', () => {
        const isMobileNow = window.innerWidth <= 768;
        
        projectTitles.forEach(title => {
            if (isMobileNow) {
                title.style.transform = 'translateY(0)';
            } else {
                title.style.transform = '';
            }
        });
    });
    // Check screen size on load and resize
    function checkScreenSize() {
        const mobileBreakpoint = 768;
        const navWrapper = document.querySelector('.nav__wrapper');
        const hamburgerMenu = document.getElementById('hamburger');
        const line = document.querySelector('.line');
        
        if (window.innerWidth <= mobileBreakpoint) {
            // Mobile view
            if (navWrapper) navWrapper.style.display = 'none';
            if (hamburgerMenu) hamburgerMenu.style.display = 'flex';
            if (line) line.style.display = 'none';
        } else {
            // Desktop view
            if (navWrapper) navWrapper.style.display = 'block';
            if (hamburgerMenu) hamburgerMenu.style.display = 'none';
            if (line) line.style.display = 'block';
            
            // Hide mobile menu if it was open
            if (mobileMenu) mobileMenu.style.display = 'none';
        }
    }
    
    // Initial check
    checkScreenSize();
    
    // Check on window resize
    window.addEventListener('resize', checkScreenSize);
});
