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
    const dlLink = data.url || data.downloadURL || data.mp4_hd || (data.links && data.links[0]) || data.link;
    const thumbnail = data.thumbnail || data.cover || "https://via.placeholder.com/400x250?text=Media+Ready";

    resultArea.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-3xl border border-gray-700 animate-fade-in shadow-2xl">
            <img src="${thumbnail}" class="w-full h-44 object-cover rounded-2xl mb-4 border border-gray-700 shadow-lg">
            <h3 class="font-bold text-lg mb-4 line-clamp-2 text-blue-100">${data.title || 'Media Ready'}</h3>
            
            <div class="space-y-3">
                <button onclick="cleanOpen('${dlLink}')" 
                   class="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95">
                    🚀 GENERATE DOWNLOAD
                </button>

                <a href="googlechrome://navigate?url=${dlLink}" class="block text-center text-[10px] text-gray-500 uppercase tracking-widest mt-2">
                    Open in Mobile Chrome
                </a>
            </div>
            
            <div class="mt-4 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                <p class="text-[11px] text-blue-300 text-center">
                    <b>NOTE:</b> If a video player opens, tap the <b>three dots (⋮)</b> or <b>long-press</b> the video to save.
                </p>
            </div>
        </div>
    `;
}

// THE SANITIZER: Opens link without "Referrer" info to bypass the blank page
function cleanOpen(url) {
    const newWindow = window.open();
    newWindow.opener = null; // This is the secret to bypassing the block
    newWindow.referrerpolicy = "no-referrer";
    newWindow.location.href = url;
}

// 2. THE FORCE DOWNLOAD FUNCTION
// This function fetches the file as a "blob" to bypass browser navigation blocks
async function forceDownload(url, filename) {
    const btn = document.querySelector('#resultArea button');
    const originalText = btn.innerHTML;
    btn.innerHTML = "⏳ Bypassing Security...";
    
    // We use a public CORS proxy to hide our website's 'Referer'
    const proxyUrl = "https://corsproxy.io/?" + encodeURIComponent(url);

    try {
        const response = await fetch(proxyUrl);
        if (!response.ok) throw new Error("Proxy block");
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename || "video.mp4";
        document.body.appendChild(a);
        a.click();
        
        window.URL.revokeObjectURL(blobUrl);
        a.remove();
        btn.innerHTML = "✅ Download Started!";
    } catch (error) {
        console.error("Proxy failed:", error);
        // If the proxy fails, we fall back to a new tab but with a "Clean" window
        const newTab = window.open();
        newTab.opener = null;
        newTab.location = url;
        btn.innerHTML = "Open in Secure Tab";
    } finally {
        setTimeout(() => { btn.innerHTML = originalText; }, 3000);
    }
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
