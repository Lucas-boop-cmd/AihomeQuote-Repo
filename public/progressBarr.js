document.addEventListener("DOMContentLoaded", function () {
    // Simple progress tracking - no DOM inspection required
    let totalSlides = 5; // Default total slides
    let currentSlide = 1;
    
    // Update the progress bar
    function updateProgressBar() {
        const progressPercentage = (currentSlide / totalSlides) * 100;
        
        const progressBar = document.getElementById("progress-bar");
        const progressText = document.getElementById("progress-text");
        
        if (!progressBar || !progressText) {
            console.error("Progress bar elements not found in DOM.");
            return;
        }
        
        progressBar.style.width = progressPercentage + "%";
        progressText.textContent = `Step ${currentSlide} of ${totalSlides}`;
        console.log(`Progress updated: Step ${currentSlide} of ${totalSlides} (${progressPercentage}%)`);
        
        // Store current progress in sessionStorage for persistence
        sessionStorage.setItem('formProgress_currentSlide', currentSlide);
        sessionStorage.setItem('formProgress_totalSlides', totalSlides);
    }
    
    // Restore progress if available from session storage
    if (sessionStorage.getItem('formProgress_currentSlide')) {
        currentSlide = parseInt(sessionStorage.getItem('formProgress_currentSlide'), 10);
    }
    if (sessionStorage.getItem('formProgress_totalSlides')) {
        totalSlides = parseInt(sessionStorage.getItem('formProgress_totalSlides'), 10);
    }
    
    // Initialize progress bar
    updateProgressBar();
    
    // Create overlay elements to capture clicks on the iframe area
    function createOverlayButtons() {
        const formContainers = document.querySelectorAll('#realtor-form-container, #customer-form-container');
        
        formContainers.forEach(container => {
            // Left side overlay for back button
            const leftOverlay = document.createElement('div');
            leftOverlay.className = 'form-nav-overlay left-overlay';
            leftOverlay.style.cssText = 'position: absolute; left: 0; top: 50%; width: 80px; height: 80px; z-index: 9998; cursor: pointer; transform: translateY(-50%);';
            leftOverlay.title = 'Previous';
            leftOverlay.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentSlide > 1) {
                    currentSlide--;
                    updateProgressBar();
                }
            });
            
            // Right side overlay for next button
            const rightOverlay = document.createElement('div');
            rightOverlay.className = 'form-nav-overlay right-overlay';
            rightOverlay.style.cssText = 'position: absolute; right: 0; top: 50%; width: 80px; height: 80px; z-index: 9998; cursor: pointer; transform: translateY(-50%);';
            rightOverlay.title = 'Next';
            rightOverlay.addEventListener('click', function(e) {
                e.preventDefault();
                if (currentSlide < totalSlides) {
                    currentSlide++;
                    updateProgressBar();
                }
            });
            
            // Make container position relative
            container.style.position = 'relative';
            container.appendChild(leftOverlay);
            container.appendChild(rightOverlay);
        });
    }
    
    // Create keyboard event listeners for navigation
    function setupKeyboardNavigation() {
        document.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                if (currentSlide < totalSlides) {
                    currentSlide++;
                    updateProgressBar();
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                if (currentSlide > 1) {
                    currentSlide--;
                    updateProgressBar();
                }
            }
        });
    }
    
    // Document-level click listeners for manual navigation
    document.addEventListener('click', function(e) {
        // Detect clicks on form navigation buttons or elements that look like navigation
        const target = e.target;
        
        // Next/forward patterns
        if (target.matches('.ghl-footer-next-arrow') || 
            target.closest('.ghl-footer-next-arrow') ||
            (target.tagName === 'BUTTON' && 
             (target.textContent.toLowerCase().includes('next') || 
              target.textContent.toLowerCase().includes('continue') ||
              target.textContent.toLowerCase().includes('forward'))) ||
            target.classList.contains('next-button') ||
            target.classList.contains('form-next') ||
            target.closest('.next-button') ||
            target.closest('.form-next')) {
            
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateProgressBar();
            }
        }
        // Previous/back patterns
        else if (target.matches('.ghl-footer-back') || 
                 target.closest('.ghl-footer-back') ||
                 (target.tagName === 'BUTTON' && 
                  (target.textContent.toLowerCase().includes('back') || 
                   target.textContent.toLowerCase().includes('prev'))) ||
                 target.classList.contains('back-button') ||
                 target.classList.contains('form-back') ||
                 target.closest('.back-button') ||
                 target.closest('.form-back')) {
            
            if (currentSlide > 1) {
                currentSlide--;
                updateProgressBar();
            }
        }
        // Submit/finish patterns (set to 100%)
        else if ((target.tagName === 'BUTTON' && 
                 (target.textContent.toLowerCase().includes('submit') || 
                  target.textContent.toLowerCase().includes('finish') ||
                  target.textContent.toLowerCase().includes('complete'))) ||
                target.classList.contains('submit-button') ||
                target.closest('.submit-button')) {
            
            currentSlide = totalSlides;
            updateProgressBar();
        }
    });
    
    // Create button overlays after a short delay to ensure form containers are ready
    setTimeout(createOverlayButtons, 1000);
    setupKeyboardNavigation();
    
    // Check for completion status periodically
    setInterval(function() {
        const successMessages = document.querySelectorAll('.form-success, .success-message, .thank-you-message, .completion-message');
        if (successMessages.length > 0) {
            currentSlide = totalSlides;
            updateProgressBar();
        }
    }, 1000);
});