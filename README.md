# Lakshman Narain Ragubathy — Portfolio

Personal portfolio website for **Lakshman Narain Ragubathy**, an AI & Gameplay Programmer specializing in Unity, Unreal Engine 5, Python/Pygame, and MaxScript tooling.

## 🎮 Live Site

**[lakshmanragu.github.io/lakshman_portfolio.github.io](https://lakshmanragu.github.io/lakshman_portfolio.github.io/)**

## ✨ Features

- **3D Hero Scene** — Interactive wireframe geometry with particle field powered by [Three.js](https://threejs.org/), with mouse-tracking and smooth animation
- **Immersive Scroll Animations** — Sections fade and slide into view using the Intersection Observer API (zero-dependency, high performance)
- **3D Card Tilt Effects** — Project cards respond to mouse movement with perspective transforms and dynamic glare
- **Parallax Star Background** — Multi-depth twinkling stars that shift on scroll for spatial depth
- **3D End Portal** — Minecraft-inspired End Portal with CSS 3D perspective tilt, floating animation, and void particle effects
- **Glass-Morphism UI** — Frosted glass cards with neon magenta & cyan accents
- **Sticky Navigation** — Blurred backdrop navbar with active section highlighting
- **Responsive Design** — Fully responsive across mobile, tablet, and desktop
- **Pixel Art Accents** — CSS Enderman character, Pac-Man animation, and retro gaming elements

## 🗂️ Project Structure

```
lakshman_portfolio.github.io/
├── index.html              # Semantic HTML structure
├── README.md               # This file
├── assets/
│   ├── css/
│   │   └── styles.css      # Complete stylesheet — glass-morphism, 3D portal, animations
│   └── js/
│       ├── main.js          # Navigation, scroll reveal, accordion, smooth scroll
│       ├── three-hero.js    # Three.js 3D hero scene (wireframe + particles)
│       └── effects.js       # Parallax stars, cursor trail, card tilt, click burst
```

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **HTML5** | Semantic structure with Open Graph meta tags |
| **CSS3** | Glass-morphism, CSS 3D transforms, custom properties, keyframe animations |
| **JavaScript (ES6+)** | Intersection Observer, DOM manipulation, event handling |
| **Three.js** | Lightweight WebGL 3D hero scene (CDN, ~150KB gzipped) |
| **Google Fonts** | Inter, Space Grotesk, Press Start 2P |
| **Font Awesome** | Section icons |

## 🚀 Performance

The site is designed to be lightweight despite its visual richness:

- **No build tools required** — pure HTML/CSS/JS, opens directly in any browser
- **Three.js hero** uses a single wireframe geometry + point cloud (no textures, no shadows, no post-processing)
- **Scroll animations** use the native `IntersectionObserver` API — no scroll event listeners that cause layout thrashing
- **Card tilt** is pure CSS `transform: perspective()` driven by `requestAnimationFrame`-throttled mousemove
- **Parallax** uses hardware-accelerated CSS transforms

## 📬 Contact

- **Email**: lakshmannarainragubathy@gmail.com
- **Itch.io**: [lakshmanragu.itch.io](https://lakshmanragu.itch.io/)
- **ArtStation**: [artstation.com/lakshmanragu](https://www.artstation.com/lakshmanragu)
- **Games Browser**: [lakshmanragu.github.io/LakshmanGamesBrowser](https://lakshmanragu.github.io/LakshmanGamesBrowser/)

## 📄 License

© 2026 Lakshman Narain Ragubathy. All rights reserved.
