/* =============================================
   WEDDING INVITATION – Alifa & Akbar
   main.js  –  REVISI v2
   ============================================= */

const music = document.getElementById("bg-music");
const musicBtn = document.getElementById("music-btn");
let musicPlaying = false;

/* ---------- Auto-play music on load ---------- */
window.addEventListener("load", () => {
  // ===== NAMA TAMU DARI URL PARAMETER =====
  const params = new URLSearchParams(window.location.search);
  const guestName = params.get("to");
  const recipientEl = document.querySelector(".recipient-name");
  if (recipientEl) {
    recipientEl.textContent = guestName
      ? decodeURIComponent(guestName)
      : "Tamu Undangan";
  }
  // =========================================

  music.volume = 0.6;

  const tryPlay = () => {
    music
      .play()
      .then(() => {
        musicPlaying = true;
        musicBtn.classList.add("playing");
      })
      .catch(() => {
        /* diblokir browser, tunggu interaksi */
      });
  };

  tryPlay();

  // Fallback: mainkan saat sentuhan/klik pertama
  document.addEventListener(
    "click",
    function startOnInteract() {
      if (!musicPlaying) tryPlay();
      document.removeEventListener("click", startOnInteract);
    },
    { once: true },
  );
});

/* ---------- Toggle Music ---------- */
function toggleMusic() {
  if (musicPlaying) {
    music.pause();
    musicPlaying = false;
    musicBtn.classList.remove("playing");
  } else {
    music.play();
    musicPlaying = true;
    musicBtn.classList.add("playing");
  }
}

/* ---------- Open Invitation ---------- */
function openInvitation() {
  const cover = document.getElementById("cover");
  const invitation = document.getElementById("invitation");

  cover.style.transition = "opacity 0.8s ease, transform 0.8s ease";
  cover.style.opacity = "0";
  cover.style.transform = "scale(1.05)";

  setTimeout(() => {
    cover.classList.add("hidden");
    invitation.classList.remove("hidden");
    invitation.classList.add("visible");

    invitation.style.opacity = "0";
    invitation.style.transition = "opacity 0.7s ease";
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        invitation.style.opacity = "1";
      });
    });

    if (!musicPlaying) {
      music
        .play()
        .then(() => {
          musicPlaying = true;
          musicBtn.classList.add("playing");
        })
        .catch(() => {});
    }

    initScrollReveal();
    initStoriesReveal(); // ← tambahan untuk Stories timeline
    initGalleryReveal(); // ← tambahan untuk Gallery
    initGiftReveal(); // ← tambahan untuk Wedding Gift
    initWishReveal(); // ← tambahan untuk Wedding Wish
    window.scrollTo({ top: 0, behavior: "instant" });
  }, 800);
}

