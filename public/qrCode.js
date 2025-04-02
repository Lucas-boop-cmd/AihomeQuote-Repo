document.addEventListener('DOMContentLoaded', function() {
    console.log("DOMContentLoaded event fired");
    
    if (!window.QRCode) {
        console.error("QRCode library not found.");
        return;
    }
    
    initQRCode();
    
    function initQRCode() {
        console.log("initQRCode started");
        const qrCodeImg = document.getElementById('qr-code-image') || document.querySelector('img[alt="QR Code"]');
        if (qrCodeImg) {
            try {
                const currentUrl = window.location.href;
                console.log('Generating QR code with full URL details:', currentUrl);
                console.log('About to call QRCode.toDataURL with currentUrl');
                QRCode.toDataURL(currentUrl, {
                    margin: 1,
                    width: 256,
                    color: {
                        dark: '#000000',
                        light: '#FFFFFF'
                    },
                    errorCorrectionLevel: 'H'
                })
                .then(url => {
                    console.log('QRCode.toDataURL resolved. Updating image source.');
                    qrCodeImg.src = url;
                    qrCodeImg.setAttribute('data-url', currentUrl);
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
