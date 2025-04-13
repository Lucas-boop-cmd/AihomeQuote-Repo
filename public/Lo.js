document.addEventListener('DOMContentLoaded', function() {
    // Define LO mapping - Add new LO profiles here
    const loProfiles = {
        // Default profile (if no match is found)
        "default": {
            name: "Lucas Hernandez",
            phone: "+1 954-495-6135",
            email: "lucas@truratelending.com",
            image: "https://storage.googleapis.com/msgsndr/h4BWchNdy6Wykng1FfTH/media/67eb0c4b95cc4563411f80f4.webp",
            // Social media links
            facebook: "https://facebook.com/lucashernandez",
            instagram: "https://instagram.com/lucashernandez",
            linkedin: "https://linkedin.com/in/lucashernandez",
            // Form IDs for different purposes
            realtorForm: "MhxejrTLnv86zrqvPoQu", // ID for form shown to realtors on forms page
            leadForm: "Aliw2dZU7xnLt0Pd5iKp",     // ID for customer lead form shown on realtor page
            apiUrl: "https://bluebubbles-middleware.onrender.com" // API URL for Lucas
        },
        // Example additional profiles - add more as needed
        "brandon": {
            name: "Brandon List", 
            phone: "+1 518-921-2058",
            email: "Brandon@truratelending.com",
            image: "https://storage.googleapis.com/msgsndr/h4BWchNdy6Wykng1FfTH/media/67ed9062379294249af39069.png",
            // Social media links
            facebook: "https://facebook.com/brandonlist",
            instagram: "https://instagram.com/brandonlist",
            linkedin: "https://linkedin.com/in/brandonlist",
            // Form IDs for different purposes - replace with actual IDs
            realtorForm: "npOQeePCnk9G9Yyqau5U", // ID for form shown to realtors on forms page
            leadForm: "ZdxUZnijqVITonoQQHBQ",     // ID for customer lead form shown on realtor page
            apiUrl: "https://brandon-bluebubbles-middleware-jo7b.onrender.com" // API URL for Brandon
        },
        "sarah": {
            name: "Sarah Johnson",
            phone: "+15559876543",
            image: "https://example.com/sarah-johnson.jpg",
            // Social media links
            facebook: "https://facebook.com/sarahjohnson",
            instagram: "https://instagram.com/sarahjohnson",
            linkedin: "https://linkedin.com/in/sarahjohnson",
            // Form IDs for different purposes - replace with actual IDs
            realtorForm: "your_realtor_form_id_for_sarah", // ID for form shown to realtors on forms page
            leadForm: "your_lead_form_id_for_sarah",        // ID for customer lead form shown on realtor page
            apiUrl: "https://bluebubbles-middleware.onrender.com" // Using default API URL for now
        }
        // Add more LO profiles here following the same format
    };

    // Make loProfiles globally accessible for forms.html
    window.loProfiles = loProfiles;

    // Get the LO parameter from the URL with validation
    function getLOParameter() {
        const urlParams = new URLSearchParams(window.location.search);
        let lo = urlParams.get('lo');
        // Ignore if the parameter value looks like a JS filename
        if (lo && lo.endsWith('.js')) {
            lo = null;
        }
        return lo;
    }

    // Update the LO card with the specified LO's information
    function updateLOInformation(loProfile) {
        // Update the headshot image
        const headshot = document.getElementById('lo-headshot');
        if (headshot && loProfile.image) {
            // Check if image is valid before setting
            const img = new Image();
            img.onload = function() {
                headshot.src = loProfile.image;
                headshot.alt = loProfile.name;
                headshot.style.display = 'block';
            };
            img.onerror = function() {
                console.warn('Failed to load LO image:', loProfile.image);
                headshot.style.display = 'none';
            };
            img.src = loProfile.image;
        } else if (headshot) {
            // No image available
            headshot.style.display = 'none';
        }

        // Update the name
        const nameElement = document.getElementById('lo-name');
        if (nameElement) {
            nameElement.textContent = loProfile.name;
        }

        // Update the phone number
        const phoneElement = document.getElementById('lo-phone');
        if (phoneElement && loProfile.phone) {
            const phoneLink = phoneElement.querySelector('a');
            if (phoneLink) {
                phoneLink.href = `tel:${loProfile.phone}`;
                phoneLink.textContent = loProfile.phone;
            }
        }

        // Update the email on the LO card
        const emailElement = document.getElementById('lo-email');
        if (emailElement && loProfile.email) {
            emailElement.innerHTML = `Email: <a href="mailto:${loProfile.email}" class="text-blue-600 hover:underline">${loProfile.email}</a>`;
        }

        // Update social media links
        updateSocialMediaLinks('lo-facebook', loProfile.facebook);
        updateSocialMediaLinks('lo-instagram', loProfile.instagram);
        updateSocialMediaLinks('lo-linkedin', loProfile.linkedin);

        // Store form IDs in session storage for use in forms.html
        if (loProfile.realtorForm) {
            sessionStorage.setItem('currentRealtorForm', loProfile.realtorForm);
        }
        if (loProfile.leadForm) {
            sessionStorage.setItem('currentLeadForm', loProfile.leadForm);
        }
        

        // Store the LO parameter for later use
        const lo = getLOParameter();
        if (lo) {
            sessionStorage.setItem('currentLO', lo);
        }

        // Wire up the get-card-button with current LO params
        const getCardButton = document.getElementById('get-card-button');
        if (getCardButton) {
            getCardButton.addEventListener('click', function(e) {
                e.preventDefault();
                // Get all current URL parameters
                const currentParams = new URLSearchParams(window.location.search);
                
                // Set form type and ID from the current LO profile
                currentParams.set('form', 'realtor');
                if (loProfile.realtorForm) {
                    currentParams.set('formId', loProfile.realtorForm);
                }
                
                window.location.href = `forms.html?${currentParams.toString()}`;
            });
        }
    }

    // Helper function to update social media link visibility
    function updateSocialMediaLinks(elementId, url) {
        const element = document.getElementById(elementId);
        if (element && url) {
            element.href = url;
            element.style.display = 'inline-block';
        } else if (element) {
            element.style.display = 'none';
        }
    }

    // Initialize based on URL parameters
    function init() {
        const lo = getLOParameter();
        
        // Get the appropriate LO profile
        const profile = lo && loProfiles[lo] ? loProfiles[lo] : loProfiles["default"];
        
        // Update the page with this profile
        updateLOInformation(profile);

        // Make the profile accessible to other scripts
        window.currentLOProfile = profile;
    }

    // Initialize
    init();
});
