/**
 * EliteDownloader AIO - 2026 Deep Scan Edition
 */

const MY_AIO_KEY = "https://eliteprotech-apis.zone.id/aio3"; 
const API_ENDPOINT = "https://eliteprotech-apis.zone.id/aio"; 

const downloadBtn = document.getElementById('downloadBtn');
const resultArea = document.getElementById('resultArea');

downloadBtn.addEventListener('click', async () => {
    const rawUrl = document.getElementById('videoUrl').value.trim();
    if (!rawUrl) return alert("Paste a link first!");
    
    // Clean the URL of tracking parameters
    const cleanUrl = rawUrl.split('?')[0];

    setLoading(true);

    try {
        // Attempt 1: Standard Fetch
        let response = await fetch(`${API_ENDPOINT}?url=${encodeURIComponent(cleanUrl)}&apikey=${MY_AIO_KEY}`);
        let data = await response.json();

        // Attempt 2: If Attempt 1 has no video, try adding a render flag (if supported by your API)
        if (!data.url && !data.result) {
            response = await fetch(`${API_ENDPOINT}?url=${encodeURIComponent(cleanUrl)}&apikey=${MY_AIO_KEY}&render=true`);
            data = await response.json();
        }

        // Smart Extraction
        const finalLink = data.url || (data.result && data.result.url) || (data.links && data.links[0]) || (data.data && data.data.main_video);

        if (finalLink) {
            renderResult(data, finalLink);
        } else {
            showError("Media is protected or private. Try a different public link.");
        }
    } catch (err) {
        showError("The API is struggling with this link. Please try again in a moment.");
    } finally {
        setLoading(false);
    }
});

function renderResult(data, dlLink) {
    const thumb = data.thumbnail || data.cover || (data.result && data.result.thumbnail) || "https://via.placeholder.com/400x220?text=Media+Found";
    const title = data.title || "Ready to Save";

    resultArea.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-2xl animate-fade-in text-center">
            <img src="${thumb}" class="w-full h-44 object-cover rounded-2xl mb-4 border border-gray-700 shadow-md">
            <h3 class="text-white font-bold mb-4 truncate">${title}</h3>
            
            <div class="flex flex-col gap-3">
                <button onclick="forceSave('${dlLink}')" 
                   class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 py-4 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all">
                   ⬇️ DOWNLOAD NOW
                </button>
                <p id="dl-status" class="text-[10px] text-gray-500 uppercase">Direct Secure Link</p>
            </div>
        </div>
    `;
}

// INDUSTRY STANDARD DOWNLOAD BYPASS
async function forceSave(url) {
    const status = document.getElementById('dl-status');
    status.innerText = "⏳ Bypassing restrictions...";
    status.classList.add('text-blue-400');

    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = "Elite_Download_" + Math.floor(Date.now() / 1000) + ".mp4";
        document.body.appendChild(a);
        a.click();
        
        document.body.removeChild(a);
        window.URL.revokeObjectURL(blobUrl);
        status.innerText = "✅ Saved!";
    } catch (e) {
        // If Blob is blocked, use the 'No-Referrer' Window Method
        status.innerText = "⚠️ Browser blocked direct save. Opening player...";
        const win = window.open("", "_blank");
        win.opener = null;
        win.location.href = url;
    }
}

function setLoading(s) {
    downloadBtn.disabled = s;
    downloadBtn.innerHTML = s ? "⏳ Scanning..." : "Fetch";
    if(s) resultArea.innerHTML = `<div class="py-10 text-gray-500 text-center italic">Deep scanning for media files...</div>`;
}

function showError(m) {
    resultArea.innerHTML = `<div class="p-4 bg-red-900/20 text-red-400 rounded-xl text-center border border-red-500/30 text-sm">${m}</div>`;
}
    
