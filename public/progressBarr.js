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
    
    // For direct observation of the page if the form is on the same domain
    function setupDirectObservation() {
        console.log("Setting up direct observation of form elements");
        
        // Look for form elements in the main document
        let footerButtons = document.querySelector(".ghl-footer-buttons");
        if (footerButtons) {
            console.log("Found footer buttons in main document");
            
            // Get the total slides from the footer attributes
            if (footerButtons.hasAttribute("totalslides")) {
                totalSlides = parseInt(footerButtons.getAttribute("totalslides"), 10) || totalSlides;
            }
            
            // Set up a mutation observer to track slide changes
            let observer = new MutationObserver((mutations) => {
                for (let mutation of mutations) {
                    if (mutation.type === "attributes" && mutation.attributeName === "currentslide") {
                        currentSlide = parseInt(footerButtons.getAttribute("currentslide"), 10) + 1 || 1;
                        updateProgressBar();
                    }
                }
            });
            
            observer.observe(footerButtons, {
                attributes: true, 
                attributeFilter: ["currentslide"]
            });
        }
        
        // Listen for clicks on navigation buttons - UPDATED SELECTORS
        document.addEventListener("click", function (event) {
            if (event.target.closest(".ghl-footer-next") || event.target.closest(".ghl-footer-next-arrow")) {
                setTimeout(() => {
                    if (currentSlide < totalSlides) {
                        currentSlide++;
                        updateProgressBar();
                    }
                }, 200);
            } else if (event.target.closest(".ghl-footer-back")) {
                setTimeout(() => {
                    if (currentSlide > 1) {
                        currentSlide--;
                        updateProgressBar();
                    }
                }, 200);
            }
        });
    }
    
    // Handle messages from iframe if form is in iframe
    function setupIframeMessageListening() {
        console.log("Setting up iframe message listening");
        
        // Listen for messages from the iframe
        window.addEventListener("message", function(event) {
            console.log("Received message from iframe:", event.origin, event.data);
            // Accept messages from leadconnectorhq.com or any origin if in development
            if (event.origin.includes("leadconnectorhq.com") || event.origin === "null" || event.origin.includes("localhost")) {
                try {
                    const data = event.data;
                    if (data && data.type === "formNavigation") {
                        console.log("Processing form navigation message:", data);
                        currentSlide = data.currentSlide;
                        totalSlides = data.totalSlides || totalSlides;
                        updateProgressBar();
                    }
                } catch (e) {
                    console.error("Error processing iframe message:", e);
                }
            }
        });
        
        // More aggressive approach to find and monitor iframes
        function findAndMonitorIframes() {
            console.log("Searching for iframes to monitor...");
            const iframes = document.querySelectorAll('iframe');
            console.log(`Found ${iframes.length} iframes`);
            
            iframes.forEach(iframe => {
                // Skip already monitored iframes
                if (iframe.hasAttribute('data-progress-monitored')) {
                    return;
                }
                
                console.log("Setting up monitoring for iframe:", iframe.id || iframe.src);
                iframe.setAttribute('data-progress-monitored', 'true');
                
                // Try direct access first (will work for same origin)
                try {
                    if (iframe.contentDocument) {
                        checkIframeForForm(iframe);
                    }
                } catch (e) {
                    console.log("Direct iframe access failed (likely cross-origin)");
                }
                
                // For cross-origin iframes, inject a script via the src attribute
                try {
                    // Create a unique message ID for this iframe
                    const messageId = 'form_' + Math.random().toString(36).substr(2, 9);
                    iframe.setAttribute('data-message-id', messageId);
                    
                    // Add a one-time load event listener
                    iframe.addEventListener('load', function onceLoaded() {
                        iframe.removeEventListener('load', onceLoaded);
                        
                        setTimeout(() => {
                            // Try to inject a message passing script for cross-origin communication
                            try {
                                // Create an absolute URL to the form's domain
                                const iframeSrc = new URL(iframe.src);
                                console.log(`Iframe loaded: ${iframeSrc.href}`);
                                
                                // Force iframe height adjustment (some forms need this)
                                if (iframe.height === "" || iframe.height === "0") {
                                    iframe.style.height = "800px"; // Default height
                                }
                            } catch (e) {
                                console.error("Error setting up iframe:", e);
                            }
                        }, 1000);
                    });
                } catch (e) {
                    console.error("Error monitoring iframe:", e);
                }
            });
        }
        
        // Run immediately and set up periodic check
        findAndMonitorIframes();
        setInterval(findAndMonitorIframes, 2000);
    }
    
    // Check iframe for form elements and set up observers
    function checkIframeForForm(iframe) {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            const footerButtons = iframeDoc.querySelector(".ghl-footer-buttons");
            
            if (footerButtons) {
                console.log("Found form navigation in iframe");
                
                // Get current slide and total slides
                currentSlide = parseInt(footerButtons.getAttribute("currentslide"), 10) + 1 || 1;
                totalSlides = parseInt(footerButtons.getAttribute("totalslides"), 10) || totalSlides;
                
                // Update progress
                updateProgressBar();
                
                // Inject script into iframe to communicate slide changes
                const script = iframeDoc.createElement('script');
                script.textContent = `
                    function reportNavigation() {
                        const footer = document.querySelector(".ghl-footer-buttons");
                        if (footer) {
                            const currentSlide = parseInt(footer.getAttribute("currentslide"), 10) + 1 || 1;
                            const totalSlides = parseInt(footer.getAttribute("totalslides"), 10) || 5;
                            window.parent.postMessage({
                                type: "formNavigation",
                                currentSlide: currentSlide,
                                totalSlides: totalSlides
                            }, "*");
                        }
                    }
                    
                    // Set up observers in the iframe
                    const footer = document.querySelector(".ghl-footer-buttons");
                    if (footer) {
                        const observer = new MutationObserver(reportNavigation);
                        observer.observe(footer, {
                            attributes: true,
                            attributeFilter: ["currentslide"]
                        });
                    }
                    
                    // Listen for clicks on navigation buttons - UPDATED SELECTORS
                    document.addEventListener("click", function(event) {
                        if (event.target.closest(".ghl-footer-next") || event.target.closest(".ghl-footer-next-arrow")) {
                            setTimeout(reportNavigation, 200);
                        } else if (event.target.closest(".ghl-footer-back")) {
                            setTimeout(reportNavigation, 200);
                        }
                    });
                    
                    // Initial report
                    reportNavigation();
                `;
                
                
                try {
                    iframeDoc.body.appendChild(script);
                } catch (e) {
                    console.error("Could not inject script into iframe:", e);
                }
            }
        } catch (e) {
            console.log("Cross-origin restriction prevented access to iframe content:", e);
        }
    }
    
    // Listen for the custom formLoaded event
    document.addEventListener('formLoaded', function(e) {
        if (e.detail && e.detail.iframe) {
            console.log("Form loaded event received");
            checkIframeForForm(e.detail.iframe);
        }
    });
    
    // Set up both observation methods
    setupDirectObservation();
    setupIframeMessageListening();
});