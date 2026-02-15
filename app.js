/**
 * EliteDownloader AIO - 2026 Link-Fixer Edition
 */

const MY_AIO_KEY = "https://eliteprotech-apis.zone.id/aio3"; 
const API_ENDPOINT = "https://eliteprotech-apis.zone.id/aio"; 

const downloadBtn = document.getElementById('downloadBtn');
const resultArea = document.getElementById('resultArea');

downloadBtn.addEventListener('click', async () => {
    const rawUrl = document.getElementById('videoUrl').value.trim();
    if (!rawUrl) return alert("Paste a link first!");
    
    // 1. THE LINK CLEANER
    // This removes 'tracking IDs' that cause APIs to return "No Video"
    let cleanUrl = rawUrl;
    if (rawUrl.includes("youtube.com") || rawUrl.includes("youtu.be")) {
        cleanUrl = rawUrl.split("&")[0]; // Removes feature=share, etc.
    } else if (rawUrl.includes("instagram.com") || rawUrl.includes("tiktok.com")) {
        cleanUrl = rawUrl.split("?")[0]; // Removes igsh=, etc.
    }

    setLoading(true);

    try {
        // 2. THE REQUEST
        // Note: Some APIs prefer 'link' instead of 'url' if 'url' fails.
        const response = await fetch(`${API_ENDPOINT}?url=${encodeURIComponent(cleanUrl)}&apikey=${MY_AIO_KEY}`);
        
        const data = await response.json();

        // 3. SMART DATA CHECK
        // Some APIs put the link inside data.result, others in data.url
        const finalLink = data.url || (data.result && data.result.url) || (data.links && data.links[0]);

        if (finalLink) {
            renderResult(data, finalLink);
        } else {
            showError("API found the post, but couldn't grab the video file. It might be private.");
        }
    } catch (err) {
        showError("Server timeout. Try again in a few seconds.");
    } finally {
        setLoading(false);
    }
});

function renderResult(data, dlLink) {
    const thumb = data.thumbnail || data.cover || (data.result && data.result.thumbnail) || "https://via.placeholder.com/400x220?text=Video+Ready";

    resultArea.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-2xl animate-fade-in text-center">
            <img src="${thumb}" class="w-full h-44 object-cover rounded-2xl mb-4 border border-gray-700">
            
            <button onclick="downloadWithBypass('${dlLink}')" 
               class="w-full bg-blue-600 py-4 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all">
               ⬇️ DOWNLOAD NOW
            </button>
            
            <p id="status-msg" class="mt-3 text-[10px] text-gray-500 uppercase tracking-widest">Link verified. Tap to save.</p>
        </div>
    `;
}

// 4. THE BYPASS FUNCTION (Stops the Blank Page)
function downloadWithBypass(url) {
    const msg = document.getElementById('status-msg');
    msg.innerText = "🚀 Starting Download...";
    
    // This creates a temporary invisible link that triggers a download instead of a redirect
    const x = new XMLHttpRequest();
    x.open("GET", url, true);
    x.responseType = 'blob';
    x.onload = function(e) {
        const url = window.URL.createObjectURL(x.response);
        const a = document.createElement('a');
        a.href = url;
        a.download = "EliteDownloader_" + Date.now() + ".mp4";
        document.body.appendChild(a);
        a.click();
        msg.innerText = "✅ Done!";
    };
    x.onerror = function() {
        // Fallback if the browser blocks the background download
        window.location.href = url; 
    };
    x.send();
}

function setLoading(s) {
    downloadBtn.disabled = s;
    downloadBtn.innerHTML = s ? "⏳ Searching..." : "Fetch";
    if(s) resultArea.innerHTML = `<div class="py-10 text-gray-500 text-center italic">Cleaning link and fetching...</div>`;
}

function showError(m) {
    resultArea.innerHTML = `<div class="p-4 bg-red-900/20 text-red-400 rounded-xl text-center border border-red-500/30">${m}</div>`;
}
