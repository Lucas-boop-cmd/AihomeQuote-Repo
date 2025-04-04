document.addEventListener("DOMContentLoaded", function () {
    // Initial values
    let totalSlides = 5; // Default total slides
    let currentSlide = 1; // Will be derived from DOM

    // Function to determine current slide by reading class "slide-no-X" from the visible slide element.
    function getCurrentSlideFromDOM() {
        // Assuming all slide wrappers have class "form-builder--wrap-questions"
        const visibleSlide = document.querySelector('.form-builder--wrap-questions:not([style*="display: none"])');
        if (visibleSlide) {
            const match = visibleSlide.className.match(/slide-no-(\d+)/);
            if (match) {
                console.log("Detected slide number from DOM:", match[1]);
                return parseInt(match[1], 10);
            }
        }
        return currentSlide;
    }

    // Update the progress bar using the current slide number from the DOM.
    function updateProgressBar() {
        // Get current slide from DOM
        currentSlide = getCurrentSlideFromDOM();
        let progressPercentage = (currentSlide / totalSlides) * 100;
        
        let progressBar = document.getElementById("progress-bar");
        let progressText = document.getElementById("progress-text");
        if (!progressBar || !progressText) {
            console.error("Progress bar elements not found in DOM.");
            return;
        }
        progressBar.style.width = progressPercentage + "%";
        progressText.textContent = `Step ${currentSlide} of ${totalSlides}`;
        console.log(`Progress updated: Step ${currentSlide} of ${totalSlides} (${progressPercentage}%)`);
    }

    // Run initially
    updateProgressBar();

    // Set up a MutationObserver on the container holding the slides so that any change (e.g. new slide visible) triggers an update.
    const slidesContainer = document.querySelector('.form-builder--wrap-questions');
    if (slidesContainer) {
        const observer = new MutationObserver(() => {
            console.log("DOM change detected, updating progress bar");
            updateProgressBar();
        });
        observer.observe(slidesContainer, { attributes: true, childList: true, subtree: true });
    } else {
        console.log("Slide container not found. Progress bar updates will rely on polling.");
        // Fallback: poll every second
        setInterval(updateProgressBar, 1000);
    }

    // Find all iframes and inject event listeners into them
    function setupIframeEventListeners() {
        const iframes = document.querySelectorAll('iframe');
        console.log(`Found ${iframes.length} iframes on DOMContentLoaded`);

        iframes.forEach(iframe => {
            // Wait for iframe to load
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                console.log("Iframe loaded (direct access):", iframe);
                injectEventListeners(iframe);
            } else {
                console.log("Setting onload for iframe:", iframe);
                iframe.onload = function() {
                    console.log("Iframe onload triggered for:", iframe);
                    injectEventListeners(iframe);
                };
            }
        });

        // Use a MutationObserver to monitor for new iframes instead of an event listener/setInterval
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1 && node.tagName === 'IFRAME' && 
!node.hasAttribute('data-progress-monitored')) {
                        console.log("New iframe detected by MutationObserver:", node);
                        injectEventListeners(node);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Inject script into iframe to relay button clicks back to parent
    function injectEventListeners(iframe) {
        try {
            // Mark iframe as monitored
            iframe.setAttribute('data-progress-monitored', 'true');

            // Try to access iframe document (will fail if cross-origin)
            const iframeDoc = iframe.contentWindow.document;

            // Inject a script to monitor the DOM for slide changes and send messages to the parent
            const script = document.createElement('script');
            script.innerHTML = `
                (function() {
                    // Function to send message to parent
                    function notifyParent(message) {
                        console.log("Iframe notifying parent with message:", message);
                        window.parent.postMessage(message, '*');
                    }
                    
                    // Function to get the current slide number from DOM
                    function getCurrentSlideFromDOM() {
                        const visibleSlide = document.querySelector('.form-builder--wrap-questions:not([style*="display: none"])');
                        if (visibleSlide) {
                            const match = visibleSlide.className.match(/slide-no-(\\d+)/);
                            if (match) {
                                console.log("Iframe detected slide number:", match[1]);
                                return parseInt(match[1], 10);
                            }
                        }
                        return null;
                    }
                    
                    // Report the current slide to parent
                    function reportCurrentSlide() {
                        const currentSlide = getCurrentSlideFromDOM();
                        if (currentSlide) {
                            notifyParent({ action: 'setCurrentSlide', slide: currentSlide });
                        }
                    }
                    
                    // Set up a MutationObserver to detect slide changes
                    const observer = new MutationObserver((mutations) => {
                        console.log("Iframe detected DOM changes, checking slide number");
                        reportCurrentSlide();
                    });
                    
                    // Start observing once the form is ready
                    function setupObserver() {
                        const formContainer = document.querySelector('.form-builder');
                        if (formContainer) {
                            observer.observe(formContainer, { 
                                attributes: true, 
                                childList: true, 
                                subtree: true 
                            });
                            console.log("Iframe observer setup for form-builder");
                            
                            // Report initial state
                            reportCurrentSlide();
                            
                            // Also watch for form initialization to determine total slides
                            const footer = document.querySelector('.ghl-footer-buttons');
                            if (footer && footer.hasAttribute('totalslides')) {
                                const total = parseInt(footer.getAttribute('totalslides'), 10) || 5;
                                console.log("Iframe detected total slides:", total);
                                notifyParent({ action: 'setTotal', total: total });
                            }
                            
                            return true;
                        }
                        return false;
                    }
                    
                    // Keep trying to setup observer until form is ready
                    if (!setupObserver()) {
                        const checkInterval = setInterval(() => {
                            if (setupObserver()) {
                                clearInterval(checkInterval);
                            }
                        }, 500);
                    }
                    
                    // Also keep the click listeners as a fallback
                    document.addEventListener('click', function(e) {
                        if (e.target.matches('.ghl-footer-next-arrow') || e.target.closest('.ghl-footer-next-arrow')) {
                            console.log("Detected click on next button inside iframe");
                            reportCurrentSlide();
                        } else if (e.target.matches('.ghl-footer-back') || e.target.closest('.ghl-footer-back')) {
                            console.log("Detected click on back button inside iframe");
                            reportCurrentSlide();
                        }
                    });
                    
                    console.log("Enhanced slide monitoring injected into iframe");
                })();
            `;

            // Try to append the script to the iframe
            iframeDoc.body.appendChild(script);
        } catch (e) {
            console.error("Direct access to iframe failed:", e);

            // Fallback: monitor for messages from the iframe (postMessage fallback)
            window.addEventListener('message', function(event) {
                if (event.data && event.data.action) {
                    console.log('Received message from iframe:', event.data);

                    if (event.data.action === 'next') {
                        console.log("Handling 'next' from iframe");
                        if (currentSlide < totalSlides) {
                            currentSlide++;
                            updateProgressBar();
                        }
                    } else if (event.data.action === 'back') {
                        console.log("Handling 'back' from iframe");
                        if (currentSlide > 1) {
                            currentSlide--;
                            updateProgressBar();
                        }
                    } else if (event.data.action === 'setTotal' && event.data.total) {
                        console.log("Handling 'setTotal' from iframe. Total:", event.data.total);
                        totalSlides = event.data.total;
                        updateProgressBar();
                    } else if (event.data.action === 'setCurrentSlide' && event.data.slide) {
                        console.log("Handling 'setCurrentSlide' from iframe. Slide:", event.data.slide);
                        currentSlide = event.data.slide;
                        updateProgressBar();
                    }
                }
            });
        }
    }

    // Initialize iframe event handling
    setupIframeEventListeners();

    // Also keep the document-level listeners for when the form is not in an iframe
    document.addEventListener("click", function (event) {
        console.log("Document click event detected:", event.target);
        if (event.target.matches(".ghl-footer-next-arrow") || 
event.target.closest(".ghl-footer-next-arrow")) {
            console.log("Next button clicked in main document");
            if (currentSlide < totalSlides) {
                currentSlide++;
                updateProgressBar();
            }
        }
        else if (event.target.matches(".ghl-footer-back") || 
event.target.closest(".ghl-footer-back")) {
            console.log("Back button clicked in main document");
            if (currentSlide > 1) {
                currentSlide--;
                updateProgressBar();
            }
        }
    });

    // Listen for messages from iframes
    window.addEventListener("message", function(event) {
        console.log("Window received message from iframe:", event.origin, event.data);
        // Only process if event.data.action is a string and one of our expected actions.
        if (event.data && typeof event.data.action === 'string') {
            const validActions = ['next', 'back', 'setTotal', 'setCurrentSlide'];
            if (!validActions.includes(event.data.action)) {
                console.log("Ignoring unrecognized action:", event.data.action);
                return;
            }
            console.log("Before handling message, currentSlide:", currentSlide, "totalSlides:", totalSlides);
            if (event.data.action === 'next') {
                console.log("Handling 'next' from iframe");
                if (currentSlide < totalSlides) {
                    currentSlide++;
                    console.log("After 'next', currentSlide now:", currentSlide);
                    updateProgressBar();
                } else {
                    console.log("'next' received but currentSlide already at max");
                }
            } else if (event.data.action === 'back') {
                console.log("Handling 'back' from iframe");
                if (currentSlide > 1) {
                    currentSlide--;
                    console.log("After 'back', currentSlide now:", currentSlide);
                    updateProgressBar();
                } else {
                    console.log("'back' received but currentSlide already at min");
                }
            } else if (event.data.action === 'setTotal' && event.data.total) {
                console.log("Handling 'setTotal' from iframe. Received total:", event.data.total);
                totalSlides = event.data.total;
                console.log("Updated totalSlides to:", totalSlides, "with currentSlide:", currentSlide);
                updateProgressBar();
            } else if (event.data.action === 'setCurrentSlide' && event.data.slide) {
                console.log("Handling 'setCurrentSlide' from iframe. Slide:", event.data.slide);
                currentSlide = event.data.slide;
                updateProgressBar();
            } else {
                console.log("Unrecognized action:", event.data.action);
            }
            console.log("After handling message, currentSlide:", currentSlide, "totalSlides:", totalSlides);
        } else {
            console.log("Received message without valid action:", event.data);
        }
    });
});