/**
 * EliteDownloader AIO - 2026 Smart Switching Edition
 */

const ELITE_KEY = "https://eliteprotech-apis.zone.id/aio3";
const BACKUP_API = "https://silva-ap-is.vercel.app/"; // Public Testing API (No Key)

const downloadBtn = document.getElementById('downloadBtn');
const resultArea = document.getElementById('resultArea');

downloadBtn.addEventListener('click', async () => {
    const url = document.getElementById('videoUrl').value.trim();
    if (!url) return alert("Paste a link!");

    setLoading(true, "Elite Engine");

    try {
        // ATTEMPT 1: Your Trusted Elite API
        let response = await fetch(`https://eliteprotech-apis.zone.id/aio?url=${encodeURIComponent(url)}&apikey=${ELITE_KEY}`);
        let data = await response.json();

        let dlLink = data.url || (data.result && data.result.url);

        // ATTEMPT 2: Fallback to Backup if Elite says "Private" or "No Video"
        if (!dlLink) {
            setLoading(true, "Backup Engine");
            // This backup uses specific endpoints per platform
            let platform = url.includes("tiktok") ? "tiktok" : url.includes("instagram") ? "instagram" : "youtube";
            let backupRes = await fetch(`${BACKUP_API}${platform}?url=${encodeURIComponent(url)}`);
            let backupData = await backupRes.json();
            dlLink = backupData.url || backupData.result;
        }

        if (dlLink) {
            renderResult(dlLink);
        } else {
            showError("Both engines are blocked by the platform. Please try a different link.");
        }
    } catch (err) {
        showError("Network error. Check your connection.");
    } finally {
        setLoading(false);
    }
});

function renderResult(dlLink) {
    resultArea.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-2xl animate-fade-in text-center">
            <div class="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span class="text-2xl">🎥</span>
            </div>
            <h3 class="text-white font-bold mb-6 uppercase tracking-widest text-sm">Media Ready</h3>
            <button onclick="window.open('${dlLink}', '_blank')" 
               class="w-full bg-blue-600 py-4 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-all">
               ⬇️ DOWNLOAD VIDEO
            </button>
        </div>
    `;
}

function setLoading(s, engine = "") {
    downloadBtn.disabled = s;
    downloadBtn.innerHTML = s ? `⏳ ${engine}...` : "Fetch";
    if(s) resultArea.innerHTML = `<div class="py-10 text-gray-400 text-center italic">Trying ${engine} bypass...</div>`;
}

function showError(m) {
    resultArea.innerHTML = `<div class="p-4 bg-red-900/20 text-red-400 rounded-xl text-center border border-red-500/30 text-xs">${m}</div>`;
}
