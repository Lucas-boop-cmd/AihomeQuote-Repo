document.addEventListener("DOMContentLoaded", function() {
  var currentUrl = window.location.href;
  console.log("DOMContentLoaded: Current URL is", currentUrl);

  // Prefer the image element for displaying QR code (used in index.html)
  var imgElem = document.getElementById("qr-code-image");
  if (imgElem) {
    console.log("Found element with id 'qr-code-image'. Generating QR code via toDataURL...");
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
      imgElem.src = url;
      imgElem.setAttribute("data-url", currentUrl);
      console.log("QR Code (index.html) successfully updated with current URL:", currentUrl);
    })
    .catch(function(err) {
      console.error("Error generating QR code for 'qr-code-image':", err);
    });
    return;
  }

  // Otherwise, if a div container is used (as in QRcode.html)
  var qrDiv = document.getElementById("qrcode");
  if (qrDiv) {
    console.log("Found element with id 'qrcode'. Generating QR code via new QRCode() constructor...");
    new QRCode(qrDiv, {
      text: currentUrl,
      width: 256,
      height: 256,
      colorDark: "#000",
      colorLight: "#fff",
      correctLevel: QRCode.CorrectLevel.H
    });
    console.log("QR Code (QRcode.html) successfully generated with current URL:", currentUrl);
    return;
  }

  console.error("No QR code container found (neither 'qr-code-image' nor 'qrcode').");
});