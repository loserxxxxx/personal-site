// Function to create the lockscreen
function createLockscreen() {
  // Create lockscreen element
  const lockscreen = document.createElement('div');
  lockscreen.id = 'lockscreen';
  lockscreen.classList.add('lockscreen');
  
  // Apply properties for performance optimization
  lockscreen.style.willChange = 'opacity, transform';
  lockscreen.style.backfaceVisibility = 'hidden';
  lockscreen.style.transform = 'translateZ(0)'; // Forces hardware acceleration
  
  // Create internal content for the lockscreen
  const lockContent = document.createElement('div');
  lockContent.classList.add('lock-content');
  lockContent.style.willChange = 'transform, opacity';
  
  // Click text with smooth transition
  const clickText = document.createElement('div');
  clickText.classList.add('click-text');
  clickText.innerHTML = '[ click to unlock ]';
  clickText.style.willChange = 'opacity, transform';
  
  // Add soft pulse animation to text using CSS
  const pulseStyle = document.createElement('style');
  pulseStyle.textContent = `
      @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
      }
      .click-text {
          animation: pulse 1.5s infinite ease-in-out;
      }
  `;
  document.head.appendChild(pulseStyle);
  
  // Assemble structure
  lockContent.appendChild(clickText);
  lockscreen.appendChild(lockContent);
  
  // Add to body before any other content
  document.body.insertBefore(lockscreen, document.body.firstChild);
  
  // Hide the main content
  const container = document.getElementById('container');
  if (container) {
      container.style.opacity = '0';
      container.style.visibility = 'hidden';
      container.style.transition = 'opacity 0.8s cubic-bezier(0.215, 0.610, 0.355, 1.000), visibility 0s linear 0.8s';
      container.style.willChange = 'opacity';
  }
  
  // Ensure elements to be animated are initially hidden
  const elementsToAnimate = document.querySelectorAll('.elemento-para-animar');
  elementsToAnimate.forEach(element => {
      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.willChange = 'opacity, transform';
      // Ensure no automatic animation
      element.classList.remove('animate-fade-in');
  });
  
  // Click event to unlock
  let unlocked = false; // Flag to prevent multiple executions
  let unlockAnimation = null;
  
  lockscreen.addEventListener('click', () => {
      if (unlocked) return; // If already unlocked, do nothing
      unlocked = true; // Mark as unlocked
      
      // Stop the pulse animation by removing the class
      clickText.style.animation = 'none';
      
      // Animate lockscreen exit with CSS Transitions for better performance
      lockscreen.style.transition = 'opacity 500ms cubic-bezier(0.165, 0.84, 0.44, 1), transform 500ms cubic-bezier(0.165, 0.84, 0.44, 1)';
      lockscreen.style.opacity = '0';
      lockscreen.style.transform = 'scale(1.1) translateZ(0)';
      
      // Show main content with fade after the transition
      setTimeout(() => {
          if (container) {
              container.style.visibility = 'visible';
              container.style.opacity = '1';
              container.style.transition = 'opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
          }
          
          // Run animation of elements after unlocking
          setTimeout(() => {
              animateElementsSequentially();
          }, 200);
          
          // Remove lockscreen after completing the animation
          setTimeout(() => {
              lockscreen.remove();
          }, 800);
      }, 500);
  });
}

// Animate elements with class "elemento-para-animar" using CSS Transitions
function animateElementsSequentially() {
  const elements = document.querySelectorAll('.elemento-para-animar');
  
  elements.forEach((element) => {
      // Check if there is a delay class (e.g. .delay-10, .delay-20)
      const delayClass = Array.from(element.classList).find(cls => cls.startsWith('delay-'));
      let delay = 0;
      
      if (delayClass) {
          // Extract the number from the class (e.g., "delay-20" -> 20 -> 2000ms)
          const delayValue = parseInt(delayClass.replace('delay-', ''), 10);
          delay = delayValue * 100; // Convert to ms (e.g., 20 -> 200ms)
      } else if (element.dataset.delay) {
          // If there is no class, check the data-delay attribute (e.g. data-delay="300")
          delay = parseInt(element.dataset.delay, 10);
      }
      
      setTimeout(() => {
          // Apply CSS transition instead of frame-by-frame animation
          element.style.transition = 'opacity 500ms cubic-bezier(0.4, 0, 0.2, 1), transform 500ms cubic-bezier(0.4, 0, 0.2, 1)';
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
          
          // Remove willChange after the transition to free resources
          setTimeout(() => {
              element.style.willChange = 'auto';
          }, 500);
      }, delay);
  });
}

// Execute when the document is ready
document.addEventListener('DOMContentLoaded', () => {
  createLockscreen();
  
  // Pre-processing to prepare future animations
  const elementsToAnimate = document.querySelectorAll('.elemento-para-animar');
  if (elementsToAnimate.length > 0) {
      // Inform the browser that these elements will be animated soon
      elementsToAnimate.forEach(element => {
          if ('IntersectionObserver' in window) {
              const observer = new IntersectionObserver((entries) => {
                  entries.forEach(entry => {
                      if (entry.isIntersecting) {
                          // Prepare element when close to the viewport
                          entry.target.style.willChange = 'opacity, transform';
                          observer.unobserve(entry.target);
                      }
                  });
              });
              observer.observe(element);
          }
      });
  }
});
