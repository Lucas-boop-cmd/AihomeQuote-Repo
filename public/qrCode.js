document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");
    
    // Add qrcode.js script to the page
    const qrcodeScript = document.createElement('script');
    qrcodeScript.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
    qrcodeScript.onload = () => {
        if (!window.QRCode) {
            console.error("QRCode library not found.");
            return;
        }
        initQRCode();
    };
    qrcodeScript.onerror = () => console.error('Failed to load QR code library');
    document.head.appendChild(qrcodeScript);
    
    function initQRCode() {
        console.log("initQRCode started");
        // Find the QR code image element - using ID for more reliable selection
        const qrCodeImg = document.getElementById('qr-code-image') || document.querySelector('img[alt="QR Code"]');
        
        if (qrCodeImg) {
            try {
                // Get the complete current URL including path and query parameters
                const currentUrl = window.location.href;
                
                // Log URL components to ensure we're capturing everything
                console.log('Generating QR code with full URL details:', currentUrl);
                
                // Generate QR code directly using qrcode.js
                QRCode.toDataURL(currentUrl, {
                    margin: 1,
                    width: 256,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    },
                    errorCorrectionLevel: 'H' // High error correction for better scanning
                })
                .then(url => {
                    qrCodeImg.src = url;
                    qrCodeImg.setAttribute('data-url', currentUrl); // Store URL for reference
                    console.log('QR Code successfully updated with current URL:', currentUrl);
                })
                .catch(err => {
                    console.error('Error generating QR code:', err);
                });
            } catch (error) {
                console.error('QR Code generation failed:', error);
            }
        } else {
            console.error('QR Code image element not found');
        }
    }
});
