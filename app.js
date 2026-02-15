/**
 * EliteDownloader AIO - 2026 Bulletproof Edition
 */

const MY_AIO_KEY = "https://eliteprotech-apis.zone.id/aio3"; 
const API_ENDPOINT = "https://eliteprotech-apis.zone.id/aio"; 

const downloadBtn = document.getElementById('downloadBtn');
const resultArea = document.getElementById('resultArea');

// 1. CREATE HIDDEN DOWNLOADER
const hiddenIframe = document.createElement('iframe');
hiddenIframe.style.display = 'none';
document.body.appendChild(hiddenIframe);

downloadBtn.addEventListener('click', async () => {
    const url = document.getElementById('videoUrl').value.trim();
    if (!url) return alert("Paste a link!");
    
    setLoading(true);

    try {
        const res = await fetch(`${API_ENDPOINT}?url=${encodeURIComponent(url)}&apikey=${MY_AIO_KEY}`);
        const data = await res.json();

        if (data.url || data.result || data.downloadURL) {
            renderResult(data);
        } else {
            showError("API returned no video. Check link or key.");
        }
    } catch (err) {
        showError("Connection failed.");
    } finally {
        setLoading(false);
    }
});

function renderResult(data) {
    const dlLink = data.url || data.downloadURL || (data.result && data.result.url);
    const thumb = data.thumbnail || data.cover || "https://via.placeholder.com/400x220?text=Ready";

    resultArea.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-2xl animate-fade-in text-center">
            <img src="${thumb}" class="w-full h-44 object-cover rounded-2xl mb-4 border border-gray-700">
            
            <button onclick="smartDownload('${dlLink}')" 
               class="w-full bg-blue-600 py-4 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all">
               🚀 FORCE DOWNLOAD
            </button>
            
            <p id="status-text" class="mt-3 text-[10px] text-gray-500 uppercase tracking-widest">Bypassing platform restrictions...</p>
        </div>
    `;
}

// 2. THE BYPASS ENGINE
async function smartDownload(url) {
    const status = document.getElementById('status-text');
    status.innerText = "⏳ Initiating Secure Stream...";
    status.classList.add('text-blue-400');

    try {
        // Method A: AJAX Blob Fetch (Best for PWA)
        const response = await fetch(url, { method: 'GET', mode: 'cors' });
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const tempLink = document.createElement('a');
        tempLink.href = blobUrl;
        tempLink.download = "EliteVideo_" + Date.now() + ".mp4";
        document.body.appendChild(tempLink);
        tempLink.click();
        
        setTimeout(() => {
            window.URL.revokeObjectURL(blobUrl);
            tempLink.remove();
            status.innerText = "✅ Saved to Device!";
        }, 100);

    } catch (e) {
        // Method B: Hidden Iframe Fallback (Bypasses Blank Page)
        status.innerText = "⚠️ Using Tunnel Mode...";
        hiddenIframe.src = url; 
        // This triggers a browser download prompt WITHOUT leaving the page
    }
}

function setLoading(s) {
    downloadBtn.disabled = s;
    downloadBtn.innerHTML = s ? "⏳ Processing..." : "Fetch";
    if(s) resultArea.innerHTML = `<div class="py-10 text-gray-500 animate-pulse text-center italic">Breaking through...</div>`;
}

function showError(m) {
    resultArea.innerHTML = `<div class="p-4 bg-red-900/20 text-red-400 rounded-xl text-center border border-red-500/30">${m}</div>`;
            }
