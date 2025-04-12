// Early execution path redirection
(function() {
    try {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(window.location.search);
        const pathSegments = url.pathname.split("/").filter(Boolean);
        const commonFileExtensions = ['.js', '.css', '.html', '.jpg', '.png', '.svg', '.ico', '.gif', '.woff', '.woff2'];
        
        // Check script request indicators more thoroughly
        const isScriptRequest = 
            // Direct script extensions check
            commonFileExtensions.some(ext => url.pathname.toLowerCase().endsWith(ext)) ||
            // Check if lo parameter is a JavaScript file
            (params.has('lo') && params.get('lo').toLowerCase().endsWith('.js')) ||
            // Check if any parameter ends with .js
            Array.from(params.entries()).some(([_, value]) => value.toLowerCase().endsWith('.js')) ||
            // Check script-related paths
            url.pathname.includes('/scripts/') || 
            url.pathname.includes('/js/');
        
        // Log detailed debug information
        console.log("Early redirect check:", {
            url: url.toString(),
            pathname: url.pathname,
            search: url.search,
            loParam: params.get('lo'),
            isScriptRequest
        });
            
        // Skip ALL redirects if this appears to be a script request
        if (isScriptRequest) {
            console.log("Detected script request, skipping early redirect");
            return;
        }
        
        // Continue with normal path segment handling for non-script requests
        if (pathSegments.length >= 1 && url.pathname !== '/' && !isScriptRequest) {
            const lo = pathSegments[0];
            console.log('Early redirect: Path segment detected:', lo);
            if (!params.has('lo')) {
                params.set('lo', lo);
                const newUrl = `${url.origin}/?${params.toString()}`;
                console.log('Early redirect: Redirecting to', newUrl);
                window.location.replace(newUrl);
            }
        }
    } catch (e) {
        console.error('Early redirect failed:', e);
    }
})();

