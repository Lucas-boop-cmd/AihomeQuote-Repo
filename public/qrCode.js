document.addEventListener('DOMContentLoaded', function() {
    // Find the QR code image element
    const qrCodeImg = document.querySelector('img[alt="QR Code"]');
    
    if (qrCodeImg) {
        // Get the current URL including path
        const currentUrl = window.location.href;
        
        // Generate QR code using Google Charts API
        const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(currentUrl)}&chs=256x256&chld=L|0`;
        
        // Set the image source to the QR code URL
        qrCodeImg.src = qrCodeUrl;
        console.log('QR Code updated with current URL:', currentUrl);
    } else {
        console.error('QR Code image element not found');
    }
});
