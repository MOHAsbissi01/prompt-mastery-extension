const display = document.getElementById('count-display');
const resetBtn = document.getElementById('reset-btn');

// Load current count
chrome.storage.local.get(['iterationCount'], (res) => {
    display.innerText = res.iterationCount || 1;
});

// Reset logic
resetBtn.onclick = () => {
    chrome.storage.local.set({ iterationCount: 1 }, () => {
        display.innerText = "1";
        alert("Counter Reset!");
    });
};