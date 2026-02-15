/**
 * EliteDownloader AIO - Master Multi-API Fixed
 */

// 1. CONFIGURATION 
// IMPORTANT: Replace 'PASTE_YOUR_ACTUAL_KEY_HERE' with your real API keys (just the letters/numbers).
const API_CONFIG = {
    tiktok: { url: "https://eliteprotech-apis.zone.id/tiktok", key: "PASTE_YOUR_ACTUAL_KEY_HERE" },
    instagram: { url: "https://eliteprotech-apis.zone.id/instagram", key: "PASTE_YOUR_ACTUAL_KEY_HERE" },
    threads: { url: "https://eliteprotech-apis.zone.id/threads", key: "PASTE_YOUR_ACTUAL_KEY_HERE" },
    youtube: { url: "https://eliteprotech-apis.zone.id/ytdown", key: "PASTE_YOUR_ACTUAL_KEY_HERE" }, // URL cleaned
    facebook: { url: "https://eliteprotech-apis.zone.id/facebook", key: "PASTE_YOUR_ACTUAL_KEY_HERE" },
    twitter: { url: "https://eliteprotech-apis.zone.id/twitter", key: "PASTE_YOUR_ACTUAL_KEY_HERE" },
    pinterest: { url: "https://eliteprotech-apis.zone.id/pinterest", key: "PASTE_YOUR_ACTUAL_KEY_HERE" }
};

const downloadBtn = document.getElementById('downloadBtn');
const resultArea = document.getElementById('resultArea');

// 2. THE ROUTER
downloadBtn.addEventListener('click', async () => {
    const inputUrl = document.getElementById('videoUrl').value.trim();
    if (!inputUrl) return alert("Please paste a link!");

    let platform = "";
    const lowUrl = inputUrl.toLowerCase();

    if (lowUrl.includes("tiktok.com")) platform = "tiktok";
    else if (lowUrl.includes("instagram.com")) platform = "instagram";
    else if (lowUrl.includes("threads.net")) platform = "threads";
    else if (lowUrl.includes("youtube.com") || lowUrl.includes("youtu.be")) platform = "youtube";
    else if (lowUrl.includes("facebook.com") || lowUrl.includes("fb.watch")) platform = "facebook";
    else if (lowUrl.includes("twitter.com") || lowUrl.includes("x.com")) platform = "twitter";
    else if (lowUrl.includes("pinterest.com") || lowUrl.includes("pin.it")) platform = "pinterest";

    if (!platform || !API_CONFIG[platform]) {
        return alert("Platform not recognized!");
    }

    updateUI("loading", platform);

    try {
        // Constructing the API URL - Fixed format handling for YouTube
        let targetApi = `${API_CONFIG[platform].url}?url=${encodeURIComponent(inputUrl)}&apikey=${API_CONFIG[platform].key}`;
        
        // Special case for YouTube format
        if(platform === "youtube") targetApi += "&format=mp4";

        const response = await fetch(targetApi);
        const data = await response.json();

        if (data.success || data.status === true || data.result) {
            renderResult(data, platform);
        } else {
            showError(data.message || "Failed to fetch media.");
        }
    } catch (err) {
        showError("Network Error. Please check your connection.");
    } finally {
        updateUI("ready");
    }
});

// 3. THE UI RENDERER (Anti-Blank Page Edition)
function renderResult(data, platform) {
    // Smart Link Finder
    const dlLink = data.url || data.downloadURL || (data.result && data.result.url) || (data.links && data.links[0]);
    const thumb = data.thumbnail || data.cover || (data.result && data.result.thumbnail) || "https://via.placeholder.com/400x220?text=Media+Ready";

    resultArea.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-2xl animate-fade-in text-center">
            <div class="relative mb-4">
                <img src="${thumb}" class="w-full h-48 object-cover rounded-2xl border border-gray-700 shadow-lg">
                <div class="absolute top-2 right-2 bg-blue-600 text-[10px] px-2 py-1 rounded-lg font-bold uppercase">
                    ${platform}
                </div>
            </div>
            <h3 class="font-bold text-lg mb-6 text-white truncate px-2">${data.title || 'Content Found'}</h3>
            
            <div class="flex flex-col gap-3">
                <a href="${dlLink}" 
                   target="_blank" 
                   rel="noreferrer noopener"
                   referrerpolicy="no-referrer"
                   class="bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95">
                   ⬇️ DOWNLOAD MP4
                </a>
                <p class="text-[10px] text-gray-400">If a blank page opens, Long Press and select "Download Link"</p>
            </div>
        </div>
    `;
}

function updateUI(state, platform = "") {
    if (state === "loading") {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `<span>⏳</span> Analyzing...`;
        resultArea.innerHTML = `<div class="py-10 text-gray-500 text-center animate-pulse">Connecting to ${platform}...</div>`;
    } else {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = "Fetch";
    }
}

function showError(msg) {
    resultArea.innerHTML = `<div class="p-4 bg-red-900/30 text-red-400 rounded-xl border border-red-500/50 text-center">${msg}</div>`;
    }
