// Text that will be displayed in <title>
const titleText = "@ash";
let index = 0;

// Function to animate the title
function typeTitle() {
    if (index < titleText.length) {
        // Updates the <title> with an additional letter
        document.title += titleText[index];
        index++;
        // Defines an interval for the next letter
        setTimeout(typeTitle, 300); // Adjust the time (in milliseconds) to control the speed
    } else {
        // Restarts the animation after a small delay
        setTimeout(() => {
            document.title = ""; // Clears the title
            index = 0; // Resets the index
            typeTitle(); // Starts again
        }, 2000); // Waits 2 seconds before restarting
    }
}

// Starts the animation when the page loads
typeTitle();

// Additional CSS that should be added to your CSS file
const additionalCSS = `
.timeline {
    position: relative;
    height: 6px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 3px;
    cursor: pointer;
    overflow: visible;
    transition: height 0.2s ease;
}

.timeline:hover {
    height: 8px;
}

.timeline-progress {
    height: 100%;
    background: linear-gradient(90deg, #ffffff, rgba(255, 255, 255, 0.8));
    border-radius: inherit;
    transition: all 0.3s ease;
    position: relative;
}

.timeline-thumb {
    position: absolute;
    top: 50%;
    right: -8px;
    width: 16px;
    height: 16px;
    background: #ffffff;
    border-radius: 50%;
    transform: translateY(-50%) scale(0);
    cursor: grab;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    z-index: 10;
}

.timeline-thumb:active {
    cursor: grabbing;
    transform: translateY(-50%) scale(1.2);
}

.timeline:hover .timeline-thumb {
    transform: translateY(-50%) scale(1);
}

.timeline-thumb.dragging {
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

/* Popup animation */
@keyframes popIn {
    0% {
        transform: translateY(-50%) scale(0);
    }
    50% {
        transform: translateY(-50%) scale(1.2);
    }
    100% {
        transform: translateY(-50%) scale(1);
    }
}

.timeline-thumb.pop-in {
    animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
`;

// Function to add the CSS
function addTimelineStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = additionalCSS;
    document.head.appendChild(styleElement);
}

// Main function to initialize the interactive timeline
function initializeInteractiveTimeline() {
    // Add styles
    addTimelineStyles();

    const timeline = document.querySelector('.timeline');
    const timelineProgress = document.querySelector('.timeline-progress');
    const audioPlayer = document.querySelector('.audioPlayer');
    const currentTimeSpan = document.querySelector('.current-time');
    const totalTimeSpan = document.querySelector('.total-time');

    if (!timeline || !timelineProgress || !audioPlayer) {
        console.error('Timeline elements not found');
        return;
    }

    // Create the thumb (dot)
    const thumb = document.createElement('div');
    thumb.className = 'timeline-thumb';
    timelineProgress.appendChild(thumb);

    // Control variables
    let isDragging = false;
    let hasInteracted = false;
    let animationFrame = null;

    // Function to format time
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Function to update the timeline position
    function updateTimeline() {
        if (!isDragging && audioPlayer.duration) {
            const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            timelineProgress.style.width = `${progress}%`;
            currentTimeSpan.textContent = formatTime(audioPlayer.currentTime);
        }

        if (!audioPlayer.paused) {
            animationFrame = requestAnimationFrame(updateTimeline);
        }
    }

    // Function to calculate position based on the mouse
    function getPositionFromEvent(e) {
        const rect = timeline.getBoundingClientRect();
        const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        let position = (clientX - rect.left) / rect.width;
        position = Math.max(0, Math.min(1, position)); // Clamp between 0 and 1
        return position;
    }

    // Function to set the audio time
    function setAudioTime(position) {
        if (audioPlayer.duration) {
            const newTime = position * audioPlayer.duration;
            audioPlayer.currentTime = newTime;
            timelineProgress.style.width = `${position * 100}%`;
            currentTimeSpan.textContent = formatTime(newTime);
        }
    }

    // Event listeners for hover
    timeline.addEventListener('mouseenter', () => {
        if (!hasInteracted) {
            thumb.classList.add('pop-in');
            hasInteracted = true;

            // Remove the class after animation
            setTimeout(() => {
                thumb.classList.remove('pop-in');
            }, 400);
        }
    });

    // Event listeners for timeline click
    timeline.addEventListener('click', (e) => {
        if (!isDragging) {
            const position = getPositionFromEvent(e);
            setAudioTime(position);
        }
    });

    // Event listeners for drag
    function startDrag(e) {
        isDragging = true;
        thumb.classList.add('dragging');
        document.body.style.userSelect = 'none';

        // Prevent default behavior
        e.preventDefault();

        // Set initial position
        const position = getPositionFromEvent(e);
        setAudioTime(position);
    }

    function drag(e) {
        if (!isDragging) return;

        e.preventDefault();
        const position = getPositionFromEvent(e);
        setAudioTime(position);
    }

    function endDrag() {
        if (!isDragging) return;

        isDragging = false;
        thumb.classList.remove('dragging');
        document.body.style.userSelect = '';

        // Resume automatic update if audio is playing
        if (!audioPlayer.paused) {
            animationFrame = requestAnimationFrame(updateTimeline);
        }
    }

    // Mouse events
    thumb.addEventListener('mousedown', startDrag);
    timeline.addEventListener('mousedown', (e) => {
        if (e.target === timeline || e.target === timelineProgress) {
            startDrag(e);
        }
    });

    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Touch events for mobile devices
    thumb.addEventListener('touchstart', startDrag, { passive: false });
    timeline.addEventListener('touchstart', (e) => {
        if (e.target === timeline || e.target === timelineProgress) {
            startDrag(e);
        }
    }, { passive: false });

    document.addEventListener('touchmove', drag, { passive: false });
    document.addEventListener('touchend', endDrag);

    // Audio event listeners
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalTimeSpan.textContent = formatTime(audioPlayer.duration);
    });

    audioPlayer.addEventListener('play', () => {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = requestAnimationFrame(updateTimeline);
    });

    audioPlayer.addEventListener('pause', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    });

    // Cleanup when page is closed
    window.addEventListener('beforeunload', () => {
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
        }
    });

    console.log('Interactive timeline initialized successfully!');
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeInteractiveTimeline);
} else {
    initializeInteractiveTimeline();
}