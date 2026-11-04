/* SHARED SCRIPT (used by every page) */

/* 1. Click a photo -> it opens bigger. Click anywhere or press Esc to close. */
document.querySelectorAll(".photo-btn").forEach(function (btn) {
  btn.addEventListener("click", function () {
    var box = document.createElement("div");
    box.className = "lightbox";
    box.innerHTML = '<img src="' + btn.querySelector("img").src + '" alt="Ericka Eunice L. Lazo">';
    function close() { box.remove(); document.removeEventListener("keydown", onKey); }
    function onKey(e) { if (e.key === "Escape") close(); }
    box.addEventListener("click", close);
    document.addEventListener("keydown", onKey);
    document.body.appendChild(box);
  });
});

/* 2. Menu underline follows the section you are reading */
var links = document.querySelectorAll("nav a");
var watcher = new IntersectionObserver(function (entries) {
  entries.forEach(function (en) {
    if (en.isIntersecting) {
      links.forEach(function (a) {
        var on = a.getAttribute("href") === "#" + en.target.id;
        a.classList.toggle("active", on);
        if (on) { a.setAttribute("aria-current", "true"); } else { a.removeAttribute("aria-current"); }
      });
    }
  });
}, { rootMargin: "-35% 0px -60% 0px" });
document.querySelectorAll("section[id]").forEach(function (sec) { watcher.observe(sec); });

/* 3. Message form (only on the Let's Chat page) */
var form = document.getElementById("contact-form");
if (form) {
  var statusEl = document.getElementById("form-status");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var btn = form.querySelector("button");
    btn.disabled = true;
    statusEl.textContent = "Sending...";
    fetch(form.action, { method: "POST", headers: { "Accept": "application/json" }, body: new FormData(form) })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (data.success) {
          statusEl.textContent = "Thank you! Your message was sent.";
          form.reset();
        } else {
          statusEl.textContent = "Message not sent (" + (data.message || "unknown reason") + "). You can also email me at eunicelorialazo@gmail.com.";
        }
      })
      .catch(function () {
        statusEl.textContent = "Message not sent (connection blocked or offline). Try another browser, or email me at eunicelorialazo@gmail.com.";
      })
      .finally(function () { btn.disabled = false; });
  });
}
