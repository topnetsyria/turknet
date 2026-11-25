if (/Android/i.test(navigator.userAgent) && /\bwv\b/i.test(navigator.userAgent)) {
  for (const link of document.querySelectorAll("a[data-open-apk-in-browser]")) {
    // TurkNet Live sends user-initiated links on other hosts to the browser.
    const download = new URL("/turknet" + link.pathname, "https://topnetsyria.github.io");
    link.href = download.href;
    link.removeAttribute("download");
  }
}
