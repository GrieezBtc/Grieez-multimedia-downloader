const downloadBtn = document.getElementById('downloadBtn');
const resultArea = document.getElementById('resultArea');

downloadBtn.addEventListener('click', async () => {
    const url = document.getElementById('videoUrl').value.trim();
    if (!url) return alert("Please paste a link first!");

    downloadBtn.innerText = "Loading...";
    resultArea.innerHTML = `<div class="animate-pulse text-center">Searching server...</div>`;

    // Routing Logic
    let service = "api";
    if (url.includes("tiktok.com")) service = "tiktok";
    else if (url.includes("instagram.com")) service = "instagram";
    else if (url.includes("youtube.com") || url.includes("youtu.be")) service = "yt";

    const apiEndpoint = `https://eliteprotech-apis.zone.id/${service}?url=${encodeURIComponent(url)}`;

    try {
        const res = await fetch(apiEndpoint);
        const data = await res.json();

        if (data.success) {
            renderResult(data);
        } else {
            resultArea.innerHTML = `<p class="text-red-400">Error: ${data.message}</p>`;
        }
    } catch (err) {
        resultArea.innerHTML = `<p class="text-red-400">Server is currently offline.</p>`;
    } finally {
        downloadBtn.innerText = "Fetch";
    }
});

function renderResult(data) {
    // Extract the download link regardless of what the API calls it
    const dlLink = data.mp4_hd || data.downloadURL || (data.links && data.links[0]) || data.mp4;
    
    resultArea.innerHTML = `
        <div class="bg-gray-800 p-6 rounded-3xl border border-gray-700 animate-fade-in shadow-xl">
            <img src="${data.thumbnail}" class="w-full rounded-2xl mb-4 shadow-lg">
            <h3 class="font-bold text-lg mb-4 truncate">${data.title || 'Video Ready'}</h3>
            <a href="${dlLink}" target="_blank" class="block w-full bg-green-600 py-4 rounded-xl text-center font-bold text-white shadow-lg hover:bg-green-700">
                DOWNLOAD NOW
            </a>
        </div>
    `;
}
