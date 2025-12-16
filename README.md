# 🌌 Dynamic Sky

> A beautiful vanilla JavaScript library for rendering dynamic sky backgrounds with realistic atmospheric scattering, animated starfields, and seamless time control.

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/vanilla-JS-yellow.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)

Transform your web projects with stunning, physically-accurate sky renders that respond to time and location. Watch the sky transition from brilliant blue day to star-filled night, complete with atmospheric scattering and animated celestial bodies.

---

## ✨ Features

- 🌅 **Realistic Atmospheric Scattering** - Physically-based sky rendering using single-scattering approximation
- ⭐ **Animated Starfield** - Multi-layer parallax starfield with breathing animation that appears at night
- 🌌 **Star Rotation** - Stars rotate throughout the day/night cycle based on time (360° rotation over 24 hours)
- 🌆 **Dynamic Twilight** - Stars fade in gradually during twilight and fade out at dawn
- 🕐 **Custom Slider Support** - Connect any slider (linear, circular, or custom) to control time
- 📍 **Auto Location Detection** - Automatically detects user location via IP geolocation
- 🌍 **Manual Location** - Set custom latitude/longitude coordinates
- 📱 **Mobile Responsive** - Optimized for mobile devices
- 🎨 **Zero Configuration** - Works out of the box with sensible defaults
- ⚡ **Lightweight** - Minimal overhead, maximum visual impact

---

## 📦 Installation

### Via jsDelivr CDN (Recommended)

Simply include the DynamicSky library:

```html
<script src="https://cdn.jsdelivr.net/gh/aakaashjois/dynamic-sky@main/dynamic-sky.js"></script>
```

> 💡 **Note:** The CSS styles are automatically injected into the page when the library loads, so you don't need to include a separate CSS file.

### Manual Download

1. Download `dynamic-sky.js` from the repository
2. Include it in your HTML:

```html
<script src="path/to/dynamic-sky.js"></script>
```

The CSS is bundled into the JavaScript file and will be automatically injected when the library loads.

