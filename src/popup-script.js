document.addEventListener('DOMContentLoaded', function() {
    const openTabButton = document.getElementById('open-tab');
    
    openTabButton.addEventListener('click', function() {
        chrome.tabs.create({ url: 'index.html' });
    });
});
