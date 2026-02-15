/**
 * EliteDownloader AIO - Ultra Streamlined 
 * This version uses your trusted AIO API to handle all platforms automatically.
 */

// 1. CONFIGURATION
const MY_AIO_KEY = "https://eliteprotech-apis.zone.id/aio3"; 
const API_ENDPOINT = "https://eliteprotech-apis.zone.id/aio"; // Ensure this matches your AIO endpoint

const downloadBtn = document.getElementById('downloadBtn');
const resultArea = document.getElementById('resultArea');
const urlInput = document.getElementById('videoUrl');

// 2. MAIN LOGIC
downloadBtn.addEventListener('click', async () => {
    const rawUrl = urlInput.value.trim();
    if (!rawUrl) return alert("Please paste a social media link!");

    // URL CLEANER: Removes the junk at the end of links that causes 404/Blank pages
    // Example: converts 'youtube.com/watch?v=123&feature=share' to 'youtube.com/watch?v=123'
    const cleanUrl = rawUrl.split('&')[0].split('?si=')[0];

    setLoading(true);

    try {
        // We send the link to your AIO endpoint. It detects the platform automatically.
        const response = await fetch(`${API_ENDPOINT}?url=${encodeURIComponent(cleanUrl)}&apikey=${MY_AIO_KEY}`);
        const data = await response.json();

        // Checking for any sign of success in the JSON response
        if (data.success || data.status === true || data.result) {
            renderResult(data);
        } else {
            showError(data.message || "Link not supported or private content.");
        }
    } catch (err) {
        showError("Connection error. Please check your API key and endpoint.");
    } finally {
        setLoading(false);
    }
});

// 3. THE UI RENDERER
function renderResult(data) {
    // This finds the video link regardless of what the API names the field
    const dlLink = data.url || data.downloadURL || (data.result && data.result.url) || (data.links && data.links[0]);
    const thumb = data.thumbnail || data.cover || (data.result && data.result.thumbnail) || "https://via.placeholder.com/400x220?text=Media+Ready";
    const title = data.title || "Media Content Found";

    resultArea.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-3xl border border-gray-700 shadow-2xl animate-fade-in text-center">
            <img src="${thumb}" class="w-full h-48 object-cover rounded-2xl mb-4 border border-gray-700 shadow-md">
            <h3 class="font-bold text-lg mb-6 text-white truncate px-2">${title}</h3>
            
            <div class="flex flex-col gap-3">
                <a href="${dlLink}" 
                   target="_blank" 
                   rel="noreferrer noopener"
                   referrerpolicy="no-referrer"
                   class="bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95">
                   ⬇️ DOWNLOAD NOW
                </a>
                <p class="text-[10px] text-gray-500 uppercase tracking-widest">Processed via Elite AIO Engine</p>
            </div>
        </div>
    `;
}

// 4. HELPERS
function setLoading(isLoading) {
    if (isLoading) {
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = `⏳ Processing...`;
        resultArea.innerHTML = `<div class="py-12 text-gray-500 italic text-center animate-pulse">Analyzing link...</div>`;
    } else {
        downloadBtn.disabled = false;
        downloadBtn.innerHTML = "Fetch";
    }
}

function showError(msg) {
    resultArea.innerHTML = `
        <div class="p-4 bg-red-900/20 text-red-400 rounded-xl border border-red-500/40 text-sm font-medium">
            ⚠️ ${msg}
        </div>
    `;
                }
