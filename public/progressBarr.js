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
        
        // Listen for clicks on navigation buttons
        document.addEventListener("click", function (event) {
            if (event.target.closest(".ghl-footer-next")) {
                setTimeout(() => {
                    if (currentSlide < totalSlides) {
                        currentSlide++;
                        updateProgressBar();
                    }
                }, 200);
            } else if (event.target.closest(".ghl-footer-prev")) {
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
            // Verify the origin to ensure security
            // You might need to adjust this depending on the actual origin of your forms
            if (event.origin.includes("leadconnectorhq.com")) {
                try {
                    const data = event.data;
                    if (data && data.type === "formNavigation") {
                        currentSlide = data.currentSlide;
                        totalSlides = data.totalSlides || totalSlides;
                        updateProgressBar();
                    }
                } catch (e) {
                    console.error("Error processing iframe message:", e);
                }
            }
        });
        
        // Check for iframes on the page
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            console.log("Found iframe, will check for form elements when loaded");
            
            // Check if already loaded
            if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
                checkIframeForForm(iframe);
            } else {
                // If not yet loaded
                iframe.addEventListener('load', function() {
                    checkIframeForForm(iframe);
                });
            }
        });
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
                    
                    // Listen for clicks on navigation buttons
                    document.addEventListener("click", function(event) {
                        if (event.target.closest(".ghl-footer-next") || event.target.closest(".ghl-footer-prev")) {
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
    
    // Check for new iframes periodically (in case they're added dynamically)
    setInterval(() => {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            if (!iframe.hasAttribute('data-progress-monitored')) {
                iframe.setAttribute('data-progress-monitored', 'true');
                checkIframeForForm(iframe);
            }
        });
    }, 2000);
});