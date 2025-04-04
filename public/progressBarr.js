document.addEventListener("DOMContentLoaded", function () {
    // Initial values
    let currentSlide = 1;
    let totalSlides = 5; // Default total slides
    
    function updateProgressBar() {
        let progressPercentage = (currentSlide / totalSlides) * 100;
        
        let progressBar = document.getElementById("progress-bar");
        let progressText = document.getElementById("progress-text");
        
        if (progressBar && progressText) {
            progressBar.style.width = progressPercentage + "%";
            progressText.textContent = `Step ${currentSlide} of ${totalSlides}`;
            console.log(`Progress updated: Step ${currentSlide} of ${totalSlides} (${progressPercentage}%)`);
        }
    }
    
    // Run the function initially
    updateProgressBar();

    // Simple event delegation for the entire document
    document.addEventListener("click", function (event) {
        // Check if the clicked element or any of its parents has the class "ghl-footer-next-arrow"
        if (event.target.matches(".ghl-footer-next-arrow") || 
            event.target.closest(".ghl-footer-next-arrow")) {
            console.log("Next button clicked");
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateProgressBar();
            }
        }
        // Check if the clicked element or any of its parents has the class "ghl-footer-back"
        else if (event.target.matches(".ghl-footer-back") || 
                 event.target.closest(".ghl-footer-back")) {
            console.log("Back button clicked");
            if (currentSlide > 1) {
                currentSlide--;
                updateProgressBar();
            }
        }
    });

    // Additional listener for iframe contents using postMessage
    window.addEventListener("message", function(event) {
        if (event.data && event.data.action) {
            if (event.data.action === "next" && currentSlide < totalSlides) {
                currentSlide++;
                updateProgressBar();
            } else if (event.data.action === "back" && currentSlide > 1) {
                currentSlide--;
                updateProgressBar();
            } else if (event.data.action === "setTotal" && event.data.total) {
                totalSlides = event.data.total;
                updateProgressBar();
            }
        }
    });
});