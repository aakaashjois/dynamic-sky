# Dynamic Sky

> Vanilla JavaScript sky backgrounds with atmospheric scattering and a night starfield, driven by time and location.

[![Apache 2.0 License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/vanilla-JS-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![jsDelivr](https://data.jsdelivr.com/v1/package/npm/dynamic-sky/badge?style=rounded)](https://www.jsdelivr.com/package/npm/dynamic-sky)

Embed a living day-to-night sky: blue midday, warm twilight, and stars after dark — all from a `Date` and coordinates.

---

## Features

- **Atmospheric scattering** — Physically based single-scattering sky gradient
- **Night starfield** — Multi-layer stars with twilight fade and day-cycle rotation
- **Time-driven** — Call `updateSky(date)` whenever your UI changes time
- **Location** — Auto-detect via IP, or set latitude / longitude yourself
- **One script** — CSS injected automatically; SunCalc loaded from jsDelivr if missing

---

## Installation

### jsDelivr (recommended)

```html
<script src="https://cdn.jsdelivr.net/gh/aakaashjois/dynamic-sky@main/dynamic-sky.js"></script>
```

Also on npm via jsDelivr: `https://cdn.jsdelivr.net/npm/dynamic-sky@2/dynamic-sky.js`

> Star/layer CSS is injected when the library loads. If [SunCalc](https://github.com/mourner/suncalc) is not already on the page, `init()` loads `suncalc@2.0.1` from jsDelivr.

### Manual download

```html
<script src="path/to/dynamic-sky.js"></script>
```

Optional explicit SunCalc: `<script src="https://cdn.jsdelivr.net/npm/suncalc@2.0.1"></script>`

---

## Quick start

```html
<!DOCTYPE html>
<html>
<body>
  <div id="background-sky"></div>
  <div id="stars-container"></div>

  <div id="page-container">
    <h1>Hello World</h1>
  </div>

  <script src="dynamic-sky.js"></script>
  <script>
    const sky = new DynamicSky();
    sky.init();
  </script>
</body>
</html>
```

If the sky/star containers are missing, `init()` creates them. You can also pass selectors and location up front:

```javascript
const sky = new DynamicSky({
  skyContainer: '#background-sky',
  starsContainer: '#stars-container',
  latitude: 37.7749,
  longitude: -122.4194,
  starLayers: 3,
  starDensity: 5
});

sky.init();
```

### Driving time from your UI

Wire any control to a `Date` and call `updateSky`:

```html
<input type="range" id="time" min="0" max="1440" value="0">

<script>
const sky = new DynamicSky();
sky.init().then(() => {
  const time = document.getElementById('time');
  const paint = () => sky.updateSky(sky.minutesToDate(parseInt(time.value, 10)));
  time.addEventListener('input', paint);
  time.value = sky.dateToMinutes();
  paint();
});
</script>
```

---

## Configuration

| Option | Type | Default | Description |
|:------|:----:|:-------:|:------------|
| `skyContainer` | `string` | `'#background-sky'` | CSS selector for sky background |
| `starsContainer` | `string` | `'#stars-container'` | CSS selector for stars |
| `latitude` | `number` | `null` | Latitude (auto-detected if omitted) |
| `longitude` | `number` | `null` | Longitude (auto-detected if omitted) |
| `autoDetectLocation` | `boolean` | `true` | Detect location via IP when coords are missing |
| `starLayers` | `number` | `3` | Starfield layers (0–5) |
| `starDensity` | `number` | `5` | Star density multiplier (0–20) |

---

## API

### `init()`

Initialize the instance (loads SunCalc if needed, resolves location, paints the sky).

```javascript
const sky = new DynamicSky();
sky.init();
```

### `updateSky(date)`

Paint the sky for a date/time. Omit `date` to use now.

```javascript
sky.updateSky();
sky.updateSky(new Date('2024-12-25T12:00:00'));
```

### `setLocation(latitude, longitude)`

Set coordinates. Call `updateSky(...)` afterward to repaint.

```javascript
sky.setLocation(40.7128, -74.0060);
sky.updateSky();
```

### Time helpers

Optional converters when your UI works in minutes of day (0–1440):

```javascript
sky.updateSky(sky.minutesToDate(720));  // noon
const minutes = sky.dateToMinutes();     // now → minutes
```

For percent or hours: `sky.minutesToDate(Math.round(percent * 1440))` or `sky.minutesToDate(Math.round(hours * 60))`.

---

## Starfield

Stars appear during twilight and night (sun below the horizon), rotate with the day cycle when you call `updateSky()`, and use a light CSS depth pulse on each layer. They are atmospheric craft, not an astronomical catalog. Density is reduced slightly on smaller viewports.

CSS hooks you can style: `.dynamic-sky-layer`, `.dynamic-sky-star`.

---

## Browser support

Modern Chromium, Firefox, Safari, and Edge. No IE11.

---

## License

Copyright 2025 Aakaash Jois

Licensed under the **Apache License 2.0** — see [LICENSE](LICENSE).

---

## Credits

- **[Horizon](https://github.com/dnlzro/horizon)** by [dnlzro](https://github.com/dnlzro) — original inspiration for location-based CSS sky gradients
- **[SunCalc](https://github.com/mourner/suncalc)** by [mourner](https://github.com/mourner) — sun position

---

<div align="center">

**Made with care by [aakaashjois](https://github.com/aakaashjois)**

</div>
