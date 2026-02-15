/**
 * EliteDownloader AIO - 2026 Ultimate "Anti-Blank Page" Edition
 */

// 1. CONFIGURATION
const MY_AIO_KEY = "https://eliteprotech-apis.zone.id/aio3"; 
const API_ENDPOINT = "https://eliteprotech-apis.zone.id/aio"; 

const downloadBtn = document.getElementById('downloadBtn');
const resultArea = document.getElementById('resultArea');
const urlInput = document.getElementById('videoUrl');

// 2. MAIN LOGIC
downloadBtn.addEventListener('click', async () => {
    const rawUrl = urlInput.value.trim();
    if (!rawUrl) return alert("Please paste a social media link!");

    // Clean URL to prevent 404s
    const cleanUrl = rawUrl.split('?')[0];

    setLoading(true);

    try {
        const response = await fetch(`${API_ENDPOINT}?url=${encodeURIComponent(cleanUrl)}&apikey=${MY_AIO_KEY}`);
        const data = await response.json();

        if (data.success || data.status === true || data.result) {
            renderResult(data);
        } else {
            showError(data.message || "Media not found. Try another link.");
        }
    } catch (err) {
        showError("API Connection failed. Check your key.");
    } finally {
        setLoading(false);
    }
});

// 3. THE UI RENDERER
function renderResult(data) {
    const dlLink = data.url || data.downloadURL || (data.result && data.result.url) || (data.links && data.links[0]);
    const thumb = data.thumbnail || data.cover || "https://via.placeholder.com/400x220?text=Media+Ready";

    resultArea.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-2xl animate-fade-in text-center">
            <img src="${thumb}" class="w-full h-48 object-cover rounded-2xl mb-4 border border-gray-700 shadow-md">
            
            <div class="flex flex-col gap-3">
                <button onclick="blobDownload('${dlLink}')" 
                   class="bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95">
                   ⬇️ DOWNLOAD TO GALLERY
                </button>
                
                <p id="dl-progress" class="text-[10px] text-gray-500 uppercase tracking-widest">Secure Tunnel Enabled</p>
            </div>
        </div>
    `;
}

// 4. THE BLANK-PAGE KILLER (BLOB DOWNLOADER)
async function blobDownload(url) {
    const statusText = document.getElementById('dl-progress');
    statusText.innerText = "⏳ Requesting File Data...";
    statusText.classList.add("text-blue-400");

    try {
        // We fetch the video as a 'blob' (raw binary data)
        const response = await fetch(url);
        if (!response.ok) throw new Error("CORS Blocked");
        
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        // We create a temporary hidden link to trigger the save
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = "Elite_Media_" + Date.now() + ".mp4";
        document.body.appendChild(a);
        a.click();
        
        // Cleanup
        window.URL.revokeObjectURL(blobUrl);
        a.remove();
        statusText.innerText = "✅ Download Complete!";
    } catch (err) {
        // If the server blocks the 'blob' method, we use the 'Sanitized Tab' fallback
        statusText.innerText = "⚠️ Directing to Media Player...";
        const cleanWindow = window.open();
        cleanWindow.opener = null;
        cleanWindow.location = url;
    }
}

// 5. HELPERS
function setLoading(isLoading) {
    if (isLoading) {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `⏳ Processing...`;
        resultArea.innerHTML = `<div class="py-12 text-gray-500 italic text-center">Bypassing restrictions...</div>`;
    } else {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = "Fetch";
    }
}

function showError(msg) {
    resultArea.innerHTML = `<div class="p-4 bg-red-900/20 text-red-400 rounded-xl border border-red-500/40 text-sm font-medium text-center">${msg}</div>`;
        }
