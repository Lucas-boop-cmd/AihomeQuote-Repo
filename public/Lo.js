document.addEventListener('DOMContentLoaded', function() {
    // Define LO mapping - Add new LO profiles here
    const loProfiles = {
        // Default profile (if no match is found)
        "default": {
            name: "Lucas Hernandez",
            phone: "+1 954-495-6135",
            image: "https://storage.googleapis.com/msgsndr/h4BWchNdy6Wykng1FfTH/media/67eb0c4b95cc4563411f80f4.webp",
            // Form IDs for different purposes
            realtorForm: "npOQeePCnk9G9Yyqau5U", // ID for form shown to realtors on forms page
            leadForm: "ZdxUZnijqVITonoQQHBQ"     // ID for customer lead form shown on realtor page
        },
        // Example additional profiles - add more as needed
        "brandon": {
            name: "Brandon List", 
            phone: "+1 518-921-2058",
            image: "https://storage.googleapis.com/msgsndr/h4BWchNdy6Wykng1FfTH/media/67ed9062379294249af39069.png",
            // Form IDs for different purposes - replace with actual IDs
            realtorForm: "MhxejrTLnv86zrqvPoQu", // ID for form shown to realtors on forms page
            leadForm: "Aliw2dZU7xnLt0Pd5iKp"     // ID for customer lead form shown on realtor page
        },
        "sarah": {
            name: "Sarah Johnson",
            phone: "+15559876543",
            image: "https://example.com/sarah-johnson.jpg",
            // Form IDs for different purposes - replace with actual IDs
            realtorForm: "your_realtor_form_id_for_sarah", // ID for form shown to realtors on forms page
            leadForm: "your_lead_form_id_for_sarah"        // ID for customer lead form shown on realtor page
        }
        // Add more LO profiles here following the same format
    };

    // Get the LO parameter from the URL
    function getLOParameter() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('lo');
    }

    // Update the default view with the specified LO's information
    function updateLOInformation(loProfile) {
        // Update the headshot image
        const headshot = document.getElementById('default-headshot');
        if (headshot && loProfile.image) {
            headshot.src = loProfile.image;
            headshot.alt = loProfile.name;
        }

        // Update the name
        const nameElement = document.querySelector('#default-view h2');
        if (nameElement) {
            nameElement.textContent = loProfile.name;
        }

        // Update the phone number
        const phoneElement = document.querySelector('#default-view a[href^="tel:"]');
        if (phoneElement && loProfile.phone) {
            phoneElement.href = `tel:${loProfile.phone}`;
            phoneElement.textContent = loProfile.phone;
        }

        // Make sure the default view is visible
        const defaultView = document.getElementById('default-view');
        if (defaultView) {
            defaultView.classList.remove('hidden');
        }

        // Store form IDs in session storage for use in forms.html
        if (loProfile.realtorForm) {
            sessionStorage.setItem('currentRealtorForm', loProfile.realtorForm);
        }
        if (loProfile.leadForm) {
            sessionStorage.setItem('currentLeadForm', loProfile.leadForm);
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
