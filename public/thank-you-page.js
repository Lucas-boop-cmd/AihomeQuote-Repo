document.addEventListener("DOMContentLoaded", function () {
    // Check if this is a lead form by comparing with LO profiles
    const currentLeadForm = sessionStorage.getItem("currentLeadForm");
    
    // Function to determine if the current form is a lead form
    function isLeadForm(formId) {
        // If loProfiles is available from Lo.js
        if (window.loProfiles) {
            // Check each LO profile
            for (const key in window.loProfiles) {
                const profile = window.loProfiles[key];
                if (profile.leadForm === formId) {
                    return true;
                }
            }
        }
        
        // Fallback to direct mapping for backward compatibility
        const leadForms = {
            "ZdxUZnijqVITonoQQHBQ": true, // Brandon's lead form
            "Aliw2dZU7xnLt0Pd5iKp": true  // Lucas's lead form
        };
        
        return leadForms[formId] || false;
    }
    
    // Only proceed if this is a lead form
    if (currentLeadForm && isLeadForm(currentLeadForm)) {
        console.log("Lead form detected. Triggering SMS.");
        
        // Get the appropriate phone number based on the lead form ID
        let phoneNumber;
        
        // Try to get phone number from loProfiles first
        if (window.loProfiles) {
            for (const key in window.loProfiles) {
                const profile = window.loProfiles[key];
                if (profile.leadForm === currentLeadForm && profile.phone) {
                    phoneNumber = profile.phone.replace(/\D/g, ''); // Remove non-digits
                    if (!phoneNumber.startsWith('+')) {
                        phoneNumber = '+' + phoneNumber;
                    }
                    break;
                }
            }
        }
        
        // Fallback to direct mapping if not found in profiles
        if (!phoneNumber) {
            const leadFormToPhone = {
                "ZdxUZnijqVITonoQQHBQ": "+15189212058", // Brandon's lead form
                "Aliw2dZU7xnLt0Pd5iKp": "+19544956135"  // Lucas's lead form
            };
            
            phoneNumber = leadFormToPhone[currentLeadForm];
        }
        
        // Default to Lucas's number if still not found
        if (!phoneNumber) {
            phoneNumber = "+19544956135";
            console.log("Using default phone number:", phoneNumber);
        } else {
            console.log(`Using phone number for form ${currentLeadForm}: ${phoneNumber}`);
        }

        // Wait a short delay before triggering SMS
        setTimeout(() => {
            const message = "Send my AI Home Quote!";
            const smsLink = `sms:${phoneNumber}?&body=${encodeURIComponent(message)}`;

            window.location.href = smsLink; // Open SMS app

            navigator.clipboard.writeText(message).then(() => {
                console.log("Message copied to clipboard.");
            }).catch(err => {
                console.error("Failed to copy message: ", err);
            });
        }, 1000);
    } else {
        console.log("Not a lead form. SMS functionality not triggered.");
    }
});
