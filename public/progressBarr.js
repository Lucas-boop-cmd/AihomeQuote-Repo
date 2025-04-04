document.addEventListener("DOMContentLoaded", function () {
    console.log("🔍 progressBarr.js loaded, DOM ready");
    
    // Simple progress tracking - no DOM inspection required
    let totalSlides = 5; // Default total slides
    let currentSlide = 1;
    
    // Check if progress bar elements exist
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");
    
    if (!progressBar) {
        console.error("❌ Progress bar element not found! Looking for id='progress-bar'");
    } else {
        console.log("✅ Found progress-bar element:", progressBar);
    }
    
    if (!progressText) {
        console.error("❌ Progress text element not found! Looking for id='progress-text'");
    } else {
        console.log("✅ Found progress-text element:", progressText);
    }
    
    // Update the progress bar with visual debugging
    function updateProgressBar() {
        console.log("⏩ updateProgressBar() called with currentSlide =", currentSlide, "totalSlides =", totalSlides);
        
        const progressPercentage = (currentSlide / totalSlides) * 100;
        
        const progressBar = document.getElementById("progress-bar");
        const progressText = document.getElementById("progress-text");
        
        if (!progressBar || !progressText) {
            console.error("❌ Progress bar elements not found when updating. Progress bar exists:", !!progressBar, "Progress text exists:", !!progressText);
            return;
        }
        
        // Visual feedback in console
        let progressVisual = "[";
        for (let i = 0; i < totalSlides; i++) {
            progressVisual += i < currentSlide ? "■" : "□";
        }
        progressVisual += "]";
        
        // Update DOM elements
        try {
            progressBar.style.width = progressPercentage + "%";
            console.log("✅ Updated progress bar width to", progressPercentage + "%");
        } catch (e) {
            console.error("❌ Error updating progress bar width:", e);
        }
        
        try {
            progressText.textContent = `Step ${currentSlide} of ${totalSlides}`;
            console.log("✅ Updated progress text to", `Step ${currentSlide} of ${totalSlides}`);
        } catch (e) {
            console.error("❌ Error updating progress text:", e);
        }
        
        console.log(`📊 Progress: ${progressVisual} ${progressPercentage.toFixed(1)}% - Step ${currentSlide}/${totalSlides}`);
        
        // Store current progress in sessionStorage for persistence
        sessionStorage.setItem('formProgress_currentSlide', currentSlide);
        sessionStorage.setItem('formProgress_totalSlides', totalSlides);
        console.log("💾 Saved progress to sessionStorage");
    }
    
    // Restore progress if available from session storage
    if (sessionStorage.getItem('formProgress_currentSlide')) {
        currentSlide = parseInt(sessionStorage.getItem('formProgress_currentSlide'), 10);
        console.log("🔄 Restored currentSlide from sessionStorage:", currentSlide);
    }
    if (sessionStorage.getItem('formProgress_totalSlides')) {
        totalSlides = parseInt(sessionStorage.getItem('formProgress_totalSlides'), 10);
        console.log("🔄 Restored totalSlides from sessionStorage:", totalSlides);
    }
    
    // Initialize progress bar
    console.log("🚀 Initializing progress bar...");
    updateProgressBar();
    
    // Create overlay elements to capture clicks on the iframe area
    function createOverlayButtons() {
        console.log("🔲 Creating overlay buttons for form navigation...");
        const formContainers = document.querySelectorAll('#realtor-form-container, #customer-form-container');
        
        if (formContainers.length === 0) {
            console.error("❌ No form containers found to attach overlays!");
            return;
        }
        
        console.log(`✅ Found ${formContainers.length} form containers`);
        
        formContainers.forEach((container, index) => {
            console.log(`   📦 Processing container ${index+1}:`, container);
            
            // Make container position relative
            container.style.position = 'relative';
            
            // Left side overlay for back button - MOVED 60px LOWER and WIDER (140px)
            const leftOverlay = document.createElement('div');
            leftOverlay.className = 'form-nav-overlay left-overlay';
            leftOverlay.style.cssText = 'position: absolute; left: 0; top: calc(50% + 60px); width: 140px; height: 80px; z-index: 9998; cursor: pointer; transform: translateY(-50%); border: 2px dashed red; opacity: 0.2;'; // Wider
            leftOverlay.title = 'Previous';
            leftOverlay.id = 'prev-overlay';
            
            // Hide the left overlay initially if we're on first slide
            if (currentSlide === 1) {
                leftOverlay.style.display = 'none';
            }
            
            leftOverlay.addEventListener('click', function(e) {
                console.log("👈 Left overlay clicked, attempting to go back");
                e.preventDefault();
                if (currentSlide > 1) {
                    currentSlide--;
                    console.log("  🔙 Decremented currentSlide to", currentSlide);
                    updateProgressBar();
                    
                    // Hide left overlay if we're now on the first slide
                    if (currentSlide === 1) {
                        document.querySelectorAll('.left-overlay').forEach(el => {
                            el.style.display = 'none';
                        });
                    }
                } else {
                    console.log("  ⛔ Already at first slide, cannot go back");
                }
            });
            
            // Right side overlay for next button - MOVED 60px LOWER and WIDER (140px)
            const rightOverlay = document.createElement('div');
            rightOverlay.className = 'form-nav-overlay right-overlay';
            rightOverlay.style.cssText = 'position: absolute; right: 0; top: calc(50% + 60px); width: 140px; height: 80px; z-index: 9998; cursor: pointer; transform: translateY(-50%); border: 2px dashed green; opacity: 0.2;'; // Wider
            rightOverlay.title = 'Next';
            rightOverlay.addEventListener('click', function(e) {
                console.log("👉 Right overlay clicked, attempting to go forward");
                e.preventDefault();
                if (currentSlide < totalSlides) {
                    currentSlide++;
                    console.log("  🔜 Incremented currentSlide to", currentSlide);
                    updateProgressBar();
                    
                    // Show left overlay if we're no longer on the first slide
                    if (currentSlide > 1) {
                        document.querySelectorAll('.left-overlay').forEach(el => {
                            el.style.display = 'block';
                        });
                    }
                } else {
                    console.log("  ⛔ Already at last slide, cannot go further");
                }
            });
            
            container.appendChild(leftOverlay);
            console.log("   ✅ Added left overlay to container");
            
            container.appendChild(rightOverlay);
            console.log("   ✅ Added right overlay to container");
        });
        
        console.log("✅ Overlay buttons created successfully");
    }
    
    // Update the original updateProgressBar function to control overlay visibility
    const originalUpdateProgressBar = updateProgressBar;
    updateProgressBar = function() {
        originalUpdateProgressBar.apply(this, arguments);
        
        // After updating the progress bar, also update overlay visibility
        document.querySelectorAll('.left-overlay').forEach(el => {
            el.style.display = currentSlide > 1 ? 'block' : 'none';
        });
    };
    
    // Create keyboard event listeners for navigation
    function setupKeyboardNavigation() {
        console.log("⌨️ Setting up keyboard navigation...");
        document.addEventListener('keydown', function(e) {
            console.log("🔤 Keydown event detected:", e.key);
            
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                console.log("  ➡️ Right arrow or PageDown pressed");
                if (currentSlide < totalSlides) {
                    currentSlide++;
                    console.log("    Incremented slide to", currentSlide);
                    updateProgressBar();
                } else {
                    console.log("    Already at last slide");
                }
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                console.log("  ⬅️ Left arrow or PageUp pressed");
                if (currentSlide > 1) {
                    currentSlide--;
                    console.log("    Decremented slide to", currentSlide);
                    updateProgressBar();
                } else {
                    console.log("    Already at first slide");
                }
            }
        });
        console.log("✅ Keyboard navigation setup complete");
    }
    
    // Document-level click listeners for manual navigation
    document.addEventListener('click', function(e) {
        // Log the click target for debugging
        console.log("🖱️ Click detected on:", e.target);
        console.log("   Element tag:", e.target.tagName);
        console.log("   Element classes:", e.target.className);
        console.log("   Element text:", e.target.textContent?.trim().substring(0, 30) + (e.target.textContent?.length > 30 ? "..." : ""));
        
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
            
            console.log("➡️ Next/Forward button detected!");
            if (currentSlide < totalSlides) {
                currentSlide++;
                console.log("   Incremented slide to", currentSlide);
                updateProgressBar();
            } else {
                console.log("   Already at last slide");
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
            
            console.log("⬅️ Back/Previous button detected!");
            if (currentSlide > 1) {
                currentSlide--;
                console.log("   Decremented slide to", currentSlide);
                updateProgressBar();
            } else {
                console.log("   Already at first slide");
            }
        }
        // Submit/finish patterns (set to 100%)
        else if ((target.tagName === 'BUTTON' && 
                 (target.textContent.toLowerCase().includes('submit') || 
                  target.textContent.toLowerCase().includes('finish') ||
                  target.textContent.toLowerCase().includes('complete'))) ||
                target.classList.contains('submit-button') ||
                target.closest('.submit-button')) {
            
            console.log("🏁 Submit/Finish button detected!");
            currentSlide = totalSlides;
            console.log("   Setting slide to max:", totalSlides);
            updateProgressBar();
        }
    });
    
    // Manual controls for testing - add debug buttons
    function addDebugControls() {
        console.log("🛠️ Adding debug controls...");
        const debugContainer = document.createElement('div');
        debugContainer.style.cssText = 'position: fixed; bottom: 10px; right: 10px; background: #f0f0f0; padding: 10px; border: 1px solid #ccc; border-radius: 5px; z-index: 10000;';
        
        const debugLabel = document.createElement('div');
        debugLabel.textContent = 'Progress Bar Debug Controls:';
        debugLabel.style.marginBottom = '10px';
        debugContainer.appendChild(debugLabel);
        
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '← Prev';
        prevBtn.style.marginRight = '10px';
        prevBtn.addEventListener('click', function() {
            console.log("🔧 Debug Prev button clicked");
            if (currentSlide > 1) {
                currentSlide--;
                updateProgressBar();
            }
        });
        debugContainer.appendChild(prevBtn);
        
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next →';
        nextBtn.addEventListener('click', function() {
            console.log("🔧 Debug Next button clicked");
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateProgressBar();
            }
        });
        debugContainer.appendChild(nextBtn);
        
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.style.marginLeft = '10px';
        resetBtn.addEventListener('click', function() {
            console.log("🔧 Debug Reset button clicked");
            currentSlide = 1;
            updateProgressBar();
        });
        debugContainer.appendChild(resetBtn);
        
        document.body.appendChild(debugContainer);
        console.log("✅ Debug controls added");
    }
    
    // Create button overlays after a short delay to ensure form containers are ready
    console.log("⏱️ Setting timeout to create overlay buttons...");
    setTimeout(() => {
        console.log("⏰ Timeout elapsed, creating overlay buttons now");
        createOverlayButtons();
    }, 1000);
    
    setupKeyboardNavigation();
    addDebugControls(); // Add debug controls
    
    // Check for completion status periodically
    console.log("🔄 Setting up periodic completion check...");
    setInterval(function() {
        const successMessages = document.querySelectorAll('.form-success, .success-message, .thank-you-message, .completion-message');
        if (successMessages.length > 0) {
            console.log("🎉 Success message detected, setting progress to 100%");
            currentSlide = totalSlides;
            updateProgressBar();
        }
    }, 1000);
    
    console.log("✅ progressBarr.js initialization complete");
});