// Early execution path redirection
(function() {
    try {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(window.location.search);
        // Skip redirect if "lo" param exists and appears to reference a JS file
        if (params.has('lo') && params.get('lo').toLowerCase().endsWith('.js')) {
            console.log("Detected lo param ending with .js, skipping early redirect");
            return;nFileExtensions = ['.js', '.css', '.html', '.jpg', '.png', '.svg', '.ico', '.gif', '.woff', '.woff2'];
        }onst isFileRequest = commonFileExtensions.some(ext => path.toLowerCase().endsWith(ext));
        const pathSegments = url.pathname.split("/").filter(Boolean);
        const commonFileExtensions = ['.js', '.css', '.html', '.jpg', '.png', '.svg', '.ico', '.gif', '.woff', '.woff2'];
        const isFileRequest = (
            (pathSegments.length > 0 &&quest detected, skipping early redirect:", path);
                commonFileExtensions.some(ext => pathSegments[pathSegments.length-1].toLowerCase().endsWith(ext))) ||
            (url.search && url.search.indexOf('.js') > -1) ||
            (url.pathname.includes('/scripts/') || url.pathname.includes('/css/') ||
             url.pathname.includes('/images/') || url.pathname.includes('/assets/'))
        ); (params.has('lo') && params.get('lo').toLowerCase().endsWith('.js')) {
            console.log("Detected lo param ending with .js, skipping early redirect");
        if (pathSegments.length >= 1 && url.pathname !== '/' && !isFileRequest) {
            const lo = pathSegments[0];
            console.log('Early redirect: Path segment detected:', lo);
            t pathSegments = url.pathname.split("/").filter(Boolean);
            if (!params.has('lo')) { && url.pathname !== '/' && !isFileRequest) {
                params.set('lo', lo);];
                const newUrl = `${url.origin}/?${params.toString()}`;;
                console.log('Early redirect: Redirecting to', newUrl);
                window.location.replace(newUrl);
            }   params.set('lo', lo);
        }       const newUrl = `${url.origin}/?${params.toString()}`;
    } catch (e) {onsole.log('Early redirect: Redirecting to', newUrl);
        console.error('Early redirect failed:', e);
    }       }
})();   }
    } catch (e) {
// Main application codearly redirect failed:', e);
(() => {
    // Check if we need to handle agent parameter
    const urlParams = new URLSearchParams(window.location.search);
    const agent = urlParams.get('agent');
    => {
    // Backup path-based navigation handler with additional check
    const handlePathBasedNavigation = () => {dow.location.search);
        try {nt = urlParams.get('agent');
            const url = new URL(window.location.href);
            const params = new URLSearchParams(window.location.search);
            
            // Check if this is a direct file request
            const path = url.pathname;
            const commonFileExtensions = ['.js', '.css', '.html', '.jpg', '.png', '.svg', '.ico', '.gif', '.woff', '.woff2'];w URLSearchParams(window.location.search);
            const isFileRequest = commonFileExtensions.some(ext => path.toLowerCase().endsWith(ext));/ Skip if "lo" param exists and references a JS file
            th('.js')) {
            // Skip redirect for file requests
            if (isFileRequest) {
                console.log("Backup handler: Direct file request detected, skipping redirect:", path);
                return false;
            } '.jpg', '.png', '.svg', '.ico', '.gif', '.woff', '.woff2'];
            
            // Skip if "lo" param exists and references a JS file
            if (params.has('lo') && params.get('lo').toLowerCase().endsWith('.js')) {      commonFileExtensions.some(ext => pathSegments[pathSegments.length-1].toLowerCase().endsWith(ext))) ||
                console.log("Detected lo param ending with .js, skipping backup redirect");    (url.search && url.search.indexOf('.js') > -1) ||
                return false; ||
            }ages/') || url.pathname.includes('/assets/'))
            
            const pathSegments = url.pathname.split("/").filter(Boolean);
            if (pathSegments.length >= 1 && url.pathname !== '/' && !isFileRequest) {&& url.pathname !== '/' && !isFileRequest) {
                const lo = pathSegments[0];
                console.log('Backup handler: Path segment detected:', lo);
                if (!params.has('lo')) {
                    params.set('lo', lo);lo', lo);
                    const newUrl = `${url.origin}/?${params.toString()}`;   const newUrl = `${url.origin}/?${params.toString()}`;
                    console.log('Backup handler: Redirecting to', newUrl);       console.log('Backup handler: Redirecting to', newUrl);
                    window.location.replace(newUrl);w.location.replace(newUrl);
                    return true;n true;
                }
            }
            return false;   return false;
        } catch (error) {  } catch (error) {
            console.error('Backup path navigation error:', error);            console.error('Backup path navigation error:', error);
            return false;
        }
    };    };

    // Double-check with the backup handlerup handler
    if (handlePathBasedNavigation()) return;

    // Get API base URL based on LO profile or hardcoded fallbacks
    const getApiBaseUrl = () => {
        // First priority: Check if we have the current LO profile with an API URL/ First priority: Check if we have the current LO profile with an API URL
        if (window.currentLOProfile && window.currentLOProfile.apiUrl) {if (window.currentLOProfile && window.currentLOProfile.apiUrl) {
            console.log('Using API URL from LO profile:', window.currentLOProfile.apiUrl);ile.apiUrl);
            return window.currentLOProfile.apiUrl;
        }
        
        // Second priority: Fallback to hardcoded values based on LO parameterk to hardcoded values based on LO parameter
        const urlParams = new URLSearchParams(window.location.search);
        const lo = urlParams.get('lo');
        if (lo) {
            if (lo === 'brandon') {
                console.log('Using Brandon API URL from hardcoded fallback');lback');
                return 'https://brandon-bluebubbles-middleware-jo7b.onrender.com';   return 'https://brandon-bluebubbles-middleware-jo7b.onrender.com';
            } else if (lo === 'lucas') {   } else if (lo === 'lucas') {
                console.log('Using Lucas API URL from hardcoded fallback');                console.log('Using Lucas API URL from hardcoded fallback');
                return 'https://bluebubbles-middleware.onrender.com';middleware.onrender.com';
            }
        }

        // Final fallback to default API URL        // Final fallback to default API URL
        console.log('Using default API URL fallback');I URL fallback');
        return 'https://bluebubbles-middleware.onrender.com';ddleware.onrender.com';
    };

    const getAgentParameter = () => {
        return urlParams.get('agent');n urlParams.get('agent');
    };

    const callRealtorHandler = async (agentName) => {    const callRealtorHandler = async (agentName) => {
        try {
            const backendUrl = getApiBaseUrl(); getApiBaseUrl();
            console.log('Using backend URL:', backendUrl);sing backend URL:', backendUrl);

            const response = await fetch(`${backendUrl}/realtors?businessName=${encodeURIComponent(agentName)}`, {}/realtors?businessName=${encodeURIComponent(agentName)}`, {
                method: 'GET',thod: 'GET',
                headers: {
                    'Accept': 'application/json',     'Accept': 'application/json',
                    'Content-Type': 'application/json'                    'Content-Type': 'application/json'
                },
                mode: 'cors', // Ensure CORS is enabled
            });

            if (!response.ok) {            if (!response.ok) {
                console.error('Error response:', await response.text());, await response.text());
                throw new Error(`HTTP error! status: ${response.status}`);atus: ${response.status}`);
            }            }

            const data = await response.json();nse.json();
            console.log('Realtor data:', data);Realtor data:', data);

            // Update the page with realtor information
            updateRealtorInfo(data);   updateRealtorInfo(data);
        } catch (error) {  } catch (error) {
            console.error('Error calling realtor handler:', error);            console.error('Error calling realtor handler:', error);
            showError(`Could not load realtor information: ${error.message}`);formation: ${error.message}`);
        }
    };

    const updateRealtorInfo = (realtorData) => {ltorData) => {
        // Log the entire data object for debugging
        console.log('Complete realtor data object:', realtorData);mplete realtor data object:', realtorData);

        // Update realtor headshot
        const headshot = document.getElementById('realtor-headshot');shot');
        if (headshot) {        if (headshot) {
            // Only use the source field for the headshot URLt URL
            const headshotUrl = realtorData.source;
            console.log('Realtor headshot URL:', headshotUrl);RL:', headshotUrl);

            // Check if headshot URL exists and is valid            // Check if headshot URL exists and is valid
            if (headshotUrl && isValidUrl(headshotUrl)) { {
                headshot.src = headshotUrl;
                headshot.alt = `${realtorData.firstName} ${realtorData.lastName}`;ata.lastName}`;

                // Add error handling for image loading Add error handling for image loading
                headshot.onerror = function() {shot.onerror = function() {
                    console.error('Failed to load headshot image');');
                    // Keep the placeholder image
                };   };
            } else {   } else {
                console.warn('Missing or invalid headshot URL');                console.warn('Missing or invalid headshot URL');
                // The placeholder image will remainlder image will remain
            }
        }

        // Update realtor name/ Update realtor name
        const name = document.getElementById('realtor-name');        const name = document.getElementById('realtor-name');
        if (name) {
            name.textContent = `${realtorData.firstName} ${realtorData.lastName}`;ta.lastName}`;
        }

        // Update contact info
        const contactInfo = document.getElementById('contact-info');
        if (contactInfo) {ontactInfo) {
            let contactHtml = '';
            if (realtorData.email) {
                contactHtml += `<p class="text-gray-600 mb-2">Email: <a href="mailto:${realtorData.email}" class="text-blue-600 hover:underline">${realtorData.email}</a></p>`;   contactHtml += `<p class="text-gray-600 mb-2">Email: <a href="mailto:${realtorData.email}" class="text-blue-600 hover:underline">${realtorData.email}</a></p>`;
            }            }
            if (realtorData.phone) {
                contactHtml += `<p class="text-gray-600 mb-2">Phone: <a href="tel:${realtorData.phone}" class="text-blue-600 hover:underline">${realtorData.phone}</a></p>`; <a href="tel:${realtorData.phone}" class="text-blue-600 hover:underline">${realtorData.phone}</a></p>`;
            }

            // Add link to forms if the realtor has anyas any
            if (realtorData.forms && realtorData.forms.length > 0) {
                contactHtml += '<div class="mt-4">';">';
                realtorData.forms.forEach(form => {
                    // Get current URL parameters
                    const currentParams = new URLSearchParams(window.location.search);tParams = new URLSearchParams(window.location.search);
                    // Set the form ID parameter
                    currentParams.set('form', form.id);urrentParams.set('form', form.id);
                    // Make sure agent parameter is included
                    if (agent) {
                        currentParams.set('agent', agent);     currentParams.set('agent', agent);
                    }
                    // Create form URL with all parameters preserved       // Create form URL with all parameters preserved
                    contactHtml += `<p class="mb-2"><a href="forms.html?${currentParams.toString()}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">${form.title || 'Complete Form'}</a></p>`;                    contactHtml += `<p class="mb-2"><a href="forms.html?${currentParams.toString()}" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">${form.title || 'Complete Form'}</a></p>`;
                });
                contactHtml += '</div>';       contactHtml += '</div>';
            }            }

            contactInfo.innerHTML = contactHtml;
        }

        // Show the realtor card/ Show the realtor card
        const realtorCard = document.getElementById('realtor-card');        const realtorCard = document.getElementById('realtor-card');
        if (realtorCard) {
            realtorCard.classList.remove('hidden');
        }

        // Hide loading state/ Hide loading state
        const loadingElement = document.getElementById('loading');  const loadingElement = document.getElementById('loading');
        if (loadingElement) {        if (loadingElement) {
            loadingElement.classList.add('hidden');d('hidden');
        }
    };

    // Helper function to validate URLso validate URLs
    const isValidUrl = (string) => {= (string) => {
        try {
            new URL(string);   new URL(string);
            return true;      return true;
        } catch (_) {        } catch (_) {
            return false;
        }
    };

    const showError = (message) => {
        const errorElement = document.getElementById('error-message');onst errorElement = document.getElementById('error-message');
        if (errorElement) {        if (errorElement) {
            errorElement.textContent = message;Content = message;
            errorElement.classList.remove('hidden');
        }

        // Hide loading state/ Hide loading state
        const loadingElement = document.getElementById('loading');  const loadingElement = document.getElementById('loading');
        if (loadingElement) {        if (loadingElement) {
            loadingElement.classList.add('hidden');t.add('hidden');
        }
    };

    const showDefaultView = () => {
        // Show the default view with Lucas's information/ Show the default view with Lucas's information
        const defaultView = document.getElementById('default-view');        const defaultView = document.getElementById('default-view');
        if (defaultView) {
            defaultView.classList.remove('hidden');
        }

        // Add event listener to the "Get My Card" buttone "Get My Card" button
        const getCardButton = document.getElementById('get-card-button');ById('get-card-button');
        if (getCardButton) {
            getCardButton.addEventListener('click', (e) => {ardButton.addEventListener('click', (e) => {
                e.preventDefault();
                // Get all current URL parameters
                const currentParams = new URLSearchParams(window.location.search);
                
                // Always preserve agent from URL or sessionStorageage
                if (!currentParams.has('agent') && sessionStorage.getItem('currentAgent')) {t')) {
                    currentParams.set('agent', sessionStorage.getItem('currentAgent'));nt'));
                }
                // Always preserve lo from URL or sessionStorage// Always preserve lo from URL or sessionStorage
                if (!currentParams.has('lo') && sessionStorage.getItem('currentLO')) {
                    currentParams.set('lo', sessionStorage.getItem('currentLO'));nStorage.getItem('currentLO'));
                }
                
                // If no agent parameter is present, use the Realtor form based on LO profilefile
                if (!currentParams.has('agent')) {currentParams.has('agent')) {
                    currentParams.set('form', 'realtor');   currentParams.set('form', 'realtor');
                    if (window.currentLOProfile && window.currentLOProfile.realtorForm) {    if (window.currentLOProfile && window.currentLOProfile.realtorForm) {
                        currentParams.set('formId', window.currentLOProfile.realtorForm);torForm);
                    }     }
                }       }
                                
                window.location.href = `forms.html?${currentParams.toString()}`;Params.toString()}`;
            });
        }

        // Add error handling for the default headshot image
        const defaultHeadshot = document.getElementById('default-headshot');
        if (defaultHeadshot) {faultHeadshot) {
            defaultHeadshot.onerror = function() {   defaultHeadshot.onerror = function() {
                console.error('Failed to load default headshot image');          console.error('Failed to load default headshot image');
                this.src = 'placeholder-image.jpg'; // Fallback to placeholder                this.src = 'placeholder-image.jpg'; // Fallback to placeholder
            };
        }
    };

    const setupPrimaryButtons = () => {rimaryButtons = () => {
        document.querySelectorAll('.primary-button').forEach(button => {n => {
            button.addEventListener('click', (e) => {
                e.preventDefault();e.preventDefault();
                
                // Get all current URL parameters to preserve them
                const currentParams = new URLSearchParams(window.location.search);window.location.search);
                
                if (currentParams.has('agent')) {
                    // Option 2: Agent & LO parameters: use LO lead form./ Option 2: Agent & LO parameters: use LO lead form.
                    currentParams.set('form', 'customer');entParams.set('form', 'customer');
                    if (window.currentLOProfile && window.currentLOProfile.leadForm) {le.leadForm) {
                        currentParams.set('formId', window.currentLOProfile.leadForm);w.currentLOProfile.leadForm);
                    }
                } else {
                    // Option 1: Only LO parameter: use LO realtor form./ Option 1: Only LO parameter: use LO realtor form.
                    currentParams.set('form', 'realtor');   currentParams.set('form', 'realtor');
                    if (window.currentLOProfile && window.currentLOProfile.realtorForm) {    if (window.currentLOProfile && window.currentLOProfile.realtorForm) {
                        currentParams.set('formId', window.currentLOProfile.realtorForm);torForm);
                    }     }
                }     }
                          
                window.location.href = 'forms.html?' + currentParams.toString();                window.location.href = 'forms.html?' + currentParams.toString();
            });
        });
    };

    if (agent) {
        // Show loading state/ Show loading state
        const loadingElement = document.getElementById('loading');        const loadingElement = document.getElementById('loading');
        if (loadingElement) {
            loadingElement.classList.remove('hidden');loadingElement.classList.remove('hidden');
        }

        callRealtorHandler(agent);   callRealtorHandler(agent);
    } else {} else {
        // When no agent parameter is found, show the default view
        showDefaultView();
    }




})();    document.addEventListener('DOMContentLoaded', setupPrimaryButtons);    // Initialize the primary buttons when the DOM is fully loaded        
    // Initialize the primary buttons when the DOM is fully loaded
    document.addEventListener('DOMContentLoaded', setupPrimaryButtons);
})();