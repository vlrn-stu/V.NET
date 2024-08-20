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

window.copyTextAndShake = function (text, elementId) {
    // Copy the text to the clipboard
    navigator.clipboard.writeText(text).then(function () {
        console.log('Text copied to clipboard');

        // Trigger the shake animation on the specified element
        var element = document.getElementById(elementId);
        if (element) {
            element.classList.add('shake');

            // Remove the shake class after the animation ends to reset
            setTimeout(function () {
                element.classList.remove('shake');
            }, 500); // The duration of the shake animation
        } else {
            console.error('Element with ID ' + elementId + ' not found.');
        }
    }, function (err) {
        console.error('Could not copy text: ', err);
    });
}

window.initializePaletteGenerator = function (dotNetHelper) {
    document.addEventListener('keydown', function (event) {
        if (event.code === 'Space') {
            event.preventDefault();
            dotNetHelper.invokeMethodAsync('GeneratePalette');
        }
    });
};

window.postUrl = async function (data) {
    try {
        const response = await fetch("https://valrina.com/s", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error("Failed to shorten URL");
        }

        const result = await response.json();
        return "https://valrina.com/s/" + result.shortCode;
    } catch (error) {
        console.error("Error shortening URL:", error);
        throw error;
    }
}

window.compressImage = async function (imageBytes, desiredSize) {
    return new Promise((resolve) => {
        const blob = new Blob([imageBytes]);
        const url = URL.createObjectURL(blob);
        const img = new Image();

        img.onload = function () {
            const canvas = document.createElement("canvas");
            const ctx = canvas.getContext("2d");

            // Set canvas dimensions to image dimensions
            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            let quality = 1.0;
            let compressedDataUrl;

            // Reduce quality until desired size is met
            do {
                compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
                quality -= 0.05;
            } while (compressedDataUrl.length / 1024 > desiredSize && quality > 0.1);

            resolve(compressedDataUrl);
        };

        img.src = url;
    });
};

window.downloadImage = function (dataUrl, filename) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

async function mergePdfs(pdfBytesList) {
    const { PDFDocument } = window.PDFLib;  // Correct access to pdf-lib

    // Create a new PDF document
    const mergedPdf = await PDFDocument.create();

    for (const pdfBytes of pdfBytesList) {
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());

        copiedPages.forEach(page => {
            mergedPdf.addPage(page);
        });
    }

    // Serialize the merged PDF document to bytes
    const mergedPdfBytes = await mergedPdf.save();

    // Trigger file download
    const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'merged.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

