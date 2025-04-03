document.addEventListener("DOMContentLoaded", function() {
  var currentUrl = window.location.href;
  console.log("DOMContentLoaded: Current URL is", currentUrl);

  // Prefer the image element for displaying the QR code
  var imgElem = document.getElementById("qr-code-image");
  if (imgElem) {
    console.log("Found element 'qr-code-image'. Generating QR code via toDataURL...");
    QRCode.toDataURL(currentUrl, {
      margin: 1,
      width: 256,
      color: { dark: '#000000', light: '#FFFFFF' },
      errorCorrectionLevel: 'H'
    })
    .then(function(url) {
      console.log("QRCode.toDataURL resolved. Data URL (first 50 chars):", url.substring(0,50) + "...");
      imgElem.src = url;
      imgElem.setAttribute("data-url", currentUrl);
      console.log("QR Code (index.html) successfully updated with current URL:", currentUrl);
      console.log("Updated img element src attribute:", imgElem.src);
    })
    .catch(function(err) {
      console.error("Error generating QR code for 'qr-code-image':", err);
    });
    return;
  }

  // Otherwise, if a div container is used (as in QRcode.html)
  var qrDiv = document.getElementById("qrcode");
  if (qrDiv) {
    console.log("Found element 'qrcode'. Generating QR code using new QRCode() constructor...");
    new QRCode(qrDiv, {
      text: currentUrl,
      width: 40,
      height: 40,
      colorDark: "#000",
      colorLight: "#fff",
      correctLevel: QRCode.CorrectLevel.H
    });
    console.log("QR Code (QRcode.html) successfully generated with current URL:", currentUrl);
    return;
  }

  console.error("No QR code container found (neither 'qr-code-image' nor 'qrcode').");
});