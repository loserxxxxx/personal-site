function updateDiscordProfile(userId) {
    // If no userId is specified, use ash's ID by default
    const targetUserId = userId || '1182402282466332724';

    // URL updated to point to the specific user's endpoint using Lanyard REST API
    fetch(`https://api.lanyard.rest/v1/users/${targetUserId}`)
        .then(response => response.json())
        .then(res => {
            if (!res.success) {
                console.error('Lanyard API error:', res.error);
                return;
            }
            const data = res.data;

            // Update the profile picture (if available)
            const avatarImg = document.querySelector('.avatarImage');
            if (avatarImg && data.discord_user && data.discord_user.avatar) {
                const avatarHash = data.discord_user.avatar;
                const isAnimated = avatarHash.startsWith('a_');
                const avatarUrl = `https://cdn.discordapp.com/avatars/${targetUserId}/${avatarHash}${isAnimated ? '.gif' : '.png'}?size=512`;
                
                // Add a timestamp parameter to avoid caching
                const avatarSrc = avatarUrl + '&t=' + Date.now();

                avatarImg.src = avatarSrc;
                console.log(`User ${targetUserId} avatar updated:`, avatarSrc);
            } else if (avatarImg && data.discord_user) {
                // Default avatar index calculation
                const defaultAvatarIndex = Number((BigInt(targetUserId) >> 22n) % 6n);
                const avatarSrc = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarIndex}.png`;
                avatarImg.src = avatarSrc;
                console.log(`User ${targetUserId} default avatar set:`, avatarSrc);
            }

            // Update the status
            const statusImg = document.querySelector('.discordStatus');
            if (statusImg && data.discord_status) {
                // Use the correct image path based on status
                switch (data.discord_status) {
                    case 'online': statusImg.src = '/img/online.png'; break;
                    case 'idle': statusImg.src = '/img/idle.png'; break;
                    case 'dnd': statusImg.src = '/img/dnd.png'; break;
                    default: statusImg.src = '/img/offline.png';
                }
                console.log(`User ${targetUserId} status updated to:`, data.discord_status);
            } else if (!statusImg) {
                console.error('Element .discordStatus not found in DOM');
            }

            // If you want to show the username as well
            const usernameElement = document.querySelector('.username');
            if (usernameElement && data.discord_user && data.discord_user.username) {
                usernameElement.textContent = data.discord_user.username;
            }
        })
        .catch(error => {
            console.error('Error fetching status:', error);
            // Add more visible error handling for debugging
            const statusElement = document.querySelector('.status-debugging');
            if (statusElement) {
                statusElement.textContent = 'Error connecting: ' + error.message;
                statusElement.style.color = 'red';
            }
        });
}

// Determine which user to monitor based on the page
function determinePageUser() {
    // You can use different methods to determine which user to display
    // For example, based on the URL or some element on the page

    // Example: check if we are on the specific page of your profile
    const currentPath = window.location.pathname;
    if (currentPath.includes('meuperfil') || currentPath.includes('perfil2')) {
        // Your user ID
        return '682694935631233203';
    }

    // By default, return ash's ID
    return '1182402282466332724';
}

// Force complete update when the document loads
document.addEventListener('DOMContentLoaded', function () {
    // Clear any image cache that might exist
    const avatarImg = document.querySelector('.avatarImage');
    if (avatarImg) {
        avatarImg.src = '';
    }

    // Determine which user to monitor
    const userId = determinePageUser();

    // Call update function
    updateDiscordProfile(userId);

    // Call the function periodically to keep it updated
    setInterval(() => updateDiscordProfile(userId), 5000); // 5sec
});

// Add manual click event to force update
const avatarImg = document.querySelector('.avatarImage');
if (avatarImg) {
    avatarImg.addEventListener('click', function () {
        console.log('Updating avatar manually...');
        const userId = determinePageUser();
        updateDiscordProfile(userId);
    });
}
