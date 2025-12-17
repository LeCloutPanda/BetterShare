const defaultMappings = `twitter.com:fxtwitter.com:true
x.com:fxtwitter.com:true
instagram.com:ddinstagram.com:true
tumblr.com:tpmblr.com:true
reddit.com:rxddit.com:true
furaffinity.net:true
bsky.app:fxbsky.app:true
tiktok.com:vxtiktok.com:true`;

const params = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid',
    'gclid', 'igshid', 'ref', 'ref_src', 'source', 'si', 'ab_channel', 'is_from_webapp',
    'sender_device'
];

var loadedMappings = [];

var entriesVisible = false;
var entryCreationVisible = false;

document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById("entryHeader").addEventListener("click", () => {
        entriesVisible = !entriesVisible;
        document.getElementById("entryList").classList.toggle('open', entriesVisible);
    })

    document.getElementById("entryCreation").addEventListener("click", () => {
        entryCreationVisible = !entryCreationVisible;
        document.getElementById("entryCreationButtons").classList.toggle('open', entryCreationVisible);
    })

    document.getElementById("entryCreationBtn").addEventListener("click", () => {
        const mask = document.getElementById("entryMask").value;
        const value = document.getElementById("entryValue").value;
        const enabled = true;
        AddEntry(mask, value, enabled);
    });

    document.getElementById('saveBtn').addEventListener('click', async () => {
        await SaveConfig();
    });

    document.getElementById('resetBtn').addEventListener('click', async () => {
        const container = document.getElementById("entryList");
        if (container.firstChild != null) {
            while (container.firstChild) {
                container.removeChild(container.lastChild);
            }
        }

        await ResetConfig(); 
        await LoadConfig();  

        for (let index = 0; index < loadedMappings.length; index++) {
            const mapping = loadedMappings[index];
            await AddEntryItemToPopup(mapping);
        }
    });

    await LoadConfig();
    if (loadedMappings.length <= 0) return;
    
    for (let index = 0; index < loadedMappings.length; index++) {
        const mapping = loadedMappings[index];
        await AddEntryItemToPopup(mapping);
    }
});

async function ResetConfig() {
    var data = {};
    console.log("[BetterShare] Resetting config data");
    data.mappings = defaultMappings;
    chrome.storage.local.set(data, () => {});
}

async function SaveConfig() {
    var data = {};

    var rawString = "";
    for (let index = 0; index < loadedMappings.length; index++) {
        const mapping = loadedMappings[index];
        rawString += `${mapping.mask}:${mapping.value}:${mapping.enabled}\n`;
    }
    console.log("[BetterShare] Saving config data");
    data.mappings = rawString;
    chrome.storage.local.set(data, () => {});
}

async function AddEntry(mask, value, enabled) {
    if (await EntryExists(mask)) return;

    const data = { 
        "mask": mask,
        "value": value,
        "enabled": enabled
    }

    loadedMappings.push(data);  
    AddEntryItemToPopup(data);
}

async function RemoveEntry(key) {
    loadedMappings = loadedMappings.filter(entry => entry.mask !== key);
}

async function EntryExists(key) {
    return loadedMappings.some(entry => entry.mask === key);
}

async function WriteToEntry(mask, key, value) {
    const entry = loadedMappings.find(entry => entry.mask === mask);
    if (entry) {
        entry[key] = value;
        return true;
    }
    return false;
}

async function LoadConfig() {
    loadedMappings = [];

    const settings = await new Promise(resolve => {
        chrome.storage.local.get(['mappings'], resolve);
    });
    const mappings = settings.mappings;

    mappings.split("\n").forEach(map => {
        var values = map.split(":");
        var mask = values[0];
        var value = values[1];
        var enabled = values[2];

        if (mask === undefined) return;
        if (mask === undefined) return;
        if (enabled === undefined) return;

        const data = { 
            "mask": mask,
            "value": value,
            "enabled": enabled
        }

        loadedMappings.push(data);
    });

    console.log(loadedMappings);
}

async function AddEntryItemToPopup(mapping) {
    const container = document.getElementById("entryList");
    const holder = document.createElement('div');
    holder.className = "entryItem";
    container.appendChild(holder);

    const entryHeader = document.createElement('div');
    entryHeader.className = "entryItemHeader";
    holder.appendChild(entryHeader);

    const entryHeaderText = document.createElement('p');
    entryHeaderText.textContent = mapping.mask;
    entryHeader.appendChild(entryHeaderText);
    entryHeader.addEventListener("click", function() {
        if (holder.classList.contains("open")) {
            holder.classList.remove("open");
        } else {
            holder.classList.add("open");
        }
    });  
    
    const entryOptions = document.createElement('div');
    entryOptions.className = 'entryOptions';
    holder.appendChild(entryOptions);
    
    const entryValue = document.createElement('input');
    entryValue.type = 'text';
    entryValue.value = mapping.value;
    entryValue.addEventListener("change", () => {
        const value = textInput.value;
        WriteToEntry(mapping.mask, "value", value);
    });
    entryOptions.appendChild(entryValue);

    const entryEnabled = document.createElement('input');
    entryEnabled.type = 'checkbox';
    entryEnabled.className = "entryEnabled";
    entryEnabled.id = `${mapping.mask}Enabled`;
    entryEnabled.addEventListener("change", () => {
        const enabled = entryEnabled.checked;
        WriteToEntry(mapping.mask, "enabled", enabled);
    })
    entryOptions.appendChild(entryEnabled);

    const entryRemove = document.createElement('button');
    entryRemove.className = "entryRemove";
    entryRemove.id = `${mapping.mask}RemoveButton`;    
    entryRemove.addEventListener("click", () => {
        RemoveEntry(mapping.mask);
        holder.remove();
    });
    entryOptions.appendChild(entryRemove);
}