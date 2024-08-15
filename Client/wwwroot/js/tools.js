window.captureMouseInput = function (dotNetHelper) {
    function sendMousePosition(e) {
        const x = e.clientX;
        const y = e.clientY;
        dotNetHelper.invokeMethodAsync('OnMouseMove', x, y);
    }

    document.addEventListener('mousemove', sendMousePosition);
    document.addEventListener('touchmove', function (e) {
        const touch = e.touches[0];
        sendMousePosition(touch);
    });
};

window.copyTextAndShake = function (text) {
        // Copy the text to the clipboard
        navigator.clipboard.writeText(text).then(function () {
            console.log('Password copied to clipboard');

            // Trigger the shake animation directly on the password box
            var passwordBox = document.getElementById('passwordBox');
            passwordBox.classList.add('shake');

            // Remove the shake class after the animation ends to reset
            setTimeout(function () {
                passwordBox.classList.remove('shake');
            }, 500); // The duration of the shake animation
        }, function (err) {
            console.error('Could not copy text: ', err);
        });
    }
