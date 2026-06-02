// // Function to apply animations with increasing delay
// function applySequentialAnimations() {
//     // Select all elements to animate
//     const elements = document.querySelectorAll('.elemento-para-animar');
    
//     // Define the time interval between each element (in seconds)
//     const intervalBetweenElements = 0.15; // 150ms between each element
    
//     // Applies the animation with the increasing delay for each element
//     elements.forEach((element, index) => {
//       // Calculates the delay based on the index of the element
//       const delay = index * intervalBetweenElements;
      
//       // Applies the animation with the calculated delay
//       element.style.animationDelay = `${delay}s`;
//       element.classList.add('animate-fade-in');
//     });
//   }
  
//   // Executes when the DOM is loaded
//   document.addEventListener('DOMContentLoaded', applySequentialAnimations);

//   // Advanced configuration with IntersectionObserver to animate elements as they appear
// function setupSequentialAnimations() {
//     // Configures the animation options
//     const options = {
//       baseDelay: 0.1, // Base delay in seconds
//       incrementDelay: 0.15, // Delay increment between elements in the same section
//       threshold: 0.1 // How much of the element needs to be visible to activate
//     };
  
//     // Get all animation groups (can be different sections)
//     const animationGroups = document.querySelectorAll('.animation-group');
    
//     animationGroups.forEach(group => {
//       // Elements to be animated inside this group
//       const elements = group.querySelectorAll('.elemento-para-animar');
      
//       // Creates an observer for this group
//       const observer = new IntersectionObserver((entries) => {
//         // Counter for visible elements in this group
//         let visibleCount = 0;
        
//         entries.forEach(entry => {
//           if (entry.isIntersecting) {
//             // Calculates the delay based on the order of appearance
//             const delay = options.baseDelay + (visibleCount * options.incrementDelay);
            
//             // Applies the animation
//             entry.target.style.animationDelay = `${delay}s`;
//             entry.target.classList.add('animate-fade-in');
            
//             // Increments the visible elements counter
//             visibleCount++;
            
//             // Stops observing the element after animating it
//             observer.unobserve(entry.target);
//           }
//         });
//       }, {
//         threshold: options.threshold
//       });
      
//       // Observes each element of the group
//       elements.forEach(element => {
//         observer.observe(element);
//       });
//     });
//   }
  
//   document.addEventListener('DOMContentLoaded', setupSequentialAnimations);