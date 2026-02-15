/**
 * EliteDownloader AIO - Multi-API Edition (Threads Updated)
 */

// 1. CONFIGURATION - Fill in your specific API details
const API_CONFIG = {
    tiktok: { url: "https://eliteprotech-apis.zone.id/tiktok", key: "https://eliteprotech-apis.zone.id/tiktok" },
    instagram: { url: "https://eliteprotech-apis.zone.id/instagram", key: "https://eliteprotech-apis.zone.id/instagram" },
    threads: { url: "https://eliteprotech-apis.zone.id/threads", key: "https://eliteprotech-apis.zone.id/threads" }, // Added Threads
    youtube: { url: "https://eliteprotech-apis.zone.id/youtube", key: "https://eliteprotech-apis.zone.id/ytdown?format=mp4" },
    facebook: { url: "https://eliteprotech-apis.zone.id/facebook", key: "https://eliteprotech-apis.zone.id/facebook" },
    twitter: { url: "https://eliteprotech-apis.zone.id/twitter", key: "https://eliteprotech-apis.zone.id/x" },
    pinterest: { url: "https://eliteprotech-apis.zone.id/pinterest", key: "YOUR_KEY" }
};

const downloadBtn = document.getElementById('downloadBtn');
const resultArea = document.getElementById('resultArea');

// 2. THE ROUTER: Detecting the platform
downloadBtn.addEventListener('click', async () => {
    const inputUrl = document.getElementById('videoUrl').value.trim();
    if (!inputUrl) return alert("Please paste a link!");

    let platform = "";
    const lowUrl = inputUrl.toLowerCase();

    if (lowUrl.includes("tiktok.com")) platform = "tiktok";
    else if (lowUrl.includes("instagram.com")) platform = "instagram";
    else if (lowUrl.includes("threads.net")) platform = "threads"; // Threads Detection
    else if (lowUrl.includes("youtube.com") || lowUrl.includes("youtu.be")) platform = "youtube";
    else if (lowUrl.includes("facebook.com") || lowUrl.includes("fb.watch")) platform = "facebook";
    else if (lowUrl.includes("twitter.com") || lowUrl.includes("x.com")) platform = "twitter";
    else if (lowUrl.includes("pinterest.com") || lowUrl.includes("pin.it")) platform = "pinterest";

    if (!platform || !API_CONFIG[platform]) {
        return alert("Platform not recognized or API not configured!");
    }

    updateUI("loading", platform);

    try {
        // Constructing the call with your specific key
        const targetApi = `${API_CONFIG[platform].url}?url=${encodeURIComponent(inputUrl)}&apikey=${API_CONFIG[platform].key}`;
        
        const response = await fetch(targetApi);
        const data = await response.json();

        if (data.success || data.status === true || data.result) {
            renderResult(data, platform);
        } else {
            showError(data.message || "Failed to fetch media from " + platform);
        }
    } catch (err) {
        showError("Network Error: Could not reach the " + platform + " server.");
    } finally {
        updateUI("ready");
    }
});

// 3. THE UI RENDERER
function renderResult(data, platform) {
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
                   rel="noreferrer"
                   class="bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95">
                   ⬇️ DOWNLOAD MP4
                </a>
                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Secure Direct Link</p>
            </div>
        </div>
    `;
}

// 4. UI HELPERS
function updateUI(state, platform = "") {
    if (state === "loading") {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `<span>⏳</span> Analyzing...`;
        resultArea.innerHTML = `<div class="py-10 text-gray-500 text-center animate-pulse">Connecting to ${platform} API...</div>`;
    } else {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = "Fetch";
    }
}

function showError(msg) {
    resultArea.innerHTML = `<div class="p-4 bg-red-900/30 text-red-400 rounded-xl border border-red-500/50 text-center font-medium">${msg}</div>`;
}
