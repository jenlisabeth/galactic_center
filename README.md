# Galactic Center Compass

Galactic Center Compass is a small, dependency-light web app that points toward the center of the Milky Way from your current location. It renders a starfield and a green 3D pointer in the browser, then uses geolocation, time, and device orientation data to estimate where the Galactic Center is relative to the device.

The app is static and dependency-light: `index.html` loads `src/styles.css` and `src/app.js` directly.

## What it does

- Calculates the current altitude and azimuth of the Galactic Center.
- Calculates the current altitude and azimuth of the Sun.
- Renders a Three.js starfield with a 3D pointer aimed at the Galactic Center.
- Lets you drag or touch-drag to orbit the view around the scene while the pointer remains aimed correctly.
- Displays markers for Sagittarius A*, the Sun, visible planets, and a small set of bright reference stars.
- Uses browser geolocation when available.
- Uses the Generic Sensor API `AbsoluteOrientationSensor` when available and permitted.
- Falls back to `DeviceOrientationEvent` on browsers that support it.
- Provides manual latitude, longitude, and orientation overrides for desktop testing.
- Provides manual alignment controls for North and Sun-based calibration.
- Provides a debug overlay toggle for raw sky/orientation values.

## Repository structure

```text
.
|-- index.html   # Static app shell
|-- LICENSE      # Project license
|-- package.json # Lightweight test command
|-- README.md    # Project documentation
|-- src
|   |-- app.js
|   `-- styles.css
`-- tests
    `-- astronomy.test.js
```

There is no build step, package manager, bundler, or server-side component required to use the app. Node/npm are only for optional local development checks.

## How to run it

Because this is a static app, any simple local web server works. From the project folder:

```sh
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

The public app is published through GitHub Pages at:

```text
https://jenlisabeth.github.io/galactic_center/
```

GitHub Pages serves the static files directly from the repository after changes are committed and pushed.

## Browser requirements

The app needs a modern browser with WebGL support. For full mobile compass behavior, it also needs:

- Geolocation access.
- Motion/orientation sensor access.
- HTTPS or `localhost`, because many browsers block geolocation and motion sensors on insecure origins.

The app loads Three.js from a CDN:

```html
https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
```

If you need offline use, download that file and update the script tag in `index.html` to point to a local copy.

## Using the app

1. Open the page on a phone or desktop browser.
2. Allow location access when prompted.
3. On iOS or other permission-gated browsers, tap "Grant Sensor Access" if the prompt appears.
4. Hold the phone flat with the screen facing up, and keep the same portrait/landscape orientation while using it.
5. Calibrate with `Top Edge to North`, `Top Edge to Sun`, or `Use Current Hold`.
6. Watch the target panel for Galactic Center and Sun azimuth/altitude.
7. Use the green pointer as the estimated direction to the Galactic Center.
8. Drag the scene to look around. Use the mouse wheel to zoom on desktop.

On desktop, most browsers do not provide real orientation sensor data. The pointer will still render and the calculated sky positions will still update, but device-relative pointing will be limited unless you use manual overrides.

## Scene controls

The camera can orbit independently from the pointing calculation:

- Drag or touch-drag to rotate the view around the pointer.
- Use the mouse wheel to zoom in or out.
- Use `Reset View` to return to the current device-facing view when sensors or manual overrides are active, or to the default view when no orientation source is available.
- Use `Hide Debug` / `Show Debug` to toggle the debug panels.
- Drag panel headers to move overlay windows out of the way.
- Use each panel's `+` / `-` control to collapse or expand it.
- The green pointer continues to aim toward Sagittarius A*.
- The sky markers are transformed through the same device-orientation logic as the pointer, so they stay consistent with the current sensor or manual override mode.

## Sky markers

The app displays:

- `Sagittarius A*`: the Galactic Center target.
- `Sun`: calculated from a compact solar position approximation.
- `Mercury`, `Venus`, `Mars`, `Jupiter`, `Saturn`, `Uranus`, and `Neptune`: calculated from low-precision orbital elements.
- A small bright-star reference layer: Sirius, Canopus, Arcturus, Vega, Capella, Rigel, Procyon, Betelgeuse, Altair, Aldebaran, Antares, Spica, Pollux, Fomalhaut, and Deneb.

The background starfield is still procedural for visual depth. The named bright-star markers are real sky anchors, but this is not yet a full catalog-rendered star map.

## Manual overrides

Enable "Overrides" to enter test values manually:

