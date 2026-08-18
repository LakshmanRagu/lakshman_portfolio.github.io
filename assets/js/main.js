// ============================================================
// MAIN.JS — Navigation, Scroll Reveal, Accordion, Smooth Scroll
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ─── PORTFOLIO LINKS ───
    const PORTFOLIO_LINKS = {
        "link-welcome-back": "https://reirann.itch.io/welcome-back",
        "link-the-long-take": "https://lakshmanragu.itch.io/the-long-take",
        "link-scraping-angel": "https://reirann.itch.io/scraping-angel",
        "link-grow-a-city": "https://reirann.itch.io/grow-a-city",
        "link-passing-great-white": "https://iddcv.itch.io/passing-of-the-great-white",
        "link-escape-parking-lot": "https://itch.io/jam/mini-jam-208-inverted/rate/4471924",
        "link-blast-rock": "https://itch.io/jam/portfolio-builders-jam-week-67/rate/4455852",
        "link-sky-slime": "https://lakshmanragu.itch.io/sky-slimed",
        "link-uni-projects": "https://youtu.be/Uj-wqgUHFWk",
        "link-itch-io": "https://lakshmanragu.itch.io/",
        "link-email": "mailto:lakshmannarainragubathy@gmail.com",
        "link-artstation": "https://www.artstation.com/lakshmanragu",
    };

    for (const [id, url] of Object.entries(PORTFOLIO_LINKS)) {
        const element = document.getElementById(id);
        if (element && url !== "#") {
            element.href = url;
        }
    }

    // ─── STICKY NAVBAR SCROLL EFFECT ───
    const navBar = document.querySelector(".nav-bar");
    if (navBar) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                navBar.classList.add("scrolled");
            } else {
                navBar.classList.remove("scrolled");
            }
        }, { passive: true });
    }

    // ─── SMOOTH SCROLL FOR NAV LINKS ───
    const navLinks = document.querySelectorAll(".nav-bar a[href^='#']");
    navLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetId = link.getAttribute("href").substring(1);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
                const navHeight = navBar ? navBar.offsetHeight : 0;
                const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - navHeight - 20;
                window.scrollTo({ top: targetPosition, behavior: "smooth" });
            }
        });
    });

    // ─── ACTIVE NAV LINK ON SCROLL ───
    const sections = document.querySelectorAll("section[id]");
    const observerOptions = {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0,
    };

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(link => link.classList.remove("active"));
                const activeLink = document.querySelector(`.nav-bar a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add("active");
            }
        });
    }, observerOptions);

    sections.forEach(section => navObserver.observe(section));

    // ─── SCROLL REVEAL ANIMATIONS ───
    const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale");
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target); // Only animate once
            }
        });
    }, {
        root: null,
        rootMargin: "0px 0px -80px 0px",
        threshold: 0.1,
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── ACCORDION / COLLAPSIBLE LOGIC ───
    const collapsibles = document.querySelectorAll(".collapsible-btn");
    collapsibles.forEach(btn => {
        btn.addEventListener("click", function () {
            const content = this.nextElementSibling;
            const icon = this.querySelector(".toggle-icon");

            if (content.classList.contains("active")) {
                content.classList.remove("active");
                if (icon) {
                    icon.textContent = "▾";
                    icon.classList.remove("rotated");
                }
            } else {
                content.classList.add("active");
                if (icon) {
                    icon.textContent = "▴";
                    icon.classList.add("rotated");
                }
            }
        });
    });

    // ─── END PORTAL VOID STARS ───
    const portalVoid = document.getElementById("end-portal-void");
    if (portalVoid) {
        for (let i = 0; i < 75; i++) {
            const ps = document.createElement("div");
            ps.className = "portal-star";
            ps.style.left = Math.random() * 100 + "%";
            ps.style.top = Math.random() * 100 + "%";
            const colors = ["#ff007f", "#00d4ff", "#ffffff", "#7b2fbe", "#9955ff"];
            ps.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 3 + 1;
            ps.style.width = size + "px";
            ps.style.height = size + "px";
            ps.style.animationDuration = (Math.random() * 4 + 3) + "s";
            ps.style.animationDelay = (Math.random() * 4) + "s";
            const driftX = (Math.random() * 40 - 20) + "px";
            const driftY = (Math.random() * 40 - 20) + "px";
            ps.style.setProperty("--dx", driftX);
            ps.style.setProperty("--dy", driftY);
            portalVoid.appendChild(ps);
        }
    }
});
