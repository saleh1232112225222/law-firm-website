/**
 * Saleh Law Firm — main.js
 * Core interactive scripts, responsive menu handlers, and automated lead/booking AJAX integration.
 */

// ==========================================
// 🤖 AUTOMATION & CONFIGURATION SETTINGS
// ==========================================
// Paste your active n8n Webhook URL here to automatically trigger calendar, SMS, and Telegram notifications!
const N8N_WEBHOOK_URL = ""; 

document.addEventListener("DOMContentLoaded", function() {

  // 0. BLOG CATEGORY FILTER
  const filterBtns = document.querySelectorAll(".filter-btn");
  const blogCards = document.querySelectorAll(".blog-card");
  if (filterBtns.length && blogCards.length) {
    filterBtns.forEach(function(btn) {
      btn.addEventListener("click", function() {
        filterBtns.forEach(function(b) { b.classList.remove("active"); });
        this.classList.add("active");
        var filter = this.getAttribute("data-filter");
        blogCards.forEach(function(card) {
          var tag = card.querySelector(".blog-tag");
          if (filter === "all" || (tag && tag.textContent.trim().indexOf(filter) !== -1)) {
            card.style.display = "";
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }
  
  // 1. MOBILE RESPONSIVE NAVIGATION MENU
  const menuToggle = document.querySelector(".menu-toggle");
  const navContainer = document.querySelector(".nav");
  
  if (menuToggle && navContainer) {
    menuToggle.addEventListener("click", function() {
      navContainer.classList.toggle("open");
    });
    
    // Close menu when clicking any nav link
    document.querySelectorAll(".nav a").forEach(function(link) {
      link.addEventListener("click", function() {
        navContainer.classList.remove("open");
      });
    });
  }

  // 2. SMOOTH SCROLLING FOR INTERNAL ANCHORS
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href");
      if (targetId !== "#") {
        e.preventDefault();
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }
    });
  });

  // 3. SECURE & SEAMLESS FORM SUBMISSIONS (AJAX FETCH)
  document.querySelectorAll("form").forEach(function(form) {
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      
      const formData = new FormData(form);
      const payload = {};
      
      formData.forEach(function(value, key) {
        payload[key] = value;
      });
      
      // Inject metadata
      payload.timestamp = new Date().toISOString();
      payload.page = window.location.pathname;
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const isEnglish = document.documentElement.lang === "en";
      
      // Provide visual loading feedback
      if (submitBtn) {
        submitBtn.innerHTML = isEnglish ? "Sending..." : "جاري الإرسال...";
        submitBtn.disabled = true;
      }
      
      const isLeadMagnet = form.classList.contains("lead-form");
      const web3FormsKey = "7defb7ec-4170-43b5-9eb5-2d3e5158e40e";
      
      // Dispatch A: Web3Forms Email Submission
      if (web3FormsKey) {
        fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: web3FormsKey,
            subject: isLeadMagnet ? "📘 طلب دليل 7 أخطاء قانونية" : "📞 حجز استشارة قانونية جديدة",
            from_name: "Saleh Law Firm",
            ...payload
          })
        }).catch(function(err) {
          console.error("Web3Forms submission failed:", err);
        });
      }
      
      // Dispatch B: n8n Direct Webhook (CRM, Calendar, SMS, Telegram)
      if (N8N_WEBHOOK_URL) {
        fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            lead_type: isLeadMagnet ? "lead-magnet" : "booking",
            source_page: payload.page,
            ...payload
          })
        }).catch(function(err) {
          console.error("n8n Webhook submission failed:", err);
        });
      }
      
      // Dispatch C: Local Backup Storage
      try {
        let backups = JSON.parse(localStorage.getItem("salehlaw_leads") || "[]");
        backups.push({
          name: payload.name || "unknown",
          phone: payload.phone || "",
          company: payload.company || "",
          type: isLeadMagnet ? "lead-magnet" : "booking",
          timestamp: payload.timestamp,
          page: payload.page
        });
        if (backups.length > 50) {
          backups = backups.slice(-50);
        }
        localStorage.setItem("salehlaw_leads", JSON.stringify(backups));
      } catch (err) {
        console.error("Local backup failed:", err);
      }
      
      // Determine redirection path based on form type and language
      let redirectPath = isLeadMagnet ? "pdf/7-mistakes.html" : "thank-you.html";
      
      // Adjust path prefix if page is inside a subfolder (like /en/ or /legal-templates/)
      const pathSegments = window.location.pathname.split("/");
      const isInSubfolder = pathSegments.length > 2 && pathSegments[pathSegments.length - 2] !== "";
      
      if (isInSubfolder) {
        // If the page is in a subfolder, check if it's English
        const currentFolder = pathSegments[pathSegments.length - 2];
        if (currentFolder === "en") {
          redirectPath = isLeadMagnet ? "../pdf/7-mistakes.html" : "thank-you.html";
        } else if (currentFolder === "legal-templates" || currentFolder === "tools" || currentFolder === "case-studies" || currentFolder === "legal-library") {
          // If in legal-templates or tools or other Arabic subfolders, go back one level
          redirectPath = isLeadMagnet ? "../pdf/7-mistakes.html" : "../thank-you.html";
        }
      }
      
      // Execute smooth transition redirect
      setTimeout(function() {
        window.location.href = redirectPath;
      }, 800);
    });
  });

  // 4. AUTOMATIC ACTIVE NAVIGATION STATE
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav a").forEach(function(navLink) {
    if (navLink.getAttribute("href") === currentPage) {
      navLink.classList.add("active");
    }
  });
});

