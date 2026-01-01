const BLOCK_SITES = ["facebook.com", "tiktok.com", "youtube.com", "instagram.com", "messenger.com"];
const RULESET_ID = "block_rules";

function reloadBlockedTabs() {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach(tab => {
      if (!tab.url) return;

      for (const site of BLOCK_SITES) {
        if (tab.url.includes(site)) {
          chrome.tabs.reload(tab.id);
        }
      }
    });
  });
}

function checkTimeAndUpdateRules() {
  const hour = new Date().getHours();
  const isBlockedTime = (hour >= 7 && hour < 13) || (hour >= 14 && hour < 17) || (hour >= 18 && hour < 23) || (hour >= 0 && hour < 6);

  chrome.declarativeNetRequest.updateEnabledRulesets({
    enableRulesetIds: isBlockedTime ? [RULESET_ID] : [],
    disableRulesetIds: isBlockedTime ? [] : [RULESET_ID]
  });

  if (isBlockedTime) {
    reloadBlockedTabs();
  }
}


checkTimeAndUpdateRules();

chrome.alarms.create("timeCheck", {
  periodInMinutes: 1
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "timeCheck") {
    checkTimeAndUpdateRules();
  }
});