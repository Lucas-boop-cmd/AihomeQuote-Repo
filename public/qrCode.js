document.addEventListener("DOMContentLoaded", function() {
  var currentUrl = window.location.href;
  console.log("DOMContentLoaded: Current URL is", currentUrl);

  // Function to generate QR code for an image element
  function generateQRCodeForElement(elementId) {
    var imgElem = document.getElementById(elementId);
    if (imgElem) {
      console.log(`Found element '${elementId}'. Generating QR code via toDataURL...`);
      QRCode.toDataURL(currentUrl, {
        margin: 1,
        width: 256,
        color: { dark: '#000000', light: '#FFFFFF' },
        errorCorrectionLevel: 'H'
      })
      .then(function(url) {
        console.log(`QRCode.toDataURL resolved for ${elementId}. Data URL (first 50 chars):`, url.substring(0,50) + "...");
        imgElem.src = url;
        imgElem.setAttribute("data-url", currentUrl);
        console.log(`QR Code for ${elementId} successfully updated with current URL:`, currentUrl);
      })
      .catch(function(err) {
        console.error(`Error generating QR code for '${elementId}':`, err);
      });
      return true;
    }
    return false;
  }

  // Try to generate QR codes for both elements
  var loGenerated = generateQRCodeForElement("qr-code-image");
  var realtorGenerated = generateQRCodeForElement("realtor-qr-code-image");
  
  // If neither element was found
  if (!loGenerated && !realtorGenerated) {
    // Fallback to div container if used
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
      console.log("QR Code (div container) successfully generated with current URL:", currentUrl);
      return;
    }
    
    console.error("No QR code container found (neither 'qr-code-image', 'realtor-qr-code-image', nor 'qrcode').");
  }
});