> **Dependencies:** This library uses [SunCalc](https://github.com/mourner/suncalc) for sun position calculations.

---

## 🚀 Quick Start

Get up and running in minutes! Dynamic Sky is designed to be simple and intuitive.

### Basic Usage

#### Option 1: Pre-defined containers in HTML

```html
<!DOCTYPE html>
<html>
<head>
  <!-- No CSS file needed - styles are injected automatically -->
</head>
<body>
  <!-- Required containers -->
  <div id="background-sky"></div>
  <div id="stars-container"></div>

  <!-- Your content here -->
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

#### Option 2: Programmatically created containers

DynamicSky can automatically create the containers if they don't exist:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- No CSS file needed - styles are injected automatically -->
</head>
<body>
  <!-- Your content here - no containers needed! -->
  <div id="page-container">
    <h1>Hello World</h1>
  </div>

  <script src="dynamic-sky.js"></script>
  <script>
    // Containers will be created automatically
    const sky = new DynamicSky({
      skyContainer: '#background-sky',
      starsContainer: '#stars-container'
    });
    sky.init(); // Creates containers if they don't exist
  </script>
</body>
</html>
```

### With Custom Options

```javascript
const sky = new DynamicSky({
  skyContainer: '#background-sky',
  starsContainer: '#stars-container',
  latitude: 37.7749,  // San Francisco
  longitude: -122.4194,
  starLayers: 3,
  starDensity: 5,
  onUpdate: function(data) {
    console.log('Sky updated:', data);
  }
});

sky.init();
```

### Connecting a Custom Slider

DynamicSky doesn't provide sliders - you create your own! Here's how to connect any slider:

```html
<!-- Your custom slider (linear, circular, or any type) -->
<input type="range" id="my-slider" min="0" max="1440">

<script>
const sky = new DynamicSky();
sky.init();

const slider = document.getElementById('my-slider');

slider.addEventListener('input', function() {
  // Convert slider value (minutes) to a date and update sky
  const minutes = parseInt(slider.value);
  const date = sky.minutesToDate(minutes);
  sky.updateSky(date);
});

// Initialize with current time
slider.value = sky.dateToMinutes();
sky.updateSky(sky.minutesToDate(sky.dateToMinutes()));
</script>
```

See `example.html` for complete examples of linear and circular sliders.

---

## ⚙️ Configuration Options

Customize Dynamic Sky to fit your needs with these configuration options:

| Option | Type | Default | Description |
|:------|:----:|:-------:|:------------|
| `skyContainer` | `string` | `'#background-sky'` | CSS selector for sky background container |
| `starsContainer` | `string` | `'#stars-container'` | CSS selector for stars container |
| `latitude` | `number` | `null` | Latitude coordinate (auto-detected if not provided) |
| `longitude` | `number` | `null` | Longitude coordinate (auto-detected if not provided) |
| `autoDetectLocation` | `boolean` | `true` | Automatically detect location via IP |
| `starLayers` | `number` | `3` | Number of starfield layers |
| `starDensity` | `number` | `5` | Star density multiplier |
| `locationApiUrl` | `string` | `'https://ipwho.is/'` | URL for IP geolocation API |
| `onUpdate` | `function` | `null` | Callback fired when sky updates |
| `onLocationDetected` | `function` | `null` | Callback fired when location is detected |

---

## 📚 API Reference

### Methods

#### `init()`

Initialize the DynamicSky instance. Must be called after creating an instance.

```javascript
const sky = new DynamicSky();
sky.init();
```

#### `updateSky(date)`

Update the sky background for a specific date/time. This is the main method that sliders should call.

```javascript
// Update to current time
sky.updateSky();

// Update to a specific date/time
const futureDate = new Date('2024-12-25T12:00:00');
sky.updateSky(futureDate);
```

#### `setLocation(latitude, longitude)`

Manually set the location coordinates.

```javascript
sky.setLocation(40.7128, -74.0060);  // New York
```

### Slider Helper Methods

These methods help you convert between different slider value formats and dates:

#### `minutesToDate(minutes)`

Convert minutes of day (0-1440) to a Date object for today.

```javascript
const date = sky.minutesToDate(720);  // 12:00 PM
sky.updateSky(date);
```

#### `percentToDate(percent)`

Convert a percentage (0-1) to a Date object for today.

```javascript
const date = sky.percentToDate(0.5);  // 12:00 PM (50% through the day)
sky.updateSky(date);
```

#### `hoursToDate(hours)`

Convert hours (0-24) to a Date object for today.

```javascript
const date = sky.hoursToDate(14.5);  // 2:30 PM
sky.updateSky(date);
```

#### `dateToMinutes(date)`

Convert a Date object to minutes of day (0-1440).

```javascript
const now = new Date();
const minutes = sky.dateToMinutes(now);  // Current time in minutes
```

#### `dateToPercent(date)`

Convert a Date object to percentage of day (0-1).

```javascript
const now = new Date();
const percent = sky.dateToPercent(now);  // Current time as percentage
```

#### `destroy()`

Clean up and destroy the instance.

```javascript
sky.destroy();
```

---

## 🎛️ Connecting Custom Sliders

DynamicSky is designed to work with **any** slider implementation. Here are examples:

### Linear Slider

```javascript
const slider = document.getElementById('linear-slider');
slider.addEventListener('input', function() {
  const minutes = parseInt(slider.value);
  sky.updateSky(sky.minutesToDate(minutes));
});
```

### Circular Slider

```javascript
// In your circular slider's drag handler:
function onDrag(values) {
  const minutes = values.totalMinutes;  // Your slider's value
  sky.updateSky(sky.minutesToDate(minutes));
}
```

### Percentage-Based Slider

```javascript
const slider = document.getElementById('percent-slider');
slider.addEventListener('input', function() {
  const percent = parseFloat(slider.value) / 100;  // 0-1
  sky.updateSky(sky.percentToDate(percent));
});
```

### Any Custom Slider

As long as you can convert your slider's value to a Date object, you can connect it:

```javascript
// Your slider's value handler
function onSliderChange(value) {
  // Convert your slider's value format to a Date however you need
  const date = convertYourValueToDate(value);
  sky.updateSky(date);
}
```

---

## 📡 Events

The library dispatches a custom event when initialized:

```javascript
document.addEventListener('dynamic-sky-initialized', function(event) {
  console.log('Location:', event.detail.latitude, event.detail.longitude);
});
```

---

## ⭐ Starfield Features

The starfield is an integral part of DynamicSky and includes:

- **Multi-layer Parallax** - Stars are rendered in multiple layers with different depths for a 3D effect
- **Breathing Animation** - Stars have a subtle breathing/pulsing animation effect
- **Dynamic Visibility** - Stars automatically fade in during twilight (when sun is below horizon) and fade out at dawn
- **Time-based Rotation** - Stars rotate 360° over 24 hours, matching the Earth's rotation. The rotation updates whenever `updateSky()` is called with a new time
- **Mobile Optimized** - Reduced star density on mobile devices for better performance

### How Stars Work

Stars are created automatically when `updateSky()` is first called. They:
1. Appear gradually as the sun sets (fade in during twilight)
2. Are fully visible at night (when sun altitude < -6°)
3. Rotate based on the time of day (0° at midnight, 180° at noon, 360° at next midnight)
4. Fade out gradually as the sun rises

To see stars, set your slider to nighttime hours (typically 6 PM - 6 AM depending on location and season).

---

## 🎨 CSS Classes

The library uses the following CSS classes for the starfield (you can style these):

- `.dynamic-sky-layer` - Starfield layer containers
- `.dynamic-sky-star` - Individual star elements

Note: Slider styling is entirely up to you - DynamicSky doesn't provide any slider styles.

---

## 🌐 Browser Support

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

> ⚠️ Requires ES5+ support (no IE11).

---

## 📄 License

This project is licensed under the **MIT License** - see the LICENSE file for details.

---

## 🙏 Credits

This library was inspired by and builds upon the following amazing projects:

- **[Horizon](https://github.com/dnlzro/horizon)** by [dnlzro](https://github.com/dnlzro) - The original inspiration for this library. Horizon renders the current sky at your location as a CSS gradient, showcasing beautiful atmospheric rendering techniques.
- **[SunCalc](https://github.com/mourner/suncalc)** by [mourner](https://github.com/mourner) - SunCalc calculations for accurate sun position and astronomical data.

---

<div align="center">

**Made with 🌌 by [aakaashjois](https://github.com/aakaashjois)**

⭐ Star this repo if you find it useful!

</div>

