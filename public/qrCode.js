document.addEventListener("DOMContentLoaded", function() {
  // Get the current page URL (including paths and query parameters)
  var currentUrl = window.location.href;
  console.log("DOMContentLoaded: Current URL is", currentUrl);

  // If in QRcode.html: update the element with id "qrcode"
  var qrCodeDiv = document.getElementById("qrcode");
  if (qrCodeDiv) {
    console.log("Updating QRcode.html element with id 'qrcode'");
    new QRCode(qrCodeDiv, {
      text: currentUrl,
      width: 256,
      height: 256,
      colorDark: "#000",
      colorLight: "#fff",
      correctLevel: QRCode.CorrectLevel.H
    });
    console.log("QRcode.html successfully updated.");
  } else {
    console.log("Element with id 'qrcode' not found.");
  }

  // If in index.html: update the element with id "qr-code-image"
  var qrCodeImg = document.getElementById("qr-code-image");
  if (qrCodeImg) {
    console.log("Updating Index.html element with id 'qr-code-image'");
    QRCode.toDataURL(currentUrl, {
      margin: 1,
      width: 256,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'H'
    })
    .then(function(url) {
      console.log("QRCode.toDataURL resolved. Updating image source.");
      qrCodeImg.src = url;
      qrCodeImg.setAttribute('data-url', currentUrl);
      console.log("Index.html QR Code successfully updated with current URL:", currentUrl);
    })
    .catch(function(err) {
      console.error("Error generating QR code for Index.html:", err);
    });
  } else {
    console.log("Element with id 'qr-code-image' not found in Index.html.");
  }
});