/* ---------- Scroll to Section ---------- */
function scrollToSection(sectionId, btn) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  document
    .querySelectorAll(".nav-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* ---------- Scroll Reveal DUA ARAH ----------
   Elemen muncul saat masuk viewport, menghilang saat keluar
   – ke bawah  → masuk dari bawah  (enter-bottom → in-view)
   – ke atas   → keluar ke atas    (in-view → exit-top)
   – kembali   → masuk dari bawah lagi
*/
function initScrollReveal() {
  /* === Kelompok 1: elemen biasa dengan reveal 2 arah === */
  const targets = document.querySelectorAll(
    ".opening-top-content, .opening-bottom-content, " +
      ".section-title, .section-desc, .section-label, " +
      ".event-cd-content, .event-capsule, .stories-header, .gallery-header",
  );
  targets.forEach((el) => el.classList.add("reveal-2way", "enter-bottom"));

  const observer2way = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          // Masuk → tampilkan
          el.classList.remove("enter-bottom", "exit-top");
          el.classList.add("in-view");
        } else {
          // Keluar → tentukan arah
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) {
            // Sudah terlewat ke atas
            el.classList.remove("in-view", "enter-bottom");
            el.classList.add("exit-top");
          } else {
            // Belum sampai (masih di bawah viewport)
            el.classList.remove("in-view", "exit-top");
            el.classList.add("enter-bottom");
          }
        }
      });
    },
    { threshold: 0.18 },
  );

  targets.forEach((el) => observer2way.observe(el));

  /* === Kelompok 2: op2-block (staggered, dua arah) === */
  const op2Blocks = document.querySelectorAll(".op2-block");

  const op2Observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          const delay = parseFloat(el.dataset.delay || 0) * 260;
          setTimeout(() => {
            el.classList.remove("exit-top");
            el.style.transform = "";
            el.style.opacity = "";
            el.classList.add("in-view");
          }, delay);
        } else {
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) {
            el.classList.remove("in-view");
            el.classList.add("exit-top");
          } else {
            el.classList.remove("in-view", "exit-top");
            // reset ke state awal (masuk dari bawah)
            el.style.opacity = "0";
            el.style.transform = "translateY(40px)";
          }
        }
      });
    },
    {
      threshold: 0.3,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  op2Blocks.forEach((el) => op2Observer.observe(el));

  /* === Kelompok 3: couple card & text (dua arah, lambat) === */
  const coupleEls = document.querySelectorAll(
    ".couple-card, .couple-text-block",
  );
  coupleEls.forEach((el) => {
    if (!el.classList.contains("reveal-2way")) {
      el.classList.add("reveal-2way", "enter-bottom");
    }
  });

  const coupleObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.remove("enter-bottom", "exit-top");
          el.classList.add("in-view");
        } else {
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) {
            el.classList.remove("in-view", "enter-bottom");
            el.classList.add("exit-top");
          } else {
            el.classList.remove("in-view", "exit-top");
            el.classList.add("enter-bottom");
          }
        }
      });
    },
    { threshold: 0.18 },
  );

  coupleEls.forEach((el) => coupleObserver.observe(el));

  /* === Kelompok 4: event-acara (dua arah, lambat elegan) === */
  const acaraEls = document.querySelectorAll(".event-acara");

  const acaraObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.remove("enter-bottom", "exit-top");
          el.classList.add("in-view");
        } else {
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) {
            el.classList.remove("in-view", "enter-bottom");
            el.classList.add("exit-top");
          } else {
            el.classList.remove("in-view", "exit-top");
          }
        }
      });
    },
    { threshold: 0.15 },
  );

  acaraEls.forEach((el) => acaraObserver.observe(el));
}

/* updateCoupleParallax dihapus – konsep baru pakai sticky bg + scroll reveal biasa */

/* ---------- Active nav on scroll ---------- */
function updateActiveNav() {
  const sections = [
    "section-opening",
    "section-opening2",
    "section-couple",
    "section-event",
    "section-moment",
    "section-blessing",
  ];

  const scrollY = window.scrollY + window.innerHeight * 0.4;
  let current = sections[0];

  sections.forEach((id) => {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollY) current = id;
  });

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.target === current);
  });
}

window.addEventListener(
  "scroll",
  () => {
    updateActiveNav();
  },
  { passive: true },
);

/* ---------- Countdown Timer ---------- */
(function () {
  // Target: Resepsi 4 Juli 2026, 09.00 WIB = 02:00 UTC
  const target = new Date("2026-07-04T02:00:00Z");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function updateCountdown() {
    const diff = target - new Date();
    if (diff <= 0) {
      ["cd-hari", "cd-jam", "cd-menit", "cd-detik"].forEach((id) => {
        const el = document.getElementById(id);
        if (el) el.textContent = "00";
      });
      return;
    }
    const hari = Math.floor(diff / 86400000);
    const jam = Math.floor((diff % 86400000) / 3600000);
    const menit = Math.floor((diff % 3600000) / 60000);
    const detik = Math.floor((diff % 60000) / 1000);
    const ids = ["cd-hari", "cd-jam", "cd-menit", "cd-detik"];
    const vals = [hari, jam, menit, detik];
    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.textContent = pad(vals[i]);
    });
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
})();

