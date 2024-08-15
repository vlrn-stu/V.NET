if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(registration => {
            registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                        if (navigator.serviceWorker.controller) {
                            // New content is available; notify the user or refresh the page.
                            console.log('New version available. Refreshing page.');
                            window.location.reload();
                        } else {
                            console.log('Content is cached for offline use.');
                        }
                    }
                };
            };
        })
        .catch(error => {
            console.log('Service Worker registration failed:', error);
        });

    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
    });
}
