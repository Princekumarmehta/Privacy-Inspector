chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({ text: "Off" });
});

chrome.action.onClicked.addListener(async (tab) => {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    function: analyzePrivacy,
  });
});

function analyzePrivacy() {
  const trackers = [];
  const cookies = document.cookie.split(';');
  const scripts = Array.from(document.scripts).map(script => script.src);

  // Detect common trackers by checking script URLs
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

  // Display privacy analysis
  const result = {
    cookies: cookies.length,
    scripts: scripts.length,
    trackers: trackers.length,
    privacyScore: 100 - (trackers.length * 10),
  };

  alert(`Privacy Analysis:\nCookies: ${result.cookies}\nScripts: ${result.scripts}\nTrackers: ${result.trackers}\nPrivacy Score: ${result.privacyScore}`);
}
