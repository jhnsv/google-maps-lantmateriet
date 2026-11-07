browser.runtime.onMessage.addListener(message => {
  if (!message || message.type !== "OPEN_MIN_KARTA" || !message.query) return;
  const pending = {
    query: message.query,
    source: message.source || "",
    created: Date.now(),
    token: String(Date.now()) + Math.random().toString(36).slice(2)
  };
  return browser.storage.local.set({gmlmPending: pending}).then(() =>
    browser.tabs.create({url:"https://minkarta.lantmateriet.se/map/",active:true})
  );
});
