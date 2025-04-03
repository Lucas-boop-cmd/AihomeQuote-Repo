// Early execution path redirection
(function() {
    try {
        const url = new URL(window.location.href);
        const pathSegments = url.pathname.split("/").filter(Boolean);
        
        if (pathSegments.length >= 1 && url.pathname !== '/') {
            const lo = pathSegments[0];
            console.log('Early redirect: Path segment detected:', lo);
            
            const params = new URLSearchParams(window.location.search);
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
    // Check if we need to handle agent parameter - only proceed if no "lo" parameter is present
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('lo')) {
        // If "lo" parameter exists, Lo.js will handle it
        return;
    }
    
    // Backup path-based navigation handler
    const handlePathBasedNavigation = () => {
        try {
            const url = new URL(window.location.href);
            const pathSegments = url.pathname.split("/").filter(Boolean);
            
            if (pathSegments.length >= 1 && url.pathname !== '/') {
                const lo = pathSegments[0];
                console.log('Backup handler: Path segment detected:', lo);
                
                const params = new URLSearchParams(window.location.search);
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

    // Get API base URL from environment or set a default
    const getApiBaseUrl = () => {
        // Check if we have a global variable (set by the hosting environment)
        if (typeof window.REACT_APP_API_BASE_URL !== 'undefined') {
            return window.REACT_APP_API_BASE_URL;
        }

        // Try some bundlers do this
        if (window.env && window.env.REACT_APP_API_BASE_URL) {
            return window.env.REACT_APP_API_BASE_URL;
        }

        // Fallback to hardcoded value
        return 'https://bluebubbles-middleware.onrender.com';
    };

    const getAgentParameter = () => {
        return urlParams.get('agent');
    };

    const agent = getAgentParameter();

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
        }

        // Update contact info
        const contactInfo = document.getElementById('contact-info');
        if (contactInfo) {
            let contactHtml = '';
            if (realtorData.email) {
                contactHtml += `<p class="text-gray-600 mb-2">Email: <a href="mailto:${realtorData.email}" class="text-blue-600 hover:underline">${realtorData.email}</a></p>`;
            }
            if (realtorData.phone) {
                contactHtml += `<p class="text-gray-600 mb-2">Phone: <a href="tel:${realtorData.phone}" class="text-blue-600 hover:underline">${realtorData.phone}</a></p>`;
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
                const currentParams = new URLSearchParams(window.location.search);
                // Always preserve agent from URL or sessionStorage
                if (!currentParams.has('agent') && sessionStorage.getItem('currentAgent')) {
                    currentParams.set('agent', sessionStorage.getItem('currentAgent'));
                }
                // Always preserve lo from URL or sessionStorage
                if (!currentParams.has('lo') && sessionStorage.getItem('currentLO')) {
                    currentParams.set('lo', sessionStorage.getItem('currentLO'));
                }
                // If no agent parameter is present, force the Realtor form based on LO profile
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
        // Find all elements with class "primary-button"
        const primaryButtons = document.querySelectorAll('.primary-button');
        
        // Add click event listener to each button
        primaryButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get all current URL parameters
                const currentParams = new URLSearchParams(window.location.search);
                
                // Create URL string for forms.html with all current parameters
                let formsUrl = 'forms.html';
                const paramString = currentParams.toString();
                
                if (paramString) {
                    formsUrl += '?' + paramString;
                }
                
                // Navigate to forms.html with the parameters
                window.location.href = formsUrl;
            });
        });
    };

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
    
    // Initialize the primary buttons when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', setupPrimaryButtons);
})();