/* ---------- Simpan ke Kalender (.ics) ---------- */
function simpanKalender() {
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Alifa & Akbar//ID",
    "BEGIN:VEVENT",
    "DTSTART:20260704T010000Z",
    "DTEND:20260704T020000Z",
    "SUMMARY:Akad Nikah - Alifa & Akbar",
    "DESCRIPTION:Jumat 4 Juli 2026 pukul 09.00 WIB",
    "LOCATION:nama tempat, Jl. apa? 32",
    "END:VEVENT",
    "BEGIN:VEVENT",
    "DTSTART:20260704T020000Z",
    "DTEND:20260704T070000Z",
    "SUMMARY:Resepsi Pernikahan - Alifa & Akbar",
    "DESCRIPTION:Jumat 4 Juli 2026 pukul 13.00 WIB",
    "LOCATION:nama tempat, Jl. apa? 32",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  const blob = new Blob([lines.join("\r\n")], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "undangan-alifa-akbar.ics";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =============================================
   STORIES TIMELINE REVEAL – dua arah, staggered
   ============================================= */
function initStoriesReveal() {
  const items = document.querySelectorAll(".tl-item");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const idx = parseInt(el.dataset.tl || 0);
        const delay = idx * 180; // stagger 180ms per item agar satu-satu

        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.remove("tl-exit");
            el.classList.add("tl-in");
          }, delay);
        } else {
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) {
            // sudah terlewat ke atas → keluar ke atas
            el.classList.remove("tl-in");
            el.classList.add("tl-exit");
          } else {
            // belum masuk → reset ke state awal
            el.classList.remove("tl-in", "tl-exit");
          }
        }
      });
    },
    { threshold: 0.22, rootMargin: "0px 0px -40px 0px" },
  );

  items.forEach((el) => observer.observe(el));
}

/* =============================================
   GALLERY REVEAL – dua arah, staggered per foto
   ============================================= */
function initGalleryReveal() {
  const items = document.querySelectorAll(".gallery-item");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const idx = parseInt(el.dataset.gi || 0);
        const delay = idx * 140; // stagger 140ms antar foto

        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.remove("gi-exit");
            el.classList.add("gi-in");
          }, delay);
        } else {
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) {
            // sudah terlewat ke atas → keluar ke atas
            el.classList.remove("gi-in");
            el.classList.add("gi-exit");
          } else {
            // belum masuk → reset ke state awal
            el.classList.remove("gi-in", "gi-exit");
          }
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -40px 0px" },
  );

  items.forEach((el) => observer.observe(el));
}

/* =============================================
   WEDDING GIFT – SALIN REKENING
   ============================================= */
function salinRekening(btn) {
  const norek = "1234567890";
  navigator.clipboard
    .writeText(norek)
    .then(() => {
      btn.classList.add("copied");
      const origSvg = btn.innerHTML;
      btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
      setTimeout(() => {
        btn.classList.remove("copied");
        btn.innerHTML = origSvg;
      }, 2000);
    })
    .catch(() => {
      /* fallback manual */
      const ta = document.createElement("textarea");
      ta.value = norek;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    });
}

/* Salin teks dari elemen berdasarkan ID */
function salinAlamat(id, btn) {
  const el = document.getElementById(id);
  if (!el) return;

  // innerText biar <br> jadi newline, bukan literal "<br>"
  const teks = el.innerText || el.textContent;

  navigator.clipboard
    .writeText(teks)
    .then(() => {
      btn.classList.add("copied");
      setTimeout(() => btn.classList.remove("copied"), 2000);
    })
    .catch(() => {
      // fallback untuk browser lama
      const ta = document.createElement("textarea");
      ta.value = teks;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      btn.classList.add("copied");
      setTimeout(() => btn.classList.remove("copied"), 2000);
    });
}

/* =============================================
   WEDDING GIFT REVEAL – staggered dua arah
   ============================================= */
function initGiftReveal() {
  const items = document.querySelectorAll(".wg-reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const idx = parseInt(el.dataset.wg || 0);
        const delay = idx * 180; // stagger 180ms per elemen

        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.remove("wg-exit");
            el.classList.add("wg-in");
          }, delay);
        } else {
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) {
            // Sudah terlewat ke atas
            el.classList.remove("wg-in");
            el.classList.add("wg-exit");
          } else {
            // Belum masuk (masih di bawah)
            el.classList.remove("wg-in", "wg-exit");
          }
        }
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -30px 0px" },
  );

  items.forEach((el) => observer.observe(el));
}

/* =============================================
   WEDDING WISH – STATE & DATA (dari API)
   ============================================= */

const WISH_API = "api/wishes.php";
let wishPage = 1;
let wishTotalPages = 1;

/* =============================================
   TOAST NOTIFICATION
   ============================================= */
let toastTimer = null;

function showToast(type, title, msg) {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.innerHTML = `
      <span class="toast-icon"></span>
      <div class="toast-body">
        <span class="toast-title"></span>
        <span class="toast-msg"></span>
      </div>
      <button class="toast-close" onclick="hideToast()">✕</button>
    `;
    document.body.appendChild(toast);
  }
  toast.querySelector(".toast-icon").textContent =
    type === "success" ? "🌸" : "😔";
  toast.querySelector(".toast-title").textContent = title;
  toast.querySelector(".toast-msg").textContent = msg;
  toast.className = `toast-${type}`;
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("toast-show"));
  });
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 4000);
}

function hideToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.classList.remove("toast-show");
  if (toastTimer) {
    clearTimeout(toastTimer);
    toastTimer = null;
  }
}

/* =============================================
   WEDDING WISH – FETCH DATA DARI API
   ============================================= */
async function fetchWishes(page = 1) {
  const list = document.getElementById("wish-list");
  if (list) {
    list.innerHTML = `<p style="color:rgba(255,255,255,0.5);font-family:'EB Garamond',serif;font-size:1rem;text-align:center;padding:20px 0;">Memuat ucapan... 🌸</p>`;
  }

  try {
    const res = await fetch(`${WISH_API}?page=${page}`);
    const data = await res.json();

    if (!data.success) throw new Error("Gagal fetch");

    wishPage = data.page;
    wishTotalPages = data.total_pages;

    renderWishList(data.data);
    renderPagination(data.total_pages, data.page);
    updateAttendCount(data.hadir, data.tidak);
  } catch (e) {
    if (list) {
      list.innerHTML = `<p style="color:rgba(255,100,100,0.8);font-family:'EB Garamond',serif;font-size:1rem;text-align:center;padding:20px 0;">Gagal memuat ucapan. Coba refresh halaman.</p>`;
    }
  }
}

/* =============================================
   WEDDING WISH – KIRIM UCAPAN
   ============================================= */
async function kirimUcapan() {
  const nameEl = document.getElementById("wish-name");
  const attendEl = document.getElementById("wish-attend");
  const msgEl = document.getElementById("wish-msg");
  const dropdownEl = document.getElementById("wish-dropdown");
  const submitBtn = document.querySelector(".wish-submit-btn");

  const name = nameEl.value.trim();
  const attend = attendEl.value;
  const msg = msgEl.value.trim();

  // Validasi — shake elemen yang kosong
  let valid = true;
  if (!name) {
    nameEl.classList.add("shake");
    setTimeout(() => nameEl.classList.remove("shake"), 500);
    valid = false;
  }
  if (!attend) {
    dropdownEl.classList.add("shake");
    setTimeout(() => dropdownEl.classList.remove("shake"), 500);
    valid = false;
  }
  if (!msg) {
    msgEl.classList.add("shake");
    setTimeout(() => msgEl.classList.remove("shake"), 500);
    valid = false;
  }
  if (!valid) return;

  // Disable tombol saat loading
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = "Mengirim...";
  }

  try {
    const res = await fetch(WISH_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nama: name, kehadiran: attend, pesan: msg }),
    });
    const data = await res.json();

    if (!data.success) throw new Error(data.message || "Gagal");

    showToast(
      "success",
      "Ucapan terkirim! 🎉",
      "Terima kasih, doa kamu sudah tersimpan.",
    );

    // Reset form
    nameEl.value = "";
    attendEl.value = "";
    msgEl.value = "";
    const lbl = document.getElementById("wish-dropdown-label");
    if (lbl) lbl.textContent = "Pilih Kehadiran Anda";
    if (dropdownEl) dropdownEl.classList.remove("selected", "open");
    document
      .querySelectorAll(".wish-dropdown-item")
      .forEach((i) => i.classList.remove("active"));

    // Kembali ke halaman 1 dan refresh
    wishPage = 1;
    await fetchWishes(1);
  } catch (e) {
    showToast(
      "error",
      "Ucapan gagal terkirim",
      "Periksa koneksi internet kamu, lalu coba lagi.",
    );
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = "Kirim Ucapan";
    }
  }
}

/* =============================================
   WEDDING WISH – RENDER PESAN
   ============================================= */
