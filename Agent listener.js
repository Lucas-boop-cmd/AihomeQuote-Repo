(function() {
    const LocationId = 'h4BWchNdy6Wykng1FfTH';

    const getAgentParameter = () => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('agent');
    };

    const agent = getAgentParameter(); // Define agent here

    const getAgent = () => {
        const agentValue = agent || 'agent';
        searchAgentContact(agent);
        return agentValue;
    };

    const searchAgentContact = async (agent) => {
        if (!agent) {
            console.error('Agent value is missing.');
            updateAgentInfoDisplay(null);
            return null;
        }

        console.log('Agent value:', agent);
        const url = 'https://services.leadconnectorhq.com/contacts/search';

        const headers = {
            'Accept': 'application/json',
            'Authorization': `Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoQ2xhc3MiOiJMb2NhdGlvbiIsImF1dGhDbGFzc0lkIjoiaDRCV2NoTmR5Nld5a25nMUZmVEgiLCJzb3VyY2UiOiJJTlRFR1JBVElPTiIsInNvdXJjZUlkIjoiNjdkNDk5YmQzZTRhOGMzMDc2ZDVlMzI5LW04OTlxYjRsIiwiY2hhbm5lbCI6Ik9BVVRIIiwicHJpbWFyeUF1dGhDbGFzc0lkIjoiaDRCV2NoTmR5Nld5a25nMUZmVEgiLCJvYXV0aE1ldGEiOnsic2NvcGVzIjpbImNvbnZlcnNhdGlvbnMucmVhZG9ubHkiLCJjb252ZXJzYXRpb25zLndyaXRlIiwiY29udmVyc2F0aW9ucy9tZXNzYWdlLnJlYWRvbmx5IiwiY29udmVyc2F0aW9ucy9tZXNzYWdlLndyaXRlIiwiY29udmVyc2F0aW9ucy9yZXBvcnRzLnJlYWRvbmx5IiwiY29udGFjdHMucmVhZG9ubHkiLCJjb250YWN0cy53cml0ZSIsInVzZXJzLnJlYWRvbmx5Iiwid29ya2Zsb3dzLnJlYWRvbmx5Iiwib3Bwb3J0dW5pdGllcy5yZWFkb25seSIsIm9wcG9ydHVuaXRpZXMud3JpdGUiXSwiY2xpZW50IjoiNjdkNDk5YmQzZTRhOGMzMDc2ZDVlMzI5IiwiY2xpZW50S2V5IjoiNjdkNDk5YmQzZTRhOGMzMDc2ZDVlMzI5LW04OTlxYjRsIn0sImlhdCI6MTc0MzA3OTgxOC40ODMsImV4cCI6MTc0MzE2NjIxOC40ODN9.xecj7qPxfBPn1gwsByzABVgnQ0TuXgl7NoLmhPOWjvPmEFWW6MQiTs76424p_OVWw2H_98mBV9PaRru1ANiiqaOdG5LjSE3lEPbegZJ4y8GairJ6-roS4qdml_SMPKgLkPB2DOkuwiPDZjMvYlQRHXKKt9FMtCtp6pzz3OLhuW7IybubLHdFzZVpolpTJY5kuMKWMqB7SfCdY-jopnzbiXg5ryqroonhW07n_gbqletv8WzcIRTPNAv0W22ombQzaNptdZc1fhWXPOjJv9wf7-YnO3V8b3fG2bDwJMKhdqFY1fNhD385hQJa2SCy4iEPiZpte_KEdPfmTwpqCZCpJA_J83aMZFvb-Bn4GNceCgaMkDLnqRZfDDHPXmOmpTsE9LP7aZiuxMYTHfkr2yOALCkQUj5bHaIrb541_nQFa2W_Fuw1Zs5NynhftLHr4-eVRNn2L5CGk6Qc7kJWk1gQndGdq8Rui7JChTm4Q6W5QvIwWpMP7uYHcclIQBUVX_QdjQf2mik34kIaJZeCnmjRJD6dNML5cgUvnc2IihRM6KrJ-mkoiArCc3_lV-9hBGeNuskd650wBUgknkFqddt2FQPxtiDZr_oO-WC4pQCJ7-u2Sh4VeKQTMshL9mDVjUhndJpC_Ahp-7NQwrr-Nub1MEqj8v31ZYioe1JLfBdxDkY`,
            'Content-Type': 'application/json',
            'Version': '2021-07-28'
        };

        const data = {
            locationId: LocationId, // Ensure locationId is included
            page: 1, // Add page field to specify the page number
            pageLimit: 10, // Set pageLimit to a valid number (e.g., 10)
            filters: [
                {
                    field: 'businessName',
                    operator: 'eq',
                    value: agent // Ensure agent is passed correctly
                }
            ]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data) // Updated to match the sample
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`HTTP error! status: ${response.status}, responseText:`, errorText);
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            console.log('Response Data:', responseData); // Added log

            if (responseData && responseData.contacts && responseData.contacts.length > 0) {
                const contact = responseData.contacts[0];
                console.log('Contact:', contact); // Added log
                const phone = contact.phone || null;
                const firstNameLowerCase = contact.firstNameLowerCase || null;
                const lastNameLowerCase = contact.lastNameLowerCase || null;
                const email = contact.email || null;
                let headshotURL = null;

                if (contact.customFields && Array.isArray(contact.customFields)) {
                    const headshotField = contact.customFields.find(field => field.key === 'realtor_headshot');
                    headshotURL = headshotField?.value || null;
                }

                const agentInfo = {
                    phone,
                    firstNameLowerCase,
                    lastNameLowerCase,
                    email,
                    headshotURL
                };

                updateAgentInfoDisplay(agentInfo);
                return agentInfo;
            } else {
                updateAgentInfoDisplay(null);
                return null;
            }
        } catch (error) {
            console.error('Error searching for agent contact:', error);
            updateAgentInfoDisplay(null);
            return null;
        }
    };

    const updateAgentInfoDisplay = (agentInfo) => {
        const displayElement = document.getElementById('agentInfoDisplay');
        if (!displayElement) {
            console.error('Element with ID "agentInfoDisplay" not found.');
            return;
        }

        if (agentInfo) {
            console.log('Agent Info:', agentInfo);
            document.querySelector('#agentInfoDisplay .headshot img').src = agentInfo.headshotURL;
            document.querySelector('#agentInfoDisplay h1').textContent = `${agentInfo.firstNameLowerCase} ${agentInfo.lastNameLowerCase}`;
            document.querySelector('#agentInfoDisplay p').textContent = agentInfo.phone;
        } else {
            document.querySelector('#agentInfoDisplay .headshot img').src = '';
            document.querySelector('#agentInfoDisplay h1').textContent = 'No Agent Information Found';
            document.querySelector('#agentInfoDisplay p').textContent = 'Please check the agent parameter in the URL.';
        }
    };

    getAgent(); // Ensure this function call is properly closed
})();