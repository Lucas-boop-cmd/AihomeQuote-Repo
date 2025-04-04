document.addEventListener("DOMContentLoaded", function () {
    // Initial values
    let currentSlide = 1;
    let totalSlides = 5; // Default total slides
    
    function updateProgressBar() {
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
    
    // Run the function initially
    updateProgressBar();
    
    // Find all iframes and inject event listeners into them
    function setupIframeEventListeners() {
        const iframes = document.querySelectorAll('iframe');
        
        iframes.forEach(iframe => {
            // Wait for iframe to load
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                injectEventListeners(iframe);
            } else {
                iframe.onload = function() {
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
            
            // Inject a script to monitor the button clicks and send messages to parent
            const script = document.createElement('script');
            script.innerHTML = `
                (function() {
                    // Function to send message to parent
                    function notifyParent(action) {
                        window.parent.postMessage({ action: action }, '*');
                    }
                    
                    // Set up click listeners for the form navigation buttons
                    document.addEventListener('click', function(e) {
                        if (e.target.matches('.ghl-footer-next-arrow') || 
                            e.target.closest('.ghl-footer-next-arrow')) {
                            console.log('Next button clicked in iframe');
                            notifyParent('next');
                        } 
                        else if (e.target.matches('.ghl-footer-back') || 
                                 e.target.closest('.ghl-footer-back')) {
                            console.log('Back button clicked in iframe');
                            notifyParent('back');
                        }
                    });
                    
                    // Also watch for form initialization to determine total slides
                    const checkForm = setInterval(() => {
                        const footer = document.querySelector('.ghl-footer-buttons');
                        if (footer && footer.hasAttribute('totalslides')) {
                            const total = parseInt(footer.getAttribute('totalslides'), 10) || 5;
                            notifyParent('setTotal');
                            notifyParent({ action: 'setTotal', total: total });
                            clearInterval(checkForm);
                        }
                    }, 500);
                    
                    console.log('Event listeners injected into iframe');
                })();
            `;
            
            // Try to append the script to the iframe
            iframeDoc.body.appendChild(script);
        } catch (e) {
            // If direct access fails, use the iframe src to inject the listener
            console.log('Cannot directly access iframe (likely cross-origin). Using alternative method.');
            
            // Monitor for messages from the iframe
            window.addEventListener('message', function(event) {
                if (event.data && event.data.action) {
                    console.log('Received message from iframe:', event.data);
                    
                    if (event.data.action === 'next') {
                        if (currentSlide < totalSlides) {
                            currentSlide++;
                            updateProgressBar();
                        }
                    } else if (event.data.action === 'back') {
                        if (currentSlide > 1) {
                            currentSlide--;
                            updateProgressBar();
                        }
                    } else if (event.data.action === 'setTotal' && event.data.total) {
                        totalSlides = event.data.total;
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
        if (event.data && event.data.action) {
console.log('Received message from iframe:', event.data);
            
            if (event.data.action === 'next') {
                if (currentSlide < totalSlides) {
                currentSlide++;
                updateProgressBar();
}
            } else if (event.data.action === 'back') {
                if (currentSlide > 1) {
                currentSlide--;
                updateProgressBar();
}
            } else if (event.data.action === 'setTotal' && event.data.total) {
                totalSlides = event.data.total;
                updateProgressBar();
                }
                        }
                    });
    });