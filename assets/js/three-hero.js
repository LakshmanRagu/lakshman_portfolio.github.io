// ============================================================
// THREE-HERO.JS — Full-page 3D Space Background
// Stars (no flicker) + nebula clouds + galaxy clusters
// ============================================================

(function () {
    "use strict";

    const canvas = document.getElementById("hero-canvas");
    if (!canvas) return;

    function waitForThree(callback) {
        if (typeof THREE !== "undefined") {
            callback();
        } else {
            setTimeout(() => waitForThree(callback), 100);
        }
    }

    waitForThree(() => {
        // ─── SCENE ───
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
        camera.position.z = 0;

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: false,
            powerPreference: "low-power",
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setClearColor(0x000000, 0);

        // ─── MAIN STAR FIELD (NO FLICKER) ───
        const STAR_COUNT = 5000;
        const SPREAD = 1400;

        const positions = new Float32Array(STAR_COUNT * 3);
        const colors = new Float32Array(STAR_COUNT * 3);
        const sizes = new Float32Array(STAR_COUNT);

        // realistic star color distribution
        const starColors = [
            [1.0, 1.0, 1.0],       // white
            [1.0, 0.95, 0.85],     // warm white
            [0.85, 0.92, 1.0],     // cool blue-white
            [1.0, 0.82, 0.62],     // orange (K-type)
            [0.65, 0.8, 1.0],      // blue (B-type)
            [1.0, 0.6, 0.6],       // red (M-type)
            [0.95, 0.95, 0.7],     // yellow (G-type, like sun)
            [0.7, 0.7, 1.0],       // blue-violet
        ];

        for (let i = 0; i < STAR_COUNT; i++) {
            const i3 = i * 3;
            const r = SPREAD * Math.cbrt(Math.random());
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3]     = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);

            const c = starColors[Math.floor(Math.random() * starColors.length)];
            // slight random variation per star
            colors[i3]     = c[0] * (0.85 + Math.random() * 0.15);
            colors[i3 + 1] = c[1] * (0.85 + Math.random() * 0.15);
            colors[i3 + 2] = c[2] * (0.85 + Math.random() * 0.15);

            sizes[i] = Math.random() * 2.0 + 0.5;
        }

        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        starGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        starGeo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        // steady stars — NO twinkle
        const starMat = new THREE.ShaderMaterial({
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_PointSize = clamp(gl_PointSize, 0.5, 5.0);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float d = length(gl_PointCoord - vec2(0.5));
                    if (d > 0.5) discard;
                    float alpha = smoothstep(0.5, 0.05, d);
                    float core = smoothstep(0.2, 0.0, d) * 0.4;
                    gl_FragColor = vec4(vColor + core, alpha * 0.95);
                }
            `,
            transparent: true,
            vertexColors: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // ─── DISTANT STAR LAYER ───
        const FAR_COUNT = 2500;
        const farPos = new Float32Array(FAR_COUNT * 3);
        const farCol = new Float32Array(FAR_COUNT * 3);
        const farSiz = new Float32Array(FAR_COUNT);

        for (let i = 0; i < FAR_COUNT; i++) {
            const i3 = i * 3;
            const r = 800 + Math.random() * 1200;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            farPos[i3]     = r * Math.sin(phi) * Math.cos(theta);
            farPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            farPos[i3 + 2] = r * Math.cos(phi);

            const brightness = 0.4 + Math.random() * 0.5;
            farCol[i3]     = brightness;
            farCol[i3 + 1] = brightness;
            farCol[i3 + 2] = brightness + Math.random() * 0.15;

            farSiz[i] = Math.random() * 1.0 + 0.3;
        }

        const farGeo = new THREE.BufferGeometry();
        farGeo.setAttribute("position", new THREE.BufferAttribute(farPos, 3));
        farGeo.setAttribute("color", new THREE.BufferAttribute(farCol, 3));
        farGeo.setAttribute("size", new THREE.BufferAttribute(farSiz, 1));
        const farStars = new THREE.Points(farGeo, starMat);
        scene.add(farStars);

        // ─── NEBULA CLOUDS ───
        // Soft, large glowing clusters of colored particles
        function createNebula(center, color1, color2, count, radius) {
            const nPos = new Float32Array(count * 3);
            const nCol = new Float32Array(count * 3);
            const nSiz = new Float32Array(count);

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                // gaussian-ish distribution for cloud shape
                const r = radius * Math.pow(Math.random(), 0.6);
                const theta = Math.random() * Math.PI * 2;
                const phi = Math.acos(2 * Math.random() - 1);
                // stretch along one axis for a more natural shape
                const stretch = 0.4 + Math.random() * 0.6;

                nPos[i3]     = center.x + r * Math.sin(phi) * Math.cos(theta) * 1.5;
                nPos[i3 + 1] = center.y + r * Math.sin(phi) * Math.sin(theta) * stretch;
                nPos[i3 + 2] = center.z + r * Math.cos(phi);

                // blend between two colors
                const t = Math.random();
                nCol[i3]     = color1[0] * (1 - t) + color2[0] * t;
                nCol[i3 + 1] = color1[1] * (1 - t) + color2[1] * t;
                nCol[i3 + 2] = color1[2] * (1 - t) + color2[2] * t;

                nSiz[i] = Math.random() * 6 + 2;
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.BufferAttribute(nPos, 3));
            geo.setAttribute("color", new THREE.BufferAttribute(nCol, 3));
            geo.setAttribute("size", new THREE.BufferAttribute(nSiz, 1));

            const mat = new THREE.ShaderMaterial({
                vertexShader: `
                    attribute float size;
                    varying vec3 vColor;
                    void main() {
                        vColor = color;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = size * (400.0 / -mvPosition.z);
                        gl_PointSize = clamp(gl_PointSize, 1.0, 20.0);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    void main() {
                        float d = length(gl_PointCoord - vec2(0.5));
                        if (d > 0.5) discard;
                        // very soft falloff for cloud effect
                        float alpha = smoothstep(0.5, 0.0, d);
                        alpha = alpha * alpha * 0.15; // very subtle
                        gl_FragColor = vec4(vColor, alpha);
                    }
                `,
                transparent: true,
                vertexColors: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });

            return new THREE.Points(geo, mat);
        }

        // magenta/pink nebula — upper right
        const nebula1 = createNebula(
            { x: 500, y: 300, z: -600 },
            [1.0, 0.0, 0.5],   // magenta
            [0.6, 0.0, 0.8],   // purple
            600, 300
        );
        scene.add(nebula1);

        // cyan/teal nebula — lower left
        const nebula2 = createNebula(
            { x: -450, y: -250, z: -500 },
            [0.0, 0.7, 1.0],   // cyan
            [0.0, 0.3, 0.8],   // deep blue
            500, 250
        );
        scene.add(nebula2);

        // warm orange/gold nebula — far center
        const nebula3 = createNebula(
            { x: -100, y: 400, z: -900 },
            [1.0, 0.5, 0.1],   // orange
            [1.0, 0.8, 0.3],   // gold
            400, 350
        );
        scene.add(nebula3);

        // subtle purple haze — behind everything
        const nebula4 = createNebula(
            { x: 200, y: -350, z: -1100 },
            [0.4, 0.1, 0.6],   // deep purple
            [0.6, 0.2, 0.4],   // dusty rose
            350, 400
        );
        scene.add(nebula4);

        // ─── GALAXY DISC (spiral-ish cluster) ───
        function createGalaxy(center, tilt, color1, color2, count, radius) {
            const gPos = new Float32Array(count * 3);
            const gCol = new Float32Array(count * 3);
            const gSiz = new Float32Array(count);

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;
                // spiral arms
                const arm = Math.floor(Math.random() * 3); // 3 arms
                const armOffset = (arm / 3) * Math.PI * 2;
                const dist = radius * Math.pow(Math.random(), 0.5);
                const angle = armOffset + dist * 0.008 + (Math.random() - 0.5) * 0.8;

                // disc shape — thin along y
                const x = Math.cos(angle) * dist + (Math.random() - 0.5) * dist * 0.3;
                const z = Math.sin(angle) * dist + (Math.random() - 0.5) * dist * 0.3;
                const y = (Math.random() - 0.5) * dist * 0.05; // very thin disc

                // apply tilt rotation around X axis
                const cosT = Math.cos(tilt);
                const sinT = Math.sin(tilt);
                gPos[i3]     = center.x + x;
                gPos[i3 + 1] = center.y + y * cosT - z * sinT;
                gPos[i3 + 2] = center.z + y * sinT + z * cosT;

                // brighter toward center
                const centralBrightness = 1.0 - (dist / radius) * 0.6;
                const t = Math.random();
                gCol[i3]     = (color1[0] * (1 - t) + color2[0] * t) * centralBrightness;
                gCol[i3 + 1] = (color1[1] * (1 - t) + color2[1] * t) * centralBrightness;
                gCol[i3 + 2] = (color1[2] * (1 - t) + color2[2] * t) * centralBrightness;

                gSiz[i] = dist < radius * 0.15
                    ? Math.random() * 4 + 2   // bigger core
                    : Math.random() * 2 + 0.5; // smaller arms
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute("position", new THREE.BufferAttribute(gPos, 3));
            geo.setAttribute("color", new THREE.BufferAttribute(gCol, 3));
            geo.setAttribute("size", new THREE.BufferAttribute(gSiz, 1));

            const mat = new THREE.ShaderMaterial({
                vertexShader: `
                    attribute float size;
                    varying vec3 vColor;
                    void main() {
                        vColor = color;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_PointSize = size * (350.0 / -mvPosition.z);
                        gl_PointSize = clamp(gl_PointSize, 0.5, 12.0);
                        gl_Position = projectionMatrix * mvPosition;
                    }
                `,
                fragmentShader: `
                    varying vec3 vColor;
                    void main() {
                        float d = length(gl_PointCoord - vec2(0.5));
                        if (d > 0.5) discard;
                        float alpha = smoothstep(0.5, 0.0, d);
                        alpha = alpha * 0.35;
                        gl_FragColor = vec4(vColor, alpha);
                    }
                `,
                transparent: true,
                vertexColors: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });

            return new THREE.Points(geo, mat);
        }

        // distant spiral galaxy — upper left
        const galaxy1 = createGalaxy(
            { x: -600, y: 200, z: -800 },
            Math.PI * 0.35,     // tilted
            [0.8, 0.7, 1.0],   // lavender
            [1.0, 0.9, 0.8],   // warm white
            800, 200
        );
        scene.add(galaxy1);

        // small edge-on galaxy — lower right  
        const galaxy2 = createGalaxy(
            { x: 700, y: -300, z: -1000 },
            Math.PI * 0.47,     // nearly edge-on
            [0.6, 0.8, 1.0],   // blue-white
            [1.0, 0.6, 0.4],   // warm
            500, 120
        );
        scene.add(galaxy2);

        // ─── BRIGHT STARS (a few extra bright ones) ───
        const BRIGHT_COUNT = 30;
        const brightPos = new Float32Array(BRIGHT_COUNT * 3);
        const brightCol = new Float32Array(BRIGHT_COUNT * 3);
        const brightSiz = new Float32Array(BRIGHT_COUNT);

        const brightColors = [
            [1.0, 1.0, 1.0],
            [0.8, 0.9, 1.0],
            [1.0, 0.85, 0.7],
            [0.7, 0.8, 1.0],
        ];

        for (let i = 0; i < BRIGHT_COUNT; i++) {
            const i3 = i * 3;
            const r = 200 + Math.random() * 800;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            brightPos[i3]     = r * Math.sin(phi) * Math.cos(theta);
            brightPos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            brightPos[i3 + 2] = r * Math.cos(phi);

            const c = brightColors[Math.floor(Math.random() * brightColors.length)];
            brightCol[i3]     = c[0];
            brightCol[i3 + 1] = c[1];
            brightCol[i3 + 2] = c[2];

            brightSiz[i] = Math.random() * 4 + 3;
        }

        const brightGeo = new THREE.BufferGeometry();
        brightGeo.setAttribute("position", new THREE.BufferAttribute(brightPos, 3));
        brightGeo.setAttribute("color", new THREE.BufferAttribute(brightCol, 3));
        brightGeo.setAttribute("size", new THREE.BufferAttribute(brightSiz, 1));

        const brightMat = new THREE.ShaderMaterial({
            vertexShader: `
                attribute float size;
                varying vec3 vColor;
                void main() {
                    vColor = color;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (400.0 / -mvPosition.z);
                    gl_PointSize = clamp(gl_PointSize, 2.0, 15.0);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float d = length(gl_PointCoord - vec2(0.5));
                    if (d > 0.5) discard;
                    // bright core with soft halo
                    float core = smoothstep(0.15, 0.0, d);
                    float halo = smoothstep(0.5, 0.0, d) * 0.3;
                    // cross/spike effect
                    vec2 uv = gl_PointCoord - vec2(0.5);
                    float spike = exp(-abs(uv.x) * 12.0) * exp(-abs(uv.y) * 40.0)
                                + exp(-abs(uv.y) * 12.0) * exp(-abs(uv.x) * 40.0);
                    spike *= 0.4;
                    float alpha = core + halo + spike;
                    gl_FragColor = vec4(vColor, alpha);
                }
            `,
            transparent: true,
            vertexColors: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const brightStars = new THREE.Points(brightGeo, brightMat);
        scene.add(brightStars);

        // ─── MOUSE TRACKING ───
        let targetRotX = 0;
        let targetRotY = 0;
        let currentRotX = 0;
        let currentRotY = 0;

        document.addEventListener("mousemove", (e) => {
            targetRotY = (e.clientX / window.innerWidth - 0.5) * 0.6;
            targetRotX = (e.clientY / window.innerHeight - 0.5) * 0.4;
        }, { passive: true });

        // ─── SCROLL DEPTH ───
        let scrollOffset = 0;
        window.addEventListener("scroll", () => {
            scrollOffset = window.scrollY * 0.0003;
        }, { passive: true });

        // ─── RESIZE ───
        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // ─── ALL SCENE OBJECTS for rotation ───
        const allObjects = [stars, farStars, nebula1, nebula2, nebula3, nebula4, galaxy1, galaxy2, brightStars];

        // ─── ANIMATION ───
        const clock = new THREE.Clock();

        function animate() {
            requestAnimationFrame(animate);

            const t = clock.getElapsedTime();

            // smooth mouse follow
            currentRotX += (targetRotX - currentRotX) * 0.03;
            currentRotY += (targetRotY - currentRotY) * 0.03;

            // base drift + mouse swivel
            const baseRotX = t * 0.003 + currentRotX;
            const baseRotY = t * 0.005 + currentRotY;

            // rotate everything together
            allObjects.forEach((obj, i) => {
                const depthFactor = 1.0 - i * 0.08; // deeper objects rotate slightly less
                obj.rotation.x = baseRotX * depthFactor;
                obj.rotation.y = baseRotY * depthFactor;
            });

            // scroll pushes camera forward
            camera.position.z = scrollOffset * -50;

            renderer.render(scene, camera);
        }

        animate();
    });
})();
