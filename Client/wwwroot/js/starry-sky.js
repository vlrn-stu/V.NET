let initialSidebarHeight = 0;
let constantStars = []; // Array to store constant stars
let hasUpdatedStars = false; // Flag to check if updateStars has already been called

// Function to initialize stars based on the initial size of the sidebar
function initializeStars() {
    const sidebar = document.querySelector('.sidebar');

    if (!sidebar) {
        console.error('Sidebar not found!');
        return;
    }

    // Clear existing stars (in case of resizing)
    clearStars();

    // Determine the number of stars based on the screen size
    const numberOfStars = window.innerWidth <= 768 ? 20 : 100;

    const minStarSize = 1; // Minimum star size in pixels
    const maxStarSize = 4; // Maximum star size in pixels
    const starRadius = 7; // Radius within which stars shouldn't cluster

    // Store the initial height of the sidebar for future reference
    initialSidebarHeight = sidebar.clientHeight;

    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const size = Math.random() * (maxStarSize - minStarSize) + minStarSize;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        let isValidPosition = false;
        let xPos, yPos;

        while (!isValidPosition) {
            xPos = Math.random() * sidebar.clientWidth;
            yPos = Math.random() * initialSidebarHeight; // Constrain stars to the initial height
            isValidPosition = true;

            for (let j = 0; j < constantStars.length; j++) {
                const otherStar = constantStars[j];
                const distance = Math.sqrt(
                    (xPos - otherStar.xPos) ** 2 + (yPos - otherStar.yPos) ** 2
                );

                if (distance < starRadius) {
                    isValidPosition = false;
                    break;
                }
            }
        }

        star.style.left = `${xPos}px`;
        star.style.top = `${yPos}px`;

        const twinkleDuration = Math.random() * 5 + 2; // Between 2 and 7 seconds
        star.style.animationDuration = `${twinkleDuration}s`;
        star.style.opacity = Math.random() * 0.5 + 0.5; // Between 0.5 and 1.0

        constantStars.push({ xPos, yPos, element: star }); // Store star position and element

        sidebar.appendChild(star);
    }
}

// Function to clear all stars from the sidebar
function clearStars() {
    const sidebar = document.querySelector('.sidebar');
    if (!sidebar) {
        console.error('Sidebar not found!');
        return;
    }

    // Remove only star elements from the sidebar
    const stars = sidebar.querySelectorAll('.star');
    stars.forEach(star => star.remove());

    // Clear the array of stars
    constantStars = [];
    hasUpdatedStars = false; // Reset the update flag
}

// Function to update stars based on the new size of the sidebar
function updateStars() {
    if (hasUpdatedStars) {
        return;
    }

    const sidebar = document.querySelector('.sidebar');

    if (!sidebar) {
        console.error('Sidebar not found!');
        return;
    }

    const newSidebarHeight = sidebar.clientHeight;
    if (newSidebarHeight <= initialSidebarHeight) {
        return;
    }

    const heightMultiplier = newSidebarHeight / initialSidebarHeight; // Calculate how much taller the sidebar is
    const additionalStars = Math.floor(20 * heightMultiplier); // Determine the number of new stars

    const minStarSize = 1; // Minimum star size in pixels
    const maxStarSize = 4; // Maximum star size in pixels
    const starRadius = 7; // Radius within which stars shouldn't cluster

    const newStars = [];

    for (let i = 0; i < additionalStars; i++) {
        const star = document.createElement('div');
        star.classList.add('star');

        const size = Math.random() * (maxStarSize - minStarSize) + minStarSize;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        let isValidPosition = false;
        let xPos, yPos;

        while (!isValidPosition) {
            xPos = Math.random() * sidebar.clientWidth;
            yPos = initialSidebarHeight + Math.random() * (newSidebarHeight - initialSidebarHeight); // Constrain stars to the new area
            isValidPosition = true;

            // Check against existing stars
            for (let j = 0; j < constantStars.length; j++) {
                const otherStar = constantStars[j];
                const distance = Math.sqrt(
                    (xPos - otherStar.xPos) ** 2 + (yPos - otherStar.yPos) ** 2
                );

                if (distance < starRadius) {
                    isValidPosition = false;
                    break;
                }
            }

            // Check against new stars
            for (let j = 0; j < newStars.length; j++) {
                const otherStar = newStars[j];
                const distance = Math.sqrt(
                    (xPos - otherStar.xPos) ** 2 + (yPos - otherStar.yPos) ** 2
                );

                if (distance < starRadius) {
                    isValidPosition = false;
                    break;
                }
            }
        }

        star.style.left = `${xPos}px`;
        star.style.top = `${yPos}px`;

        const twinkleDuration = Math.random() * 5 + 2; // Between 2 and 7 seconds
        star.style.animationDuration = `${twinkleDuration}s`;
        star.style.opacity = Math.random() * 0.5 + 0.5; // Between 0.5 and 1.0

        newStars.push({ xPos, yPos, element: star }); // Store star position and element

        sidebar.appendChild(star);
    }

    // Set the flag to true to prevent further updates
    hasUpdatedStars = true;
}

// Add an event listener to regenerate stars when the window is resized
window.addEventListener('resize', initializeStars);

// Initialize the stars when the window loads
window.onload = initializeStars;