function renderWishList(wishes) {
  const list = document.getElementById("wish-list");
  if (!list) return;

  list.innerHTML = "";

  if (!wishes || wishes.length === 0) {
    list.innerHTML = `<p style="color:rgba(255,255,255,0.6);font-family:'EB Garamond',serif;font-size:1rem;text-align:center;padding:20px 0;">Belum ada ucapan. Jadilah yang pertama! 🌸</p>`;
    return;
  }

  wishes.forEach((item, i) => {
    const isHadir = item.kehadiran === "Hadir";
    const card = document.createElement("div");
    card.className = "wish-card";
    card.innerHTML = `
      <div class="wish-card-top">
        <span class="wish-card-name">${escHtml(item.nama)}</span>
        <span class="wish-card-time">${escHtml(item.tanggal)}</span>
      </div>
      <span class="wish-card-badge ${isHadir ? "hadir" : "tidak"}">${isHadir ? "✓ Hadir" : "✗ Tidak Hadir"}</span>
      <p class="wish-card-msg">${escHtmlBr(item.pesan)}</p>
    `;
    list.appendChild(card);
    setTimeout(() => card.classList.add("wc-in"), i * 80);
  });
}

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Seperti escHtml tapi newline dikonversi ke <br> agar Enter tampil di HTML
function escHtmlBr(str) {
  return escHtml(str).replace(/\n/g, "<br>");
}

/* =============================================
   WEDDING WISH – PAGINATION
   ============================================= */
function renderPagination(totalPages, currentPage) {
  const pg = document.getElementById("wish-pagination");
  if (!pg) return;

  pg.innerHTML = "";
  if (totalPages <= 1) return;

  const prev = document.createElement("button");
  prev.className = "wp-btn wp-arrow";
  prev.innerHTML = `‹ Sebelumnya`;
  prev.disabled = currentPage === 1;
  prev.onclick = () => {
    fetchWishes(currentPage - 1);
    scrollToWishList();
  };
  pg.appendChild(prev);

  for (let p = 1; p <= totalPages; p++) {
    const btn = document.createElement("button");
    btn.className = "wp-btn" + (p === currentPage ? " active" : "");
    btn.textContent = p;
    btn.onclick = ((page) => () => {
      fetchWishes(page);
      scrollToWishList();
    })(p);
    pg.appendChild(btn);
  }

  const next = document.createElement("button");
  next.className = "wp-btn wp-arrow";
  next.innerHTML = `Berikutnya ›`;
  next.disabled = currentPage === totalPages;
  next.onclick = () => {
    fetchWishes(currentPage + 1);
    scrollToWishList();
  };
  pg.appendChild(next);
}

function scrollToWishList() {
  const el = document.getElementById("wish-list");
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/* =============================================
   WEDDING WISH – HITUNG KEHADIRAN
   ============================================= */
function updateAttendCount(hadir, tidak) {
  const elH = document.getElementById("count-hadir");
  const elT = document.getElementById("count-tidak");
  if (elH) elH.textContent = hadir ?? 0;
  if (elT) elT.textContent = tidak ?? 0;
}

/* =============================================
   WEDDING WISH – REVEAL ANIMASI (staggered dua arah)
   ============================================= */
function initWishReveal() {
  const items = document.querySelectorAll(".ww-reveal");
  if (!items.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        const idx = parseInt(el.dataset.ww || 0);
        const delay = idx * 180;

        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.remove("ww-exit");
            el.classList.add("ww-in");
          }, delay);
        } else {
          const rect = el.getBoundingClientRect();
          if (rect.top < 0) {
            el.classList.remove("ww-in");
            el.classList.add("ww-exit");
          } else {
            el.classList.remove("ww-in", "ww-exit");
          }
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
  );

  items.forEach((el) => observer.observe(el));

  // Load data dari API
  fetchWishes(1);
}

/* =============================================
   CUSTOM DROPDOWN – WEDDING WISH
   ============================================= */
function toggleDropdown() {
  const dd = document.getElementById("wish-dropdown");
  if (!dd) return;
  dd.classList.toggle("open");
}

function selectAttend(e, value, label) {
  e.stopPropagation(); // jangan bubble ke toggleDropdown
  const dd = document.getElementById("wish-dropdown");
  const lbl = document.getElementById("wish-dropdown-label");
  const hidden = document.getElementById("wish-attend");
  const items = document.querySelectorAll(".wish-dropdown-item");

  // Update label & hidden value
  lbl.textContent = label;
  hidden.value = value;

  // Toggle class selected & active
  if (value) {
    dd.classList.add("selected");
  } else {
    dd.classList.remove("selected");
  }

  // Highlight item aktif
  items.forEach((item) => {
    item.classList.toggle("active", item.dataset.value === value);
  });

  // Tutup menu
  dd.classList.remove("open");
}

// Tutup dropdown saat klik di luar
document.addEventListener("click", function (e) {
  const dd = document.getElementById("wish-dropdown");
  if (dd && !dd.contains(e.target)) {
    dd.classList.remove("open");
  }
});
