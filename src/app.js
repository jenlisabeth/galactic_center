const DEG_TO_RAD = Math.PI / 180;
        const RAD_TO_DEG = 180 / Math.PI;
        const FALLBACK_LOCATION = { latitude: 50.93, longitude: 3.33, label: "Oostrozebeke, BE" };
        const GC_RA_DEG = (17 + 45 / 60 + 40.04 / 3600) * 15;
        const GC_DEC_DEG = -(29 + 0 / 60 + 28.1 / 3600);
        const STAR_COUNT = 15000;
        const STAR_RADIUS = 400;
        const MARKER_DISTANCE = 18;
        const BRIGHT_STARS = [
            { name: "Sirius", ra: 101.287, dec: -16.716, color: 0xbdd7ff },
            { name: "Canopus", ra: 95.988, dec: -52.696, color: 0xfff0c5 },
            { name: "Arcturus", ra: 213.915, dec: 19.182, color: 0xffc27a },
            { name: "Vega", ra: 279.234, dec: 38.784, color: 0xd9e8ff },
            { name: "Capella", ra: 79.172, dec: 45.998, color: 0xfff0ad },
            { name: "Rigel", ra: 78.634, dec: -8.202, color: 0xb9d7ff },
            { name: "Procyon", ra: 114.825, dec: 5.225, color: 0xf4f0df },
            { name: "Betelgeuse", ra: 88.793, dec: 7.407, color: 0xff8b5f },
            { name: "Altair", ra: 297.696, dec: 8.868, color: 0xe8f1ff },
            { name: "Aldebaran", ra: 68.980, dec: 16.509, color: 0xffad72 },
            { name: "Antares", ra: 247.352, dec: -26.432, color: 0xff7967 },
            { name: "Spica", ra: 201.298, dec: -11.161, color: 0xb8cfff },
            { name: "Pollux", ra: 116.329, dec: 28.026, color: 0xffd7a4 },
            { name: "Fomalhaut", ra: 344.413, dec: -29.622, color: 0xeaf2ff },
            { name: "Deneb", ra: 310.358, dec: 45.280, color: 0xdceaff }
        ];
        const PLANETS = [
            {
                name: "Mercury",
                color: 0xb9b1a5,
                radius: 0.08,
                elements: {
                    N: [48.3313, 3.24587E-5],
                    i: [7.0047, 5.00E-8],
                    w: [29.1241, 1.01444E-5],
                    a: [0.387098, 0],
                    e: [0.205635, 5.59E-10],
                    M: [168.6562, 4.0923344368]
                }
            },
            {
                name: "Venus",
                color: 0xe7d7a0,
                radius: 0.11,
                elements: {
                    N: [76.6799, 2.46590E-5],
                    i: [3.3946, 2.75E-8],
                    w: [54.8910, 1.38374E-5],
                    a: [0.723330, 0],
                    e: [0.006773, -1.302E-9],
                    M: [48.0052, 1.6021302244]
                }
            },
            {
                name: "Mars",
                color: 0xff7557,
                radius: 0.10,
                elements: {
                    N: [49.5574, 2.11081E-5],
                    i: [1.8497, -1.78E-8],
                    w: [286.5016, 2.92961E-5],
                    a: [1.523688, 0],
                    e: [0.093405, 2.516E-9],
                    M: [18.6021, 0.5240207766]
                }
            },
            {
                name: "Jupiter",
                color: 0xf1c27d,
                radius: 0.16,
                elements: {
                    N: [100.4542, 2.76854E-5],
                    i: [1.3030, -1.557E-7],
                    w: [273.8777, 1.64505E-5],
                    a: [5.20256, 0],
                    e: [0.048498, 4.469E-9],
                    M: [19.8950, 0.0830853001]
                }
            },
            {
                name: "Saturn",
                color: 0xd9c38a,
                radius: 0.15,
                elements: {
                    N: [113.6634, 2.38980E-5],
                    i: [2.4886, -1.081E-7],
                    w: [339.3939, 2.97661E-5],
                    a: [9.55475, 0],
                    e: [0.055546, -9.499E-9],
                    M: [316.9670, 0.0334442282]
                }
            },
            {
                name: "Uranus",
                color: 0x8fd8ff,
                radius: 0.12,
                elements: {
                    N: [74.0005, 1.3978E-5],
                    i: [0.7733, 1.9E-8],
                    w: [96.6612, 3.0565E-5],
                    a: [19.18171, -1.55E-8],
                    e: [0.047318, 7.45E-9],
                    M: [142.5905, 0.011725806]
                }
            },
            {
                name: "Neptune",
                color: 0x6f8cff,
                radius: 0.12,
                elements: {
                    N: [131.7806, 3.0173E-5],
                    i: [1.7700, -2.55E-7],
                    w: [272.8461, -6.027E-6],
                    a: [30.05826, 3.313E-8],
                    e: [0.008606, 2.15E-9],
                    M: [260.2471, 0.005995147]
                }
            }
        ];

        let scene;
        let camera;
        let renderer;
        let needleGroup;
        let starPoints;
        let markerGroup;
        let celestialMarkers = new Map();
        let animationClock;
        let userLocation = null;
        let locationReady = false;
        let locationTimeout = null;
        let hasDeviceOrientationData = false;
        let overridesEnabled = false;
        let orientationSensor = null;
        let isAlignmentActive = false;
        let lastCalcTime = 0;
        let statusTimeout = null;
        let deviceToWorldQuaternion;
        let manualAlignmentOffset;
        let galacticCenterAzAlt = { azimuth: 0, altitude: 0 };
        let sunAzAlt = { azimuth: 0, altitude: 0 };
        let planetAzAlts = [];
        let brightStarAzAlts = [];
        let viewYaw = 0;
        let viewPitch = 0.18;
        let viewDistance = 4.2;
        const DEFAULT_VIEW_YAW = 0;
        const DEFAULT_VIEW_PITCH = 0.18;
        const DEFAULT_VIEW_DISTANCE = 4.2;
        let isDraggingView = false;
        let lastPointer = { x: 0, y: 0 };

        const dom = {
            container: document.getElementById("container"),
            status: document.getElementById("status"),
            loc: document.getElementById("loc"),
            mode: document.getElementById("mode"),
            alignmentStatus: document.getElementById("alignment-status"),
            gcAz: document.getElementById("gc-az"),
            gcAlt: document.getElementById("gc-alt"),
            sunAz: document.getElementById("sun-az"),
            sunAlt: document.getElementById("sun-alt"),
            sensorStats: document.getElementById("sensor-stats"),
            sensorAbs: document.getElementById("sensor-abs"),
            sensorA: document.getElementById("sensor-a"),
            sensorB: document.getElementById("sensor-b"),
            sensorG: document.getElementById("sensor-g"),
            overrideCheckbox: document.getElementById("enable-overrides"),
            overrideInputs: document.getElementById("override-inputs"),
            overrideLat: document.getElementById("override-lat"),
            overrideLon: document.getElementById("override-lon"),
            overrideA: document.getElementById("override-a"),
            overrideB: document.getElementById("override-b"),
            overrideG: document.getElementById("override-g"),
            applyOverrides: document.getElementById("apply-overrides"),
            permissions: document.getElementById("permissions"),
            permissionButton: document.getElementById("permissionButton"),
            alignNorth: document.getElementById("align-north-button"),
            alignSun: document.getElementById("align-sun-button"),
            setDefaultPose: document.getElementById("set-default-pose-button"),
            resetAlignment: document.getElementById("reset-alignment-button"),
            resetView: document.getElementById("reset-view-button"),
            toggleDebug: document.getElementById("toggle-debug-button")
        };

        function startApp() {
            if (!window.THREE) {
                showStatus("Three.js did not load. Check your internet connection and reload this page.");
                dom.mode.textContent = "Render Error";
                return;
            }

            deviceToWorldQuaternion = new THREE.Quaternion();
            manualAlignmentOffset = new THREE.Quaternion().identity();
            animationClock = new THREE.Clock();

            initScene();
            bindControls();
            initializeOverlayPanels();
            populateOverrideInputs();
            setupSensors();
            requestLocation();
            animate();
        }

        function initScene() {
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);

            renderer = new THREE.WebGLRenderer({ antialias: true });
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            dom.container.appendChild(renderer.domElement);
            renderer.domElement.style.touchAction = "none";

            scene.add(new THREE.AmbientLight(0x505050));
            const pointLight = new THREE.PointLight(0xffffff, 0.8);
            camera.add(pointLight);
            scene.add(camera);

            createStarfield();
            createNeedle();
            createCelestialMarkers();
            updateCameraView();
            window.addEventListener("resize", handleResize);
        }

        function createStarfield() {
            const positions = new Float32Array(STAR_COUNT * 3);
            const colors = new Float32Array(STAR_COUNT * 3);
            const color = new THREE.Color();

            for (let i = 0; i < STAR_COUNT; i += 1) {
                const i3 = i * 3;
                const vector = new THREE.Vector3(
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1,
                    Math.random() * 2 - 1
                ).normalize().multiplyScalar(STAR_RADIUS);
                const intensity = Math.random() * 0.6 + 0.4;

                positions[i3] = vector.x;
                positions[i3 + 1] = vector.y;
                positions[i3 + 2] = vector.z;
                color.setRGB(intensity, intensity, intensity);
                colors[i3] = color.r;
                colors[i3 + 1] = color.g;
                colors[i3 + 2] = color.b;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 1.2,
                sizeAttenuation: true,
                vertexColors: true,
                transparent: true,
                opacity: 0.9,
                blending: THREE.AdditiveBlending
            });

            starPoints = new THREE.Points(geometry, material);
            scene.add(starPoints);
        }

        function createNeedle() {
            needleGroup = new THREE.Group();

            const material = new THREE.MeshPhongMaterial({ color: 0x42f58d, emissive: 0x064d24 });
            const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.5, 16), material);
            shaft.rotation.x = Math.PI / 2;
            shaft.position.z = 0.75;

            const tip = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.4, 16), material);
            tip.rotation.x = Math.PI / 2;
            tip.position.z = 1.7;

            needleGroup.add(shaft, tip);
            scene.add(needleGroup);
        }

        function createCelestialMarkers() {
            markerGroup = new THREE.Group();
            scene.add(markerGroup);

            addCelestialMarker("Sagittarius A*", 0xff4f8b, 0.18);
            addCelestialMarker("Sun", 0xffd35a, 0.24);

            for (const planet of PLANETS) {
                addCelestialMarker(planet.name, planet.color, planet.radius);
            }

            for (const star of BRIGHT_STARS) {
                addCelestialMarker(star.name, star.color, 0.07);
            }
        }

        function addCelestialMarker(name, color, radius) {
            const group = new THREE.Group();
            const body = new THREE.Mesh(
                new THREE.SphereGeometry(radius, 20, 16),
                new THREE.MeshBasicMaterial({ color })
            );
            const halo = new THREE.Mesh(
                new THREE.RingGeometry(radius * 1.65, radius * 2.15, 32),
                new THREE.MeshBasicMaterial({
                    color,
                    transparent: true,
                    opacity: 0.45,
                    side: THREE.DoubleSide,
                    depthWrite: false
                })
            );
            const label = makeLabelSprite(name, color);

            halo.position.z = -0.01;
            label.position.set(0, Math.max(0.62, radius * 3.2), 0);
            group.add(body, halo, label);
            group.visible = false;
            markerGroup.add(group);
            celestialMarkers.set(name, { group, halo, label });
        }

        function makeLabelSprite(text, color) {
            const canvas = document.createElement("canvas");
            const context = canvas.getContext("2d");
            const width = 512;
            const height = 128;
            canvas.width = width;
            canvas.height = height;

            context.font = "42px Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = "rgba(0, 0, 0, 0.62)";
            context.fillRect(0, 12, width, height - 24);
            context.strokeStyle = `#${color.toString(16).padStart(6, "0")}`;
            context.lineWidth = 5;
            context.strokeRect(4, 14, width - 8, height - 28);
            context.fillStyle = "#ffffff";
            context.fillText(text, width / 2, height / 2);

            const texture = new THREE.CanvasTexture(canvas);
            const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
            const sprite = new THREE.Sprite(material);
            sprite.scale.set(3.2, 0.8, 1);
            return sprite;
        }

        function bindControls() {
            dom.overrideCheckbox.addEventListener("change", handleOverrideToggle);
            dom.applyOverrides.addEventListener("click", applyOverrides);
            dom.alignNorth.addEventListener("click", () => setManualAlignment("North"));
            dom.alignSun.addEventListener("click", () => setManualAlignment("Sun"));
            dom.setDefaultPose.addEventListener("click", setDefaultPose);
            dom.resetAlignment.addEventListener("click", resetManualAlignment);
            dom.resetView.addEventListener("click", resetView);
            dom.toggleDebug.addEventListener("click", toggleDebugPanels);
            dom.permissionButton.addEventListener("click", requestDeviceOrientationPermission);
            renderer.domElement.addEventListener("pointerdown", handleViewPointerDown);
            renderer.domElement.addEventListener("pointermove", handleViewPointerMove);
            renderer.domElement.addEventListener("pointerup", handleViewPointerUp);
            renderer.domElement.addEventListener("pointercancel", handleViewPointerUp);
            renderer.domElement.addEventListener("wheel", handleViewWheel, { passive: false });
        }

        function initializeOverlayPanels() {
            for (const panel of document.querySelectorAll(".ui-overlay")) {
                if (panel.id === "status" || panel.id === "view-help") continue;

                const title = panel.querySelector("b");
                if (!title) continue;

                panel.classList.add("panel");
                title.classList.add("panel-title");

                const header = document.createElement("div");
                header.className = "panel-header";
                const toggle = document.createElement("button");
                toggle.className = "panel-toggle";
                toggle.type = "button";
                toggle.textContent = "-";
                toggle.setAttribute("aria-label", `Collapse ${title.textContent}`);

                panel.insertBefore(header, title);
                header.append(title, toggle);

                const content = document.createElement("div");
                content.className = "panel-content";
                while (header.nextSibling) {
                    content.appendChild(header.nextSibling);
                }
                panel.appendChild(content);

                toggle.addEventListener("click", (event) => {
                    event.stopPropagation();
                    const collapsed = panel.classList.toggle("collapsed");
                    toggle.textContent = collapsed ? "+" : "-";
                    toggle.setAttribute("aria-label", `${collapsed ? "Expand" : "Collapse"} ${title.textContent}`);
                });

                enablePanelDrag(panel, header);
            }
        }

        function enablePanelDrag(panel, handle) {
            let dragging = false;
            let offsetX = 0;
            let offsetY = 0;

            handle.addEventListener("pointerdown", (event) => {
                if (event.target.closest("button, input, label, fieldset")) return;

                const rect = panel.getBoundingClientRect();
                dragging = true;
                offsetX = event.clientX - rect.left;
                offsetY = event.clientY - rect.top;
                panel.style.left = `${rect.left}px`;
                panel.style.top = `${rect.top}px`;
                panel.style.right = "auto";
                panel.style.bottom = "auto";
                panel.style.transform = "none";
                panel.style.zIndex = "30";
                handle.setPointerCapture(event.pointerId);
            });

            handle.addEventListener("pointermove", (event) => {
                if (!dragging) return;

                const rect = panel.getBoundingClientRect();
                const maxLeft = Math.max(0, window.innerWidth - rect.width);
                const maxTop = Math.max(0, window.innerHeight - rect.height);
                const left = clamp(event.clientX - offsetX, 0, maxLeft);
                const top = clamp(event.clientY - offsetY, 0, maxTop);
                panel.style.left = `${left}px`;
                panel.style.top = `${top}px`;
            });

            function stopDrag(event) {
                if (!dragging) return;
                dragging = false;
                panel.style.zIndex = "10";
                if (handle.hasPointerCapture(event.pointerId)) {
                    handle.releasePointerCapture(event.pointerId);
                }
            }

            handle.addEventListener("pointerup", stopDrag);
            handle.addEventListener("pointercancel", stopDrag);
        }

        async function setupSensors() {
            if ("AbsoluteOrientationSensor" in window && navigator.permissions) {
                try {
                    const permissions = await Promise.all([
                        navigator.permissions.query({ name: "accelerometer" }),
                        navigator.permissions.query({ name: "gyroscope" }),
                        navigator.permissions.query({ name: "magnetometer" })
                    ]);

                    if (permissions.every((permission) => permission.state === "granted")) {
                        startAbsoluteOrientationSensor();
                        return;
                    }
                } catch (error) {
                    console.warn("AbsoluteOrientationSensor permission check failed:", error);
                }
            }

            setupDeviceOrientationFallback();
        }

        function startAbsoluteOrientationSensor() {
            try {
                orientationSensor = new AbsoluteOrientationSensor({ frequency: 60 });
                orientationSensor.addEventListener("reading", handleAOSReading);
                orientationSensor.addEventListener("error", handleAOSError);
                orientationSensor.start();
                hasDeviceOrientationData = true;
                dom.sensorStats.style.display = "block";
                updateModeDisplay("Mobile (AOS)");
                showStatus("Using AbsoluteOrientationSensor.", true);
            } catch (error) {
                console.warn("AbsoluteOrientationSensor failed:", error);
                setupDeviceOrientationFallback();
            }
        }

        function setupDeviceOrientationFallback() {
            orientationSensor = null;

            if (typeof DeviceOrientationEvent === "undefined") {
                updateModeDisplay("PC (No Sensors)");
                showStatus("No motion sensors found. Manual overrides are still available.", true);
                return;
            }

            if (typeof DeviceOrientationEvent.requestPermission === "function") {
                dom.permissions.style.display = "block";
                updateModeDisplay("Permission Needed");
                return;
            }

            window.addEventListener("deviceorientation", handleDOEReading);
            updateModeDisplay("Waiting for Sensors");
        }

        async function requestDeviceOrientationPermission() {
            try {
                const permissionState = await DeviceOrientationEvent.requestPermission();
                dom.permissions.style.display = "none";

                if (permissionState === "granted") {
                    window.addEventListener("deviceorientation", handleDOEReading);
                    updateModeDisplay("Waiting for Sensors");
                    showStatus("Motion sensor access granted.", true);
                } else {
                    updateModeDisplay("Sensors Denied");
                    showStatus("Motion sensor access was denied. Use manual overrides if needed.");
                }
            } catch (error) {
                console.warn("Device orientation permission failed:", error);
                dom.permissions.style.display = "none";
                updateModeDisplay("Sensor Error");
                showStatus("Could not request motion sensor access.");
            }
        }

        function handleAOSError(event) {
            console.warn("AbsoluteOrientationSensor error:", event.error || event);
            if (orientationSensor) {
                orientationSensor.stop();
                orientationSensor = null;
            }
            setupDeviceOrientationFallback();
        }

        function requestLocation() {
            if (!("geolocation" in navigator)) {
                showStatus("Geolocation is not available. Using the fallback location.", true);
                useFallbackLocation();
                return;
            }

            clearTimeout(locationTimeout);
            locationTimeout = setTimeout(useFallbackLocation, 8000);
            navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError, {
                enableHighAccuracy: true,
                timeout: 7000,
                maximumAge: 60000
            });
        }

        function handleLocationSuccess(position) {
            clearTimeout(locationTimeout);
            userLocation = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            locationReady = true;
            dom.loc.textContent = formatLocation(userLocation);
            calculateCelestialPositions();
            populateOverrideInputs();
            clearStatus();
        }

        function handleLocationError(error) {
            console.warn("Geolocation error:", error.message);
            useFallbackLocation();
        }

        function useFallbackLocation() {
            clearTimeout(locationTimeout);
            if (userLocation) return;

            userLocation = {
                latitude: FALLBACK_LOCATION.latitude,
                longitude: FALLBACK_LOCATION.longitude
            };
            locationReady = true;
            dom.loc.textContent = `${formatLocation(userLocation)} fallback`;
            showStatus(`Using fallback location: ${FALLBACK_LOCATION.label}.`, true);
            calculateCelestialPositions();
            populateOverrideInputs();
        }

        function handleAOSReading() {
            if (overridesEnabled || !orientationSensor || !orientationSensor.quaternion) return;

            const rawOrientation = new THREE.Quaternion().fromArray(orientationSensor.quaternion);
            const euler = new THREE.Euler().setFromQuaternion(rawOrientation, "ZXY");

            dom.sensorAbs.textContent = "Quaternion (AOS)";
            dom.sensorA.textContent = normalizeDegrees(euler.z * RAD_TO_DEG).toFixed(1);
            dom.sensorB.textContent = (euler.x * RAD_TO_DEG).toFixed(1);
            dom.sensorG.textContent = (euler.y * RAD_TO_DEG).toFixed(1);

            deviceToWorldQuaternion.copy(rawOrientation);
            applyManualAlignmentOffset();
        }

        function handleDOEReading(event) {
            if (overridesEnabled || orientationSensor) return;
            if (event.alpha === null || event.beta === null || event.gamma === null) return;

            if (!hasDeviceOrientationData) {
                hasDeviceOrientationData = true;
                dom.sensorStats.style.display = "block";
                updateModeDisplay("Mobile (DOE)");
            showStatus("Using DeviceOrientationEvent attitude data. Align to North or Sun if the compass drifts.", true);
            }

            dom.sensorAbs.textContent = event.absolute ? "Euler angles (absolute DOE)" : "Euler angles (relative DOE)";
            dom.sensorA.textContent = event.alpha.toFixed(1);
            dom.sensorB.textContent = event.beta.toFixed(1);
            dom.sensorG.textContent = event.gamma.toFixed(1);

            deviceToWorldQuaternion.copy(deviceOrientationEventToQuaternion(event.alpha, event.beta, event.gamma));
            applyManualAlignmentOffset();

            if (!dom.overrideA.value) dom.overrideA.value = event.alpha.toFixed(1);
            if (!dom.overrideB.value) dom.overrideB.value = event.beta.toFixed(1);
            if (!dom.overrideG.value) dom.overrideG.value = event.gamma.toFixed(1);
        }

        function handleOverrideToggle() {
            overridesEnabled = dom.overrideCheckbox.checked;
            dom.overrideInputs.disabled = !overridesEnabled;
            updateModeDisplay();

            if (overridesEnabled) {
                dom.sensorStats.style.display = "none";
                applyOverrides();
                showStatus("Manual override mode enabled.", true);
                return;
            }

            if (isAlignmentActive) resetManualAlignment();
            if (hasDeviceOrientationData) dom.sensorStats.style.display = "block";
            if (locationReady) calculateCelestialPositions();
            clearStatus();
        }

        function applyOverrides() {
            if (!overridesEnabled) return;

            const lat = parseFloat(dom.overrideLat.value);
            const lon = parseFloat(dom.overrideLon.value);
            if (!isValidLatitude(lat) || !isValidLongitude(lon)) {
                locationReady = false;
                calculateCelestialPositions();
                showStatus("Enter a valid latitude (-90 to 90) and longitude (-180 to 180).");
                return;
            }

            const yaw = parseFloat(dom.overrideA.value) || 0;
            const pitch = parseFloat(dom.overrideB.value) || 0;
            const roll = parseFloat(dom.overrideG.value) || 0;

            userLocation = { latitude: lat, longitude: lon };
            locationReady = true;
            deviceToWorldQuaternion.copy(manualYawPitchRollToQuaternion(yaw, pitch, roll));
            dom.loc.textContent = `${formatLocation(userLocation)} override`;
            calculateCelestialPositions();
            showStatus("Override values applied.", true);
        }

        function populateOverrideInputs() {
            if (userLocation) {
                dom.overrideLat.value = userLocation.latitude.toFixed(4);
                dom.overrideLon.value = userLocation.longitude.toFixed(4);
            }
            if (!dom.overrideA.value) dom.overrideA.value = "0";
            if (!dom.overrideB.value) dom.overrideB.value = "0";
            if (!dom.overrideG.value) dom.overrideG.value = "0";
        }

        function calculateCelestialPositions() {
            if (!locationReady || !userLocation) {
                dom.gcAz.textContent = "---";
                dom.gcAlt.textContent = "---";
                dom.sunAz.textContent = "---";
                dom.sunAlt.textContent = "---";
                updateCelestialMarkers();
                return;
            }

            const now = new Date();
            galacticCenterAzAlt = calculateAzAlt(now, userLocation.latitude, userLocation.longitude, GC_RA_DEG, GC_DEC_DEG);
            sunAzAlt = calculateSunPosition(now, userLocation.latitude, userLocation.longitude);
            planetAzAlts = calculatePlanetPositions(now, userLocation.latitude, userLocation.longitude);
            brightStarAzAlts = BRIGHT_STARS.map((star) => ({
                name: star.name,
                ...calculateAzAlt(now, userLocation.latitude, userLocation.longitude, star.ra, star.dec)
            }));

            dom.gcAz.textContent = galacticCenterAzAlt.azimuth.toFixed(1);
            dom.gcAlt.textContent = galacticCenterAzAlt.altitude.toFixed(1);
            dom.sunAz.textContent = sunAzAlt.azimuth.toFixed(1);
            dom.sunAlt.textContent = sunAzAlt.altitude.toFixed(1);
            updateCelestialMarkers();
        }

        function calculateSunPosition(date, lat, lon) {
            const jd = julianDate(date);
            const n = jd - 2451545.0;
            const meanLongitude = normalizeDegrees(280.460 + 0.9856474 * n);
            const meanAnomaly = normalizeDegrees(357.528 + 0.9856003 * n);
            const eclipticLongitude = meanLongitude
                + 1.915 * Math.sin(meanAnomaly * DEG_TO_RAD)
                + 0.020 * Math.sin(2 * meanAnomaly * DEG_TO_RAD);
            const obliquity = 23.439 - 0.0000004 * n;
            const lambda = eclipticLongitude * DEG_TO_RAD;
            const epsilon = obliquity * DEG_TO_RAD;
            let rightAscension = Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda)) * RAD_TO_DEG;
            const declination = Math.asin(Math.sin(epsilon) * Math.sin(lambda)) * RAD_TO_DEG;

            rightAscension = normalizeDegrees(rightAscension);
            return calculateAzAlt(date, lat, lon, rightAscension, declination);
        }

        function calculateAzAlt(date, lat, lon, rightAscensionDeg, declinationDeg) {
            const lstDeg = localSiderealTime(date, lon);
            const hourAngleDeg = normalizeSignedDegrees(lstDeg - rightAscensionDeg);
            const hourAngle = hourAngleDeg * DEG_TO_RAD;
            const latitude = lat * DEG_TO_RAD;
            const declination = declinationDeg * DEG_TO_RAD;

            const sinAlt = Math.sin(declination) * Math.sin(latitude)
                + Math.cos(declination) * Math.cos(latitude) * Math.cos(hourAngle);
            const altitude = Math.asin(clamp(sinAlt, -1, 1));
            const cosAlt = Math.cos(altitude);
            let azimuth = 0;

            if (Math.abs(cosAlt) > 0.0001) {
                const cosAz = clamp(
                    (Math.sin(declination) - Math.sin(altitude) * Math.sin(latitude))
                    / (cosAlt * Math.cos(latitude)),
                    -1,
                    1
                );
                const sinAz = clamp(
                    (-Math.cos(declination) * Math.sin(hourAngle)) / cosAlt,
                    -1,
                    1
                );
                azimuth = Math.atan2(sinAz, cosAz);
            }

            return {
                azimuth: normalizeDegrees(azimuth * RAD_TO_DEG),
                altitude: altitude * RAD_TO_DEG
            };
        }

        function calculatePlanetPositions(date, lat, lon) {
            const d = julianDate(date) - 2451543.5;
            const earth = heliocentricEclipticPosition(getEarthElements(), d);
            const planets = [];

            for (const planet of PLANETS) {
                const heliocentric = heliocentricEclipticPosition(planet.elements, d);
                const geocentric = {
                    x: heliocentric.x - earth.x,
                    y: heliocentric.y - earth.y,
                    z: heliocentric.z - earth.z
                };
                const equatorial = eclipticToEquatorial(geocentric, d);
                const skyPosition = calculateAzAlt(date, lat, lon, equatorial.ra, equatorial.dec);
                planets.push({ name: planet.name, ...skyPosition });
            }

            return planets;
        }

        function getEarthElements() {
            return {
                N: [0, 0],
                i: [0, 0],
                w: [282.9404, 4.70935E-5],
                a: [1.000000, 0],
                e: [0.016709, -1.151E-9],
                M: [356.0470, 0.9856002585]
            };
        }

        function heliocentricEclipticPosition(elements, d) {
            const N = elementValue(elements.N, d) * DEG_TO_RAD;
            const i = elementValue(elements.i, d) * DEG_TO_RAD;
            const w = elementValue(elements.w, d) * DEG_TO_RAD;
            const a = elementValue(elements.a, d);
            const e = elementValue(elements.e, d);
            const M = normalizeDegrees(elementValue(elements.M, d)) * DEG_TO_RAD;
            const eccentricAnomaly = solveEccentricAnomaly(M, e);
            const xv = a * (Math.cos(eccentricAnomaly) - e);
            const yv = a * Math.sqrt(1 - e * e) * Math.sin(eccentricAnomaly);
            const v = Math.atan2(yv, xv);
            const r = Math.sqrt(xv * xv + yv * yv);
            const vw = v + w;

            return {
                x: r * (Math.cos(N) * Math.cos(vw) - Math.sin(N) * Math.sin(vw) * Math.cos(i)),
                y: r * (Math.sin(N) * Math.cos(vw) + Math.cos(N) * Math.sin(vw) * Math.cos(i)),
                z: r * Math.sin(vw) * Math.sin(i)
            };
        }

        function eclipticToEquatorial(position, d) {
            const obliquity = (23.4393 - 3.563E-7 * d) * DEG_TO_RAD;
            const x = position.x;
            const y = position.y * Math.cos(obliquity) - position.z * Math.sin(obliquity);
            const z = position.y * Math.sin(obliquity) + position.z * Math.cos(obliquity);
            const ra = normalizeDegrees(Math.atan2(y, x) * RAD_TO_DEG);
            const dec = Math.atan2(z, Math.sqrt(x * x + y * y)) * RAD_TO_DEG;

            return { ra, dec };
        }

        function solveEccentricAnomaly(meanAnomaly, eccentricity) {
            let eccentricAnomaly = meanAnomaly + eccentricity * Math.sin(meanAnomaly) * (1 + eccentricity * Math.cos(meanAnomaly));

            for (let i = 0; i < 5; i += 1) {
                eccentricAnomaly -= (eccentricAnomaly - eccentricity * Math.sin(eccentricAnomaly) - meanAnomaly)
                    / (1 - eccentricity * Math.cos(eccentricAnomaly));
            }

            return eccentricAnomaly;
        }

        function elementValue(pair, d) {
            return pair[0] + pair[1] * d;
        }

        function julianDate(date) {
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth() + 1;
            const day = date.getUTCDate();
            const hours = date.getUTCHours() + date.getUTCMinutes() / 60
                + date.getUTCSeconds() / 3600 + date.getUTCMilliseconds() / 3600000;
            let y = year;
            let m = month;

            if (m <= 2) {
                y -= 1;
                m += 12;
            }

            const a = Math.floor(y / 100);
            const b = 2 - a + Math.floor(a / 4);
            return Math.floor(365.25 * (y + 4716))
                + Math.floor(30.6001 * (m + 1))
                + day
                + hours / 24
                + b
                - 1524.5;
        }

        function localSiderealTime(date, lon) {
            const jd = julianDate(date);
            const d = jd - 2451545.0;
            const gmstHours = 18.697374558 + 24.06570982441908 * d;
            return normalizeDegrees(gmstHours * 15 + lon);
        }

        function setManualAlignment(targetType) {
            const currentRawOrientation = readCurrentRawOrientation();
            if (!currentRawOrientation) {
                showStatus("Activate sensors or overrides before aligning.", true);
                return;
            }

            let targetVectorWorld;
            if (targetType === "North") {
                targetVectorWorld = new THREE.Vector3(0, 0, 1);
            } else if (targetType === "Sun") {
                if (!locationReady) {
                    showStatus("Location is needed for Sun alignment.", true);
                    return;
                }
                if (sunAzAlt.altitude < -2) {
                    showStatus("The Sun is too low for alignment right now.", true);
                    return;
                }
                targetVectorWorld = azAltToVector(sunAzAlt.azimuth, sunAzAlt.altitude);
            } else {
                return;
            }

            const currentTopWorld = deviceTopAxis().applyQuaternion(currentRawOrientation).normalize();
            const correction = new THREE.Quaternion().setFromUnitVectors(currentTopWorld, targetVectorWorld.normalize());
            manualAlignmentOffset.copy(correction);
            isAlignmentActive = true;
            dom.resetAlignment.disabled = false;
            dom.alignmentStatus.textContent = `${targetType} Aligned`;
            deviceToWorldQuaternion.copy(currentRawOrientation);
            applyManualAlignmentOffset();
            showStatus(`Top-edge alignment set to ${targetType}.`, true);
        }

        function setDefaultPose() {
            const currentRawOrientation = readCurrentRawOrientation();
            if (!currentRawOrientation) {
                showStatus("Activate sensors or overrides before setting a default pose.", true);
                return;
            }

            manualAlignmentOffset.copy(currentRawOrientation.clone().conjugate());
            isAlignmentActive = true;
            dom.resetAlignment.disabled = false;
            dom.alignmentStatus.textContent = "Default Pose";
            deviceToWorldQuaternion.copy(currentRawOrientation);
            applyManualAlignmentOffset();
            resetView();
            showStatus("Current pose is now the default orientation.", true);
        }

        function resetManualAlignment() {
            manualAlignmentOffset.identity();
            isAlignmentActive = false;
            dom.resetAlignment.disabled = true;
            dom.alignmentStatus.textContent = "Inactive";
            showStatus("Manual alignment reset.", true);
        }

        function readCurrentRawOrientation() {
            if (overridesEnabled) {
                return manualYawPitchRollToQuaternion(
                    parseFloat(dom.overrideA.value) || 0,
                    parseFloat(dom.overrideB.value) || 0,
                    parseFloat(dom.overrideG.value) || 0
                );
            }

            if (orientationSensor && orientationSensor.quaternion) {
                return new THREE.Quaternion().fromArray(orientationSensor.quaternion);
            }

            const alpha = parseFloat(dom.sensorA.textContent);
            const beta = parseFloat(dom.sensorB.textContent);
            const gamma = parseFloat(dom.sensorG.textContent);

            if ([alpha, beta, gamma].every(Number.isFinite)) {
                return deviceOrientationEventToQuaternion(alpha, beta, gamma);
            }

            return null;
        }

        function updateNeedleRotation() {
            if (!needleGroup || !locationReady) return;

            let targetVector = azAltToVector(galacticCenterAzAlt.azimuth, galacticCenterAzAlt.altitude);
            if (hasDeviceOrientationData || overridesEnabled) {
                targetVector = targetVector.applyQuaternion(deviceToWorldQuaternion.clone().conjugate());
            }

            const needleAxis = new THREE.Vector3(0, 0, 1);
            const finalRotation = new THREE.Quaternion().setFromUnitVectors(needleAxis, targetVector);
            needleGroup.quaternion.slerp(finalRotation, 0.15);
        }

        function updateCelestialMarkers() {
            if (!markerGroup) return;

            const targets = [
                { name: "Sagittarius A*", ...galacticCenterAzAlt },
                { name: "Sun", ...sunAzAlt },
                ...planetAzAlts,
                ...brightStarAzAlts
            ];

            for (const marker of celestialMarkers.values()) {
                marker.group.visible = false;
            }

            if (!locationReady) return;

            for (const target of targets) {
                const marker = celestialMarkers.get(target.name);
                if (!marker) continue;

                const vector = skyVectorForCurrentMode(target.azimuth, target.altitude);
                marker.group.position.copy(vector.multiplyScalar(MARKER_DISTANCE));
                marker.group.visible = true;
            }
        }

        function updateMarkerBillboards() {
            if (!markerGroup) return;

            for (const marker of celestialMarkers.values()) {
                if (!marker.group.visible) continue;
                marker.halo.quaternion.copy(camera.quaternion);
            }
        }

        function skyVectorForCurrentMode(azimuth, altitude) {
            const vector = azAltToVector(azimuth, altitude);
            if (hasDeviceOrientationData || overridesEnabled) {
                vector.applyQuaternion(deviceToWorldQuaternion.clone().conjugate());
            }
            return vector;
        }

        function animate() {
            requestAnimationFrame(animate);
            animationClock.getDelta();

            const now = performance.now();
            if (locationReady && !overridesEnabled && now - lastCalcTime > 5000) {
                calculateCelestialPositions();
                lastCalcTime = now;
            }

            updateNeedleRotation();
            updateCelestialMarkers();
            updateMarkerBillboards();
            twinkleStars();
            renderer.render(scene, camera);
        }

        function twinkleStars() {
            if (!starPoints) return;

            const colorAttribute = starPoints.geometry.attributes.color;
            const count = Math.max(1, Math.floor(STAR_COUNT * 0.005));

            for (let i = 0; i < count; i += 1) {
                const index = Math.floor(Math.random() * STAR_COUNT);
                const brightness = Math.random() * 0.6 + 0.4;
                colorAttribute.setXYZ(index, brightness, brightness, brightness);
            }

            colorAttribute.needsUpdate = true;
        }

        function deviceOrientationEventToQuaternion(alphaDeg, betaDeg, gammaDeg) {
            const euler = new THREE.Euler(
                betaDeg * DEG_TO_RAD,
                alphaDeg * DEG_TO_RAD,
                -gammaDeg * DEG_TO_RAD,
                "YXZ"
            );
            const quaternion = new THREE.Quaternion().setFromEuler(euler);
            const deviceCameraAdjustment = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(1, 0, 0),
                -Math.PI / 2
            );
            const screenAngle = getScreenOrientationAngle();
            const screenAdjustment = new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 0, 1),
                -screenAngle * DEG_TO_RAD
            );

            return quaternion.multiply(deviceCameraAdjustment).multiply(screenAdjustment);
        }

        function manualYawPitchRollToQuaternion(yawDeg, pitchDeg, rollDeg) {
            const euler = new THREE.Euler(
                pitchDeg * DEG_TO_RAD,
                yawDeg * DEG_TO_RAD,
                rollDeg * DEG_TO_RAD,
                "YXZ"
            );
            return new THREE.Quaternion().setFromEuler(euler);
        }

        function getScreenOrientationAngle() {
            if (screen.orientation && Number.isFinite(screen.orientation.angle)) {
                return screen.orientation.angle;
            }
            return Number.isFinite(window.orientation) ? window.orientation : 0;
        }

        function applyManualAlignmentOffset() {
            if (isAlignmentActive) {
                deviceToWorldQuaternion.premultiply(manualAlignmentOffset);
            }
        }

        function azAltToVector(azimuthDeg, altitudeDeg) {
            const azimuth = azimuthDeg * DEG_TO_RAD;
            const altitude = altitudeDeg * DEG_TO_RAD;
            return new THREE.Vector3(
                Math.cos(altitude) * Math.sin(azimuth),
                Math.sin(altitude),
                Math.cos(altitude) * Math.cos(azimuth)
            ).normalize();
        }

        function deviceTopAxis() {
            return new THREE.Vector3(0, 1, 0);
        }

        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        function handleViewPointerDown(event) {
            isDraggingView = true;
            lastPointer = { x: event.clientX, y: event.clientY };
            renderer.domElement.setPointerCapture(event.pointerId);
        }

        function handleViewPointerMove(event) {
            if (!isDraggingView) return;

            const dx = event.clientX - lastPointer.x;
            const dy = event.clientY - lastPointer.y;
            lastPointer = { x: event.clientX, y: event.clientY };
            viewYaw -= dx * 0.006;
            viewPitch = clamp(viewPitch + dy * 0.006, -1.25, 1.25);
            updateCameraView();
        }

        function handleViewPointerUp(event) {
            isDraggingView = false;
            if (renderer.domElement.hasPointerCapture(event.pointerId)) {
                renderer.domElement.releasePointerCapture(event.pointerId);
            }
        }

        function handleViewWheel(event) {
            event.preventDefault();
            viewDistance = clamp(viewDistance + event.deltaY * 0.002, 2.4, 9);
            updateCameraView();
        }

        function resetView() {
            viewDistance = DEFAULT_VIEW_DISTANCE;

            if (hasDeviceOrientationData || overridesEnabled) {
                const forward = new THREE.Vector3(0, 0, 1).applyQuaternion(deviceToWorldQuaternion);
                const horizontalLength = Math.hypot(forward.x, forward.z);
                viewYaw = Math.atan2(forward.x, forward.z);
                viewPitch = clamp(Math.atan2(forward.y, horizontalLength), -1.25, 1.25);
                showStatus("View reset to current device orientation.", true);
            } else {
                viewYaw = DEFAULT_VIEW_YAW;
                viewPitch = DEFAULT_VIEW_PITCH;
                showStatus("View reset to the default orientation.", true);
            }

            updateCameraView();
        }

        function updateCameraView() {
            const cosPitch = Math.cos(viewPitch);
            camera.position.set(
                viewDistance * Math.sin(viewYaw) * cosPitch,
                viewDistance * Math.sin(viewPitch),
                viewDistance * Math.cos(viewYaw) * cosPitch
            );
            camera.lookAt(0, 0, 0);
        }

        function updateModeDisplay(specificMode = null) {
            let mode = "PC (No Sensors)";
            if (overridesEnabled) {
                mode = "Manual Override";
            } else if (specificMode) {
                mode = specificMode;
            } else if (hasDeviceOrientationData) {
                mode = orientationSensor ? "Mobile (AOS)" : "Mobile (DOE)";
            }
            dom.mode.textContent = mode;
        }

        function toggleDebugPanels() {
            const hidden = document.body.classList.toggle("debug-hidden");
            dom.toggleDebug.textContent = hidden ? "Show Debug" : "Hide Debug";
        }

        function showStatus(message, temporary = false) {
            dom.status.textContent = message;
            dom.status.style.display = "block";
            clearTimeout(statusTimeout);

            if (temporary) {
                statusTimeout = setTimeout(clearStatus, 4000);
            }
        }

        function clearStatus() {
            clearTimeout(statusTimeout);
            statusTimeout = null;
            dom.status.style.display = "none";
        }

        function formatLocation(location) {
            return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
        }

        function isValidLatitude(value) {
            return Number.isFinite(value) && value >= -90 && value <= 90;
        }

        function isValidLongitude(value) {
            return Number.isFinite(value) && value >= -180 && value <= 180;
        }

        function normalizeDegrees(value) {
            return ((value % 360) + 360) % 360;
        }

        function normalizeSignedDegrees(value) {
            return ((value + 180) % 360 + 360) % 360 - 180;
        }

        function clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        startApp();

