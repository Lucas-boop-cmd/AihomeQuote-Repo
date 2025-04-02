document.addEventListener('DOMContentLoaded', function() {
    // Add qrcode.js script to the page
    const qrcodeScript = document.createElement('script');
    qrcodeScript.src = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';
    qrcodeScript.onload = initQRCode;
    qrcodeScript.onerror = () => console.error('Failed to load QR code library');
    document.head.appendChild(qrcodeScript);
    
    function initQRCode() {
        // Find the QR code image element
        const qrCodeImg = document.querySelector('img[alt="QR Code"]');
        
        if (qrCodeImg) {
            try {
                // Get the complete current URL including path and query parameters
                const currentUrl = window.location.href;
                
                // Generate QR code directly using qrcode.js
                QRCode.toDataURL(currentUrl, {
                    margin: 1,
                    width: 256,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    }
                })
                .then(url => {
                    qrCodeImg.src = url;
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