- `Lat`: observer latitude in degrees, from `-90` to `90`.
- `Lon`: observer longitude in degrees, from `-180` to `180`.
- `Yaw Z`: manual yaw angle in degrees.
- `Pitch X`: manual pitch angle in degrees.
- `Roll Y`: manual roll angle in degrees.

This is useful for desktop debugging, reproducible screenshots, or testing without granting browser permissions.

## Orientation model

The app uses orientation only, not full 6DoF pose.

A true 6DoF device pose has six independent channels:

- Translation: X, Y, and Z position.
- Rotation: yaw, pitch, and roll.

Ordinary browser motion APIs do not provide reliable world position. This app therefore uses 3DoF attitude data:

- `AbsoluteOrientationSensor` provides a quaternion when the browser exposes the Generic Sensor API.
- `DeviceOrientationEvent` provides Euler angles named `alpha`, `beta`, and `gamma`; these are treated as a browser fallback format and converted into a quaternion before the app uses them.
- Manual overrides use yaw, pitch, and roll fields to create a quaternion for desktop testing.

The pointer and sky markers use that quaternion to transform world-space sky vectors into the current device-relative frame. Manual North/Sun alignment applies an additional correction quaternion on top.

## Manual alignment

Mobile orientation sensors can drift or disagree across browsers. The calibration controls apply a correction offset.

- Hold the phone flat, screen up.
- Keep the same portrait/landscape orientation after calibrating.
- `Top Edge to North`: use this when the top edge of the phone is physically aimed north.
- `Top Edge to Sun`: use this when the top edge of the phone is physically aimed at the Sun.
- `Use Current Hold`: treats the current phone orientation as the neutral/default frame.
- `Reset Align`: clears the correction offset.

Sun alignment is only available when location is known and the Sun is above or near the horizon.

The top-edge alignment buttons use the device's top edge axis, not the camera/forward axis. That means "Top Edge to North" means exactly what it says: point the top of the phone toward north, then tap the button. If the browser changes between portrait and landscape, recalibrate.

## Coordinate model

The app uses:

- Right ascension and declination for the Galactic Center.
- A compact solar position approximation for the Sun.
- Julian date and local sidereal time to convert celestial coordinates to local altitude and azimuth.
- Three.js quaternions to rotate the pointer into the current device frame.
- Low-precision heliocentric orbital elements for planet markers.

The Galactic Center reference coordinates are hardcoded in `index.html`:

```js
const GC_RA_DEG = (17 + 45 / 60 + 40.04 / 3600) * 15;
const GC_DEC_DEG = -(29 + 0 / 60 + 28.1 / 3600);
```

## Accuracy notes

This app is intended as an exploratory compass, not as a scientific instrument.

Accuracy depends on:

- Browser sensor implementation.
- Device magnetometer calibration.
- Local magnetic interference.
- Whether the browser exposes absolute or relative orientation.
- The fact that the browser provides attitude, not full 6DoF position.
- Location accuracy.
- Correct screen orientation handling.
- The simplified Sun position calculation.
- The simplified planet calculations.
- The partial star-map layer.

For best results:

- Use the app outdoors.
- Keep the device away from magnetic cases, cars, and electronics.
- Calibrate your phone compass if your operating system asks.
- Use manual North or Sun alignment before relying on the pointer.

## Recent fixes

The current version includes several maintenance fixes:

- Replaced corrupted degree symbols with proper HTML entities.
- Fixed local sidereal time calculation so UTC time is not counted twice.
- Connected the iOS-style `DeviceOrientationEvent.requestPermission()` flow.
- Added validation for manual latitude and longitude overrides.
- Added drag/touch orbit view controls.
- Added Sun, planet, Sagittarius A*, and bright-star markers.
- Split JavaScript and CSS into `src/app.js` and `src/styles.css`.
- Added lightweight astronomy tests.
- Reworked orientation naming around quaternions and 3DoF attitude instead of loose alpha/beta/gamma axis language.
- Added draggable/collapsible overlay panels for small screens.
- Fixed top-edge alignment to calibrate the phone's top axis instead of the forward/camera axis.
- Added a clear error state when Three.js fails to load.
- Reworked the script into named functions for easier maintenance.
- Improved small-screen overlay behavior.

## Development notes

The app is deliberately kept static so it can be served anywhere. Good next steps are:

- Add a local copy of Three.js for offline use.
- Replace the procedural starfield with a compact star catalog such as Hipparcos/Bright Star Catalog data.

## Tests

The app itself does not require Node or npm. For development, run the current astronomy checks with:

```sh
node tests/astronomy.test.js
```

If npm is available, `npm test` runs the same command. These checks are for development only and are not part of the GitHub Pages runtime.

## License

See `LICENSE`.
