const apkName = "TurkNetLive.apk";
const apkParts = [9437184, 9437184, 9437184, 6874652];

async function getPart(size, index) {
  const response = await fetch(`/downloads/TurkNetLive-419c1d4a.part${index}`);
  if (!response.ok) {
    throw new Error("APK part could not be downloaded");
  }
  const data = await response.blob();
  if (data.size !== size) {
    throw new Error("APK part has an unexpected size");
  }
  return data;
}

for (const button of document.querySelectorAll("[data-apk-download]")) {
  const status = document.getElementById(button.getAttribute("aria-describedby"));
  button.addEventListener("click", async () => {
    button.disabled = true;
    status.textContent = "جارٍ تنزيل التطبيق…";

    try {
      const parts = await Promise.all(apkParts.map(getPart));
      const apk = new Blob(parts, { type: "application/vnd.android.package-archive" });
      const url = URL.createObjectURL(apk);
      const link = document.createElement("a");
      link.href = url;
      link.download = apkName;
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
      status.textContent = "تم تجهيز الملف. افتح قائمة التنزيلات للعثور عليه.";
    } catch {
      status.textContent = "تعذّر تنزيل التطبيق. جرّب مرة أخرى.";
    } finally {
      button.disabled = false;
    }
  });
  button.disabled = false;
}
