document.addEventListener('DOMContentLoaded', function() {
    // Define LO mapping - Add new LO profiles here
    const loProfiles = {
        // Default profile (if no match is found)
        "default": {
            name: "Lucas Hernandez",
            phone: "+19544956135",
            image: "https://storage.googleapis.com/msgsndr/h4BWchNdy6Wykng1FfTH/media/67eb0c4b95cc4563411f80f4.webp"
        },
        // Example additional profiles - add more as needed
        "brandon": {
            name: "Brandon List",
            phone: "+15189212058",
            image: "https://storage.googleapis.com/msgsndr/h4BWchNdy6Wykng1FfTH/media/67ed9062379294249af39069.png"
        },
        "sarah": {
            name: "Sarah Johnson",
            phone: "+15559876543",
            image: "https://example.com/sarah-johnson.jpg"
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
    }

    // Initialize based on URL parameters
    function init() {
        const lo = getLOParameter();
        
        // Get the appropriate LO profile
        const profile = lo && loProfiles[lo] ? loProfiles[lo] : loProfiles["default"];
        
        // Update the page with this profile
        updateLOInformation(profile);
    }

    // Initialize
    init();
});
