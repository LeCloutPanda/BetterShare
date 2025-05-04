document.addEventListener('DOMContentLoaded', () => {
    const fields = ['twitter', 'instagram', 'tumblr', 'reddit', 'furaffinity', 'bsky', 'tiktok'];
    const defaultValues = {
        twitter: { value: 'fxtwitter.com', enabled: true },
        instagram: { value: 'ddinstagram.com', enabled: true },
        tumblr: { value: 'tpmblr.com', enabled: true },
        reddit: { value: 'rxddit.com', enabled: true },
        furaffinity: { value: 'fxfuraffinity.net', enabled: true },
        bsky: { value: 'fxbsky.app', enabled: true },
        tiktok: { value: 'vxtiktok.com', enabled: true }
    };

    const defaultParams = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid',
        'gclid', 'igshid', 'ref', 'ref_src', 'source', 'si', 'ab_channel', 'is_from_webapp',
        'sender_device'
    ];
   
    const container = document.getElementById("inputForm");
  
    fields.forEach(field => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'collapsible';
        button.textContent = field.charAt(0).toUpperCase() + field.slice(1);
        
        button.addEventListener("click", function() {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.classList.contains("open")) {
                content.classList.remove("open");
            } else {
                content.classList.add("open");
            }
        });

        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        
        const textInput = document.createElement('input');
        textInput.type = 'text';
        textInput.id = field;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${field}Enabled`;
        
        contentDiv.appendChild(textInput);
        contentDiv.appendChild(checkbox);
        
        container.appendChild(button);
        container.appendChild(contentDiv);
    });

    chrome.storage.local.get([...fields, 'stripTracking', 'stripParams'], (data) => {
        fields.forEach(field => {
            if (data[field]) {
                document.getElementById(field).value = data[field].value || "";
                document.getElementById(`${field}Enabled`).checked = data[field].enabled || false;
            }
        });
    
        document.getElementById('stripTracking').checked = data.stripTracking || false;
        document.getElementById('stripParams').value = data.stripParams ? data.stripParams.join(', ') : ''; 
    });

    document.getElementById('saveBtn').addEventListener('click', () => {
        const data = {};
        const stripTracking = document.getElementById('stripTracking').checked;
        const customParamsInput = document.getElementById('stripParams').value;
        
        const customParams = customParamsInput.split(',').map(param => param.trim()).filter(param => param !== '');
    
        fields.forEach(field => {
            let value = document.getElementById(field).value;    
            data[field] = {
                value,
                enabled: document.getElementById(`${field}Enabled`).checked
            };
        });
    
        data.stripTracking = stripTracking;
        data.stripParams = customParams; 
    
        chrome.storage.local.set(data, () => {});
    });

    document.getElementById('resetBtn').addEventListener('click', () => {
        fields.forEach(field => {
            const defaultValue = defaultValues[field];
            document.getElementById(field).value = defaultValue.value;
            document.getElementById(`${field}Enabled`).checked = defaultValue.enabled;
        });
    
        document.getElementById('stripTracking').checked = true;
        document.getElementById('stripParams').value = defaultParams.join(', '); 

        const resetData = {
            ...defaultValues,
            stripTracking: true,
            stripParams: defaultParams
        };
        chrome.storage.local.set(resetData, () => {});
    });
     

});