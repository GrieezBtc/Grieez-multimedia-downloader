/**
 * EliteDownloader AIO - Core Logic
 * Handles: TikTok, Instagram, YouTube, Facebook, Twitter (X), Pinterest
 */

const downloadBtn = document.getElementById('downloadBtn');
const resultArea = document.getElementById('resultArea');
const videoInput = document.getElementById('videoUrl');

// 1. MAIN EVENT LISTENER
downloadBtn.addEventListener('click', async () => {
    const url = videoInput.value.trim();
    
    if (!url) {
        showError("Please paste a valid social media link!");
        return;
    }

    setLoadingState(true);

    // 2. SMART ROUTER
    // Maps the user URL to the correct API endpoint naming convention
    let service = "";
    const lowUrl = url.toLowerCase();

    if (lowUrl.includes("tiktok.com")) {
        service = "tiktok";
    } else if (lowUrl.includes("instagram.com")) {
        service = "instagram";
    } else if (lowUrl.includes("youtube.com") || lowUrl.includes("youtu.be")) {
        service = "youtube"; // Try changing to 'ytdl' if 500 error persists
    } else if (lowUrl.includes("facebook.com") || lowUrl.includes("fb.watch")) {
        service = "facebook";
    } else if (lowUrl.includes("twitter.com") || lowUrl.includes("x.com")) {
        service = "twitter";
    } else if (lowUrl.includes("pinterest.com") || lowUrl.includes("pin.it")) {
        service = "pinterest";
    }

    if (!service) {
        showError("This platform is not supported yet.");
        setLoadingState(false);
        return;
    }

    // 3. API CALL WITH URL ENCODING
    // encodeURIComponent ensures special characters like & or ? don't break the request
    const apiEndpoint = `https://eliteprotech-apis.zone.id/${service}?url=${encodeURIComponent(url)}`;

    try {
        const response = await fetch(apiEndpoint);
        
        // Handle Server Crashes (500)
        if (response.status === 500) {
            throw new Error("The API server for " + service + " is currently down for maintenance.");
        }

        const data = await response.json();

        if (data.success || data.status === true) {
            renderResult(data, service);
        } else {
            showError(data.message || "Invalid Link or Private Content");
        }

    } catch (err) {
        console.error("Critical Error:", err);
        showError(err.message || "Connection failed. Check your internet.");
    } finally {
        setLoadingState(false);
    }
});

// 4. RENDERING THE DOWNLOAD CARD
function renderResult(data, service) {
    // Smart Parsing: Looks for links in every possible JSON field used by different platforms
    const downloadUrl = data.url || data.downloadURL || data.mp4_hd || (data.links && data.links[0]) || data.link;
    const thumbnail = data.thumbnail || data.cover || (data.images && data.images[0]) || "https://via.placeholder.com/400x250?text=Media+Ready";
    const title = data.title || (service.toUpperCase() + " Media");

    resultArea.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-3xl border border-gray-700 animate-fade-in shadow-2xl">
            <div class="relative group">
                <img src="${thumbnail}" class="w-full h-48 object-cover rounded-2xl mb-4 border border-gray-700 shadow-lg" 
                     onerror="this.src='https://via.placeholder.com/400x250?text=Video+Ready'">
                <div class="absolute top-3 left-3 bg-black/60 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
                    ${service}
                </div>
            </div>
            
            <h3 class="font-bold text-lg mb-5 line-clamp-2 text-blue-100">${title}</h3>
            
            <div class="space-y-3">
                <a href="${downloadUrl}" 
                   target="_self" 
                   rel="noreferrer"
                   download="Elite_${service}_Media"
                   class="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-green-600 to-emerald-600 py-4 rounded-xl font-bold text-white shadow-lg hover:brightness-110 transition-all active:scale-95">
                    <span>⬇️</span> DOWNLOAD NOW
                </a>
                
                <p class="text-[10px] text-gray-500 text-center uppercase tracking-tighter">
                    If download fails, hold the button and select "Save Link As"
                </p>
            </div>
        </div>
    `;
}

// 5. HELPER FUNCTIONS
function setLoadingState(isLoading) {
    if (isLoading) {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `<span class="animate-spin inline-block mr-2">⏳</span> Processing...`;
        resultArea.innerHTML = `<div class="text-center py-10 text-gray-500 italic">Searching server for media...</div>`;
    } else {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = "Fetch";
    }
}

function showError(msg) {
    resultArea.innerHTML = `
        <div class="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-400 text-center text-sm font-medium">
            ⚠️ ${msg}
        </div>
    `;
                }