// Main application code
(() => {
    // Check if we need to handle agent parameter
    const urlParams = new URLSearchParams(window.location.search);
    const agent = urlParams.get('agent');
    
    // Backup path-based navigation handler with additional check
    const handlePathBasedNavigation = () => {
        try {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(window.location.search);
            
            // Check if this is a direct file request
            const path = url.pathname;
            const commonFileExtensions = ['.js', '.css', '.html', '.jpg', '.png', '.svg', '.ico', '.gif', '.woff', '.woff2'];
            const isFileRequest = commonFileExtensions.some(ext => path.toLowerCase().endsWith(ext));
            
            // Skip redirect for file requests
            if (isFileRequest) {
                console.log("Backup handler: Direct file request detected, skipping redirect:", path);
                return false;
            }
            
            // Skip if "lo" param exists and references a JS file
            if (params.has('lo') && params.get('lo').toLowerCase().endsWith('.js')) {
                console.log("Detected lo param ending with .js, skipping backup redirect");
                return false;
            }
            
            const pathSegments = url.pathname.split("/").filter(Boolean);
            if (pathSegments.length >= 1 && url.pathname !== '/' && !isFileRequest) {
                const lo = pathSegments[0];
                console.log('Backup handler: Path segment detected:', lo);
                if (!params.has('lo')) {
                    params.set('lo', lo);
                    const newUrl = `${url.origin}/?${params.toString()}`;
                    console.log('Backup handler: Redirecting to', newUrl);
                    window.location.replace(newUrl);
                    return true;
                }
            }
            return false;
        } catch (error) {
            console.error('Backup path navigation error:', error);
            return false;
        }
    };

    // Double-check with the backup handler
    if (handlePathBasedNavigation()) return;

    // Get API base URL based on LO profile or hardcoded fallbacks
    const getApiBaseUrl = () => {
        // First priority: Check if we have the current LO profile with an API URL
        if (window.currentLOProfile && window.currentLOProfile.apiUrl) {
            console.log('Using API URL from LO profile:', window.currentLOProfile.apiUrl);
            return window.currentLOProfile.apiUrl;
        }
        
        // Second priority: Fallback to hardcoded values based on LO parameter
        const urlParams = new URLSearchParams(window.location.search);
        const lo = urlParams.get('lo');
        if (lo) {
            if (lo === 'brandon') {
                console.log('Using Brandon API URL from hardcoded fallback');
                return 'https://brandon-bluebubbles-middleware-jo7b.onrender.com';
            } else if (lo === 'lucas') {
                console.log('Using Lucas API URL from hardcoded fallback');
                return 'https://bluebubbles-middleware.onrender.com';
            }
        }

        // Final fallback to default API URL
        console.log('Using default API URL fallback');
        return 'https://bluebubbles-middleware.onrender.com';
    };

    const getAgentParameter = () => {
        return urlParams.get('agent');
    };

    const callRealtorHandler = async (agentName) => {
        try {
            const backendUrl = getApiBaseUrl();
            console.log('Using backend URL:', backendUrl);

            const response = await fetch(`${backendUrl}/realtors?businessName=${encodeURIComponent(agentName)}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                mode: 'cors', // Ensure CORS is enabled
            });

            if (!response.ok) {
                console.error('Error response:', await response.text());
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Realtor data:', data);

            // Update the page with realtor information
            updateRealtorInfo(data);
        } catch (error) {
            console.error('Error calling realtor handler:', error);
            showError(`Could not load realtor information: ${error.message}`);
        }
    };

    const updateRealtorInfo = (realtorData) => {
        // Log the entire data object for debugging
        console.log('Complete realtor data object:', realtorData);

        // Update realtor headshot
        const headshot = document.getElementById('realtor-headshot');
        if (headshot) {
            // Only use the source field for the headshot URL
            const headshotUrl = realtorData.source;
            console.log('Realtor headshot URL:', headshotUrl);

            // Check if headshot URL exists and is valid
            if (headshotUrl && isValidUrl(headshotUrl)) {
                headshot.src = headshotUrl;
                headshot.alt = `${realtorData.firstName} ${realtorData.lastName}`;

                // Add error handling for image loading
                headshot.onerror = function() {
                    console.error('Failed to load headshot image');
                    // Keep the placeholder image
                };
            } else {
                console.warn('Missing or invalid headshot URL');
                // The placeholder image will remain
            }
        }

        // Update realtor name
        const name = document.getElementById('realtor-name');
        if (name) {
            name.textContent = `${realtorData.firstName} ${realtorData.lastName}`;
            console.log('Updated realtor name:', `${realtorData.firstName} ${realtorData.lastName}`);
        }

        // Update social media links using the existing HTML elements
        console.log('Social media data:', {
            facebook: realtorData.facebook,
            instagram: realtorData.instagram,
            linkedin: realtorData.linkedin
        });
        
        // Update Facebook
        updateSocialLink('realtor-facebook', realtorData.facebook);
        
        // Update Instagram
        updateSocialLink('realtor-instagram', realtorData.instagram);
        
        // Update LinkedIn
        updateSocialLink('realtor-linkedin', realtorData.linkedin);

        // Update contact info
        const contactInfo = document.getElementById('contact-info');
        if (contactInfo) {
            let contactHtml = '';
            if (realtorData.email) {
                contactHtml += `<p class="text-gray-600 text-sm mb-2">Email: <a href="mailto:${realtorData.email}" class="text-blue-600 hover:underline">${realtorData.email}</a></p>`;
                console.log('Added email to contact info:', realtorData.email);
            }
            if (realtorData.phone) {
                contactHtml += `<p class="text-gray-600 text-sm mb-2">Phone: <a href="tel:${realtorData.phone}" class="text-blue-600 hover:underline">${realtorData.phone}</a></p>`;
                console.log('Added phone to contact info:', realtorData.phone);
            }

            // Add link to forms if the realtor has any
            if (realtorData.forms && realtorData.forms.length > 0) {
                contactHtml += '<div class="mt-4">';
                realtorData.forms.forEach(form => {
                    // Get current URL parameters
                    const currentParams = new URLSearchParams(window.location.search);
                    // Set the form ID parameter
                    currentParams.set('form', form.id);
                    // Make sure agent parameter is included
                    if (agent) {
                        currentParams.set('agent', agent);
                    }
                    // Create form URL with all parameters preserved
                    contactHtml += `<p class="mb-2"><a href="forms.html?${currentParams.toString()}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">${form.title || 'Complete Form'}</a></p>`;
                });
                contactHtml += '</div>';
            }

            contactInfo.innerHTML = contactHtml;
        }

        // Show the realtor card
        const realtorCard = document.getElementById('realtor-card');
        if (realtorCard) {
            realtorCard.classList.remove('hidden');
        }

        // Hide loading state
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    };

    // Helper function to update social media links
    const updateSocialLink = (elementId, url) => {
        const element = document.getElementById(elementId);
        console.log(`Updating social link ${elementId}:`, url);
        
        if (element && url) {
            // Ensure URL has protocol
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
                console.log(`Added protocol to URL: ${url}`);
            }
            
            element.href = url;
            element.style.display = 'inline-block';
            console.log(`Successfully updated ${elementId} with URL: ${url}`);
        } else if (element) {
            element.style.display = 'none';
            console.log(`Hiding ${elementId} due to missing URL`);
        } else {
            console.warn(`Element with ID ${elementId} not found in the document`);
        }
    };

    // Helper function to validate URLs
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    const showError = (message) => {
        const errorElement = document.getElementById('error-message');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove('hidden');
        }

        // Hide loading state
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.classList.add('hidden');
        }
    };

    const showDefaultView = () => {
        // Show the default view with Lucas's information
        const defaultView = document.getElementById('default-view');
        if (defaultView) {
            defaultView.classList.remove('hidden');
        }

        // Add event listener to the "Get My Card" button
        const getCardButton = document.getElementById('get-card-button');
        if (getCardButton) {
            getCardButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Get all current URL parameters
                const currentParams = new URLSearchParams(window.location.search);
                
                // Always preserve agent from URL or sessionStorage
                if (!currentParams.has('agent') && sessionStorage.getItem('currentAgent')) {
                    currentParams.set('agent', sessionStorage.getItem('currentAgent'));
                }
                // Always preserve lo from URL or sessionStorage
                if (!currentParams.has('lo') && sessionStorage.getItem('currentLO')) {
                    currentParams.set('lo', sessionStorage.getItem('currentLO'));
                }
                
                // If no agent parameter is present, use the Realtor form based on LO profile
                if (!currentParams.has('agent')) {
                    currentParams.set('form', 'realtor');
                    if (window.currentLOProfile && window.currentLOProfile.realtorForm) {
                        currentParams.set('formId', window.currentLOProfile.realtorForm);
                    }
                }
                                
                window.location.href = `forms.html?${currentParams.toString()}`;
            });
        }

        // Add error handling for the default headshot image
        const defaultHeadshot = document.getElementById('default-headshot');
        if (defaultHeadshot) {
            defaultHeadshot.onerror = function() {
                console.error('Failed to load default headshot image');
                this.src = 'placeholder-image.jpg'; // Fallback to placeholder
            };
        }
    };

    const setupPrimaryButtons = () => {
        document.querySelectorAll('.primary-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get all current URL parameters to preserve them
                const currentParams = new URLSearchParams(window.location.search);
                
                if (currentParams.has('agent')) {
                    // Option 2: Agent & LO parameters: use LO lead form.
                    currentParams.set('form', 'customer');
                    if (window.currentLOProfile && window.currentLOProfile.leadForm) {
                        currentParams.set('formId', window.currentLOProfile.leadForm);
                    }
                } else {
                    // Option 1: Only LO parameter: use LO realtor form.
                    currentParams.set('form', 'realtor');
                    if (window.currentLOProfile && window.currentLOProfile.realtorForm) {
                        currentParams.set('formId', window.currentLOProfile.realtorForm);
                    }
                }
                          
                window.location.href = 'forms.html?' + currentParams.toString();
            });
        });
    };

    // New function to adjust LO card headline font size to match button width
    function adjustLOHeadlineFont() {
        const headline = document.querySelector('#lo-card .primary-headline');
        const button = document.getElementById('get-card-button');
        if (!headline || !button) return;
        const targetWidth = button.offsetWidth;
        let fontSize = parseFloat(window.getComputedStyle(headline).fontSize);
        
        // Decrease font size if headline is too wide
        while (headline.offsetWidth > targetWidth && fontSize > 10) {
            fontSize -= 1;
            headline.style.fontSize = fontSize + 'px';
        }
        // Increase font size as long as it fits
        while (headline.offsetWidth < targetWidth && fontSize < 100) {
            fontSize += 1;
            headline.style.fontSize = fontSize + 'px';
            if (headline.offsetWidth > targetWidth) {
                fontSize -= 1;
                headline.style.fontSize = fontSize + 'px';
                break;
            }
        }
    }

    if (agent) {
        // Show loading state
        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.classList.remove('hidden');
        }

        callRealtorHandler(agent);
    } else {
        // When no agent parameter is found, show the default view
        showDefaultView();
    }

    // Adjust LO headline font when DOM is loaded and on window resize
    document.addEventListener("DOMContentLoaded", function() {
        if (document.getElementById("lo-card").style.display !== "none") {
            adjustLOHeadlineFont();
        }
        window.addEventListener("resize", adjustLOHeadlineFont);
    });

    // Initialize the primary buttons when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', setupPrimaryButtons);
})();