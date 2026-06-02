document.addEventListener('DOMContentLoaded', () => {
    // Elements to be animated
    const container = document.querySelector('.container');
    const musicContainer = document.querySelector('.music-container');

    // Array of elements for 3D animation
    const animatedElements = [container, musicContainer];

    // Define keyframes in JavaScript
    const styleSheet = document.createElement('style');
    styleSheet.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes moveUp {
            from {
                transform: translateY(0);
            }
            to {
                transform: translateY(-60px);
            }
        }
    `;
    document.head.appendChild(styleSheet);

    // Initial configurations for each element
    animatedElements.forEach(element => {
        if (element) {
            element.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
            element.style.zIndex = '1';
            element.style.position = 'relative';
            element.style.willChange = 'transform';
            element.style.backfaceVisibility = 'hidden';
            element.style.transformStyle = 'preserve-3d';
            element.style.opacity = '0'; // Initially invisible
        }
    });

    // Variables for 3D animation
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let rafId = null;
    
    // Variables to control animation state
    let containerYOffset = 0;
    let targetYOffset = 0;
    let currentYOffset = 0;

    function animateTransform() {
        // Smooth interpolation between current and target position
        currentX += (targetX - currentX) * 0.1;
        currentY += (targetY - currentY) * 0.1;
        currentYOffset += (targetYOffset - currentYOffset) * 0.05; // Smooth vertical movement
        
        // Apply transformation based on current state
        if (container) {
            // Combine vertical offset animation with 3D rotation
            container.style.transform = `perspective(1000px) translateY(${currentYOffset}px) rotateX(${currentY}deg) rotateY(${currentX}deg)`;
        }
        
        // For the music container, apply only the 3D rotation
        if (musicContainer && musicContainer.style.opacity === '1') {
            musicContainer.style.transform = `perspective(1000px) rotateX(${currentY}deg) rotateY(${currentX}deg)`;
        }
        
        // Keep animating always
        rafId = requestAnimationFrame(animateTransform);
    }

    // Start the animation immediately
    rafId = requestAnimationFrame(animateTransform);

    // Function to add movement event on an element
    function addMouseMoveEvent(element) {
        if (element) {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const offsetX = (x - centerX) / centerX;
                const offsetY = (y - centerY) / centerY;
                const intensity = 9;
                
                // Update target values
                targetX = offsetX * intensity;
                targetY = offsetY * intensity;
                
                // Preventing event propagation
                e.stopPropagation();
            });
        }
    }

    // Add movement events for each element
    animatedElements.forEach(addMouseMoveEvent);

    // Function to add mouse leave event
    function addMouseLeaveEvent(element) {
        if (element) {
            element.addEventListener('mouseleave', () => {
                // Return to initial rotation
                targetX = 0;
                targetY = 0;
            });
        }
    }

    // Add mouse leave events for each element
    animatedElements.forEach(addMouseLeaveEvent);

    // Add mouse enter events to prevent propagation
    animatedElements.forEach(element => {
        if (element) {
            element.addEventListener('mouseenter', (e) => {
                e.stopPropagation();
            });
        }
    });

    // Start animation sequence on click
    document.body.addEventListener('click', () => {
        // Fade in of the main container
        if (container) {
            container.style.animation = 'fadeIn 0.8s forwards';
            
            // When the fadeIn animation ends
            container.addEventListener('animationend', (e) => {
                if (e.animationName === 'fadeIn') {
                    // Remove the animation so it doesn't interfere with 3D transformation
                    container.style.animation = '';
                    container.style.opacity = '1';
                }
            }, { once: true });
        }

        // Add a delay for the music player fadeIn and main container moveUp
        setTimeout(() => {
            // Fade in of the music container
            if (musicContainer) {
                musicContainer.style.animation = 'fadeIn 0.8s forwards';
                
                // When the fadeIn animation ends
                musicContainer.addEventListener('animationend', (e) => {
                    if (e.animationName === 'fadeIn') {
                        // Remove the animation so it doesn't interfere with 3D transformation
                        musicContainer.style.animation = '';
                        musicContainer.style.opacity = '1';
                    }
                }, { once: true });
            }
            
            // Move up of the main container - now using our targetYOffset variable
            if (container) {
                // Definir o deslocamento alvo para -60px
                targetYOffset = -60;
                
                // We no longer need the CSS animation for moveUp,
                // since we now control the movement via JS animation
            }
        }, 2480);
    }, { once: true });
});