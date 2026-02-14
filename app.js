const downloadBtn = document.getElementById('downloadBtn');
const resultArea = document.getElementById('resultArea');

downloadBtn.addEventListener('click', async () => {
    const url = document.getElementById('videoUrl').value.trim();
    if (!url) return alert("Please paste a link first!");

    downloadBtn.innerText = "Searching...";
    resultArea.innerHTML = `<div class="text-center animate-pulse">Fetching media data...</div>`;

    // 1. Improved Router for all 6 Services
    let service = "api"; 
    if (url.includes("tiktok.com")) service = "tiktok";
    else if (url.includes("instagram.com")) service = "instagram";
    else if (url.includes("youtube.com") || url.includes("youtu.be")) service = "youtube";
    else if (url.includes("facebook.com") || url.includes("fb.watch")) service = "facebook";
    else if (url.includes("twitter.com") || url.includes("x.com")) service = "twitter";
    else if (url.includes("pinterest.com") || url.includes("pin.it")) service = "pinterest";

    const apiEndpoint = `https://eliteprotech-apis.zone.id/${service}?url=${encodeURIComponent(url)}`;

    try {
    const res = await fetch(apiEndpoint);
    const data = await res.json();

    // LOG THE DATA TO CONSOLE FOR DEBUGGING
    console.log("API Response for " + service + ":", data);

    if (data.success || data.status === true) {
        renderResult(data);
    } else {
        // Show the actual error message from the API provider
        resultArea.innerHTML = `<p class="text-red-400">API Error: ${data.message || "Unknown error"}</p>`;
    }
} catch (err) {
    // This tells us if the fetch itself failed
    resultArea.innerHTML = `<p class="text-red-400">Network Error: ${err.message}</p>`;
    }
    
});

function renderResult(data) {
    // 2. Smart Parser: Find the first available link/image
    const dlLink = data.downloadURL || data.mp4_hd || (data.links && data.links[0]) || data.url || data.link;
    
    // Fix for Instagram Preview: Try every common thumbnail key
    const thumbnail = data.thumbnail || data.cover || data.preview || (data.images && data.images[0]) || "https://via.placeholder.com/400x225?text=Preview+Ready";

    const title = data.title || "Social Media Content";

    resultArea.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-3xl border border-gray-700 animate-fade-in shadow-xl">
            <div class="relative mb-4">
                <img src="${thumbnail}" class="w-full rounded-2xl shadow-lg border border-gray-700" onerror="this.src='https://via.placeholder.com/400x225?text=Media+Detected'">
                <span class="absolute top-2 right-2 bg-blue-600 text-xs px-2 py-1 rounded-md font-bold">HD Quality</span>
            </div>
            <h3 class="font-bold text-lg mb-4 line-clamp-2">${title}</h3>
            
            <div class="grid grid-cols-1 gap-3">
                <a href="${dlLink}" target="_blank" class="flex items-center justify-center gap-2 w-full bg-green-600 py-4 rounded-xl text-center font-bold text-white shadow-lg hover:bg-green-700 transition-transform active:scale-95">
                    <span>⬇️</span> DOWNLOAD MEDIA
                </a>
            </div>
        </div>
    `;
}
