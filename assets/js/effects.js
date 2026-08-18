// ============================================================
// EFFECTS.JS — Floating Particles, Cursor Trail, Card Tilt, Burst
// (3D starfield is handled by three-hero.js)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {

    // ─── PIXEL CURSOR TRAIL ───
    let lastTrail = 0;
    document.addEventListener("mousemove", (e) => {
        const now = Date.now();
        if (now - lastTrail < 80) return;
        lastTrail = now;

        const trail = document.createElement("div");
        trail.style.cssText = `
            position: fixed;
            pointer-events: none;
            z-index: 999;
            width: 3px;
            height: 3px;
            border-radius: 50%;
            background: rgba(255, 0, 127, 0.5);
            box-shadow: 0 0 6px rgba(255, 0, 127, 0.3);
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            transition: opacity 0.5s, transform 0.5s;
        `;
        document.body.appendChild(trail);
        requestAnimationFrame(() => {
            trail.style.opacity = "0";
            trail.style.transform = "scale(0.3)";
        });
        setTimeout(() => trail.remove(), 550);
    });

    // ─── BURST PARTICLES ON CLICK ───
    document.addEventListener("click", (e) => {
        for (let i = 0; i < 10; i++) {
            const p = document.createElement("div");
            p.className = "burst-particle";

            const angle = (Math.random() * 360) * Math.PI / 180;
            const dist = Math.random() * 60 + 20;
            const isMagenta = Math.random() > 0.5;
            p.style.cssText = `
                left: ${e.clientX}px;
                top: ${e.clientY}px;
                --px: ${Math.cos(angle) * dist}px;
                --py: ${Math.sin(angle) * dist}px;
                background: ${isMagenta ? "#ff007f" : "#00d4ff"};
                box-shadow: 0 0 8px ${isMagenta ? "rgba(255,0,127,0.6)" : "rgba(0,212,255,0.6)"};
            `;
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 1400);
        }
    });

    // ─── 3D CARD TILT EFFECT ───
    const tiltCards = document.querySelectorAll(".tilt-card");
    tiltCards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;

            const glare = card.querySelector(".tilt-glare");
            if (glare) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                glare.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.08) 0%, transparent 60%)`;
                glare.style.opacity = "1";
            }
        });

        card.addEventListener("mouseleave", () => {
            card.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0px)";
            const glare = card.querySelector(".tilt-glare");
            if (glare) {
                glare.style.opacity = "0";
            }
        });
    });
});