// 5. GLOBAL PORTAL NOTICE & MAINTENANCE MODAL HANDLER
window.openBetaModal = function(e) {
  if (e && e.preventDefault) e.preventDefault();
  let modal = document.getElementById("betaModal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "betaModal";
    modal.style.cssText = "display: flex; position: fixed; inset: 0; z-index: 99999; background: rgba(12, 27, 42, 0.85); backdrop-filter: blur(8px); align-items: center; justify-content: center; padding: 20px;";
    modal.innerHTML = `
      <div style="background: #0f2236; border: 1px solid #c8a951; border-radius: 16px; max-width: 520px; width: 100%; padding: 32px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); text-align: center; position: relative; animation: modalPop 0.3s ease-out;">
        <div style="width: 64px; height: 64px; background: rgba(200, 169, 81, 0.15); border: 1px solid #c8a951; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 28px;">
          ⚖️
        </div>
        <div style="display: inline-block; background: rgba(200, 169, 81, 0.2); color: #c8a951; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 700; margin-bottom: 12px;">
          إشعار إداري
        </div>
        <h3 style="color: #fff; font-size: 22px; font-weight: 800; margin-bottom: 14px;">
          بوابة نظام B2B-LAW
        </h3>
        <p style="color: rgba(255, 255, 255, 0.9); font-size: 15px; line-height: 1.8; margin-bottom: 24px;">
          النظام حالياً تحت المراجعة والتجهيز للإطلاق. لطلب عرض خاص يرجى التواصل مع الإدارة.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <a href="https://wa.me/966567905696?text=مرحباً،%20أود%20طلب%20عرض%20خاص%20لنظام%20B2B-LAW" target="_blank" class="btn btn-whatsapp" style="padding: 12px 24px; font-size: 15px; text-decoration: none; border-radius: 8px;">
            تواصل مع الإدارة عبر واتساب
          </a>
          <button onclick="closeBetaModal()" style="background: rgba(255,255,255,0.08); color: #fff; border: 1px solid rgba(255,255,255,0.2); padding: 12px 20px; border-radius: 8px; font-weight: 600; font-size: 14px; cursor: pointer;">
            إغلاق
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  } else {
    modal.style.display = "flex";
  }
};

window.closeBetaModal = function() {
  const modal = document.getElementById("betaModal");
  if (modal) modal.style.display = "none";
};

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") window.closeBetaModal();
});

