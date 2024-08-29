document.getElementById('analyze').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: analyzePrivacy,
    });
  });
});

function analyzePrivacy() {
  const trackers = [];
  const cookies = document.cookie.split(';');
  const scripts = Array.from(document.scripts).map(script => script.src);

  const trackerPatterns = [
    "google-analytics",
    "facebook",
    "adroll",
    "doubleclick",
  ];

  scripts.forEach(src => {
    if (trackerPatterns.some(pattern => src.includes(pattern))) {
      trackers.push(src);
    }
  });

  const result = {
    cookies: cookies.length,
    scripts: scripts.length,
    trackers: trackers.length,
    privacyScore: 100 - (trackers.length * 10),
  };

  chrome.storage.local.set({ result });
}

chrome.storage.local.get('result', (data) => {
  if (data.result) {
    document.getElementById('privacy-score').textContent = `Privacy Score: ${data.result.privacyScore}`;
    document.getElementById('trackers').textContent = `Trackers: ${data.result.trackers}`;
  }
});
