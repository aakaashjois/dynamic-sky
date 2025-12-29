/**
 * DynamicSky - Dynamic sky background renderer with circular time slider control
 * 
 * A vanilla JavaScript library for rendering realistic sky backgrounds with
 * atmospheric scattering, animated starfields, and an optional circular time slider.
 * 
 * Usage:
 *   <script src="dynamic-sky.js"></script>
 *   <script>
 *     const sky = new DynamicSky({
 *       skyContainer: '#background-sky',
 *       starsContainer: '#stars-container'
 *     });
 *     sky.init();
 *   </script>
 * 
 * @version 1.0.0
 * @license MIT
 */

(function (global) {
  'use strict';

  // ============================================================================
  // Constants & Helpers for Physics
  // ============================================================================

  var PI = Math.PI;
  var RAYLEIGH_SCATTER = [5.802e-6, 13.558e-6, 33.1e-6];
  var MIE_SCATTER = 3.996e-6;
  var MIE_ABSORB = 4.44e-6;
  var OZONE_ABSORB = [0.65e-6, 1.881e-6, 0.085e-6];
  var RAYLEIGH_SCALE_HEIGHT = 8e3;
  var MIE_SCALE_HEIGHT = 1.2e3;
  var GROUND_RADIUS = 6360000;
  var TOP_RADIUS = 6460000;
  var SUN_INTENSITY = 1.0;
  var GRADIENT_SAMPLES = 32;
  var INTEGRATION_SAMPLES = 8;
  var FOV_DEG = 75;
  var EXPOSURE = 25.0;
  var GAMMA = 2.2;
  var SUNSET_BIAS_STRENGTH = 0.1;

  // Optimization: Precompute inverses to use multiplication instead of division
  var INV_RAYLEIGH_SCALE_HEIGHT = 1.0 / RAYLEIGH_SCALE_HEIGHT;
  var INV_MIE_SCALE_HEIGHT = 1.0 / MIE_SCALE_HEIGHT;
  var INV_OZONE_WIDTH = 1.0 / 15e3;

  function rayleighPhase(cosAngle) {
    return (3 * (1 + cosAngle * cosAngle)) / (16 * PI);
  }

  // Optimization: Precompute Mie phase constants
  var MIE_G = 0.8;
  var MIE_G2 = MIE_G * MIE_G;
  var MIE_SCALE = 3 / (8 * PI);
  var MIE_NUM_FACTOR = (1 - MIE_G2);
  var MIE_DENOM_FACTOR = (2 + MIE_G2);
  var MIE_TERM_FACTOR = (1 + MIE_G2);
  var MIE_2G = 2 * MIE_G;

  function miePhase(cosAngle) {
    var num = MIE_NUM_FACTOR * (1 + cosAngle * cosAngle);
    var val = MIE_TERM_FACTOR - MIE_2G * cosAngle;
    // Optimization: Use x * sqrt(x) instead of pow(x, 1.5)
    var denom = MIE_DENOM_FACTOR * val * Math.sqrt(val);
    return (MIE_SCALE * num) / denom;
  }

  // Pre-allocate arrays to reduce garbage collection in hot loops
  // Optimization: Accept cosAngle to avoid costly acos/sin/cos roundtrip
  function computeTransmittance(height, cosAngle, out) {
    var rayOriginX = 0;
    var rayOriginY = GROUND_RADIUS + height;
    var rayOriginZ = 0;

    // We assume the angle came from acos(abs(cos)), so it's in [0, PI/2].
    // Thus sin(angle) is always positive.
    var rayDirectionY = cosAngle;
    var rayDirectionX = Math.sqrt(1.0 - cosAngle * cosAngle);
    var rayDirectionZ = 0;

    var b = rayOriginX * rayDirectionX + rayOriginY * rayDirectionY + rayOriginZ * rayDirectionZ;
    var c = (rayOriginX * rayOriginX + rayOriginY * rayOriginY + rayOriginZ * rayOriginZ) - (TOP_RADIUS * TOP_RADIUS);
    var discr = b * b - c;

    var distance;
    if (discr < 0) distance = null;
    else {
      var sqrtDiscr = Math.sqrt(discr);
      var t = -b - sqrtDiscr;
      if (t < 0) distance = -b + sqrtDiscr;
      else distance = t;
    }

    if (distance === null) {
      if (out) {
        out[0] = 1; out[1] = 1; out[2] = 1;
        return out;
      }
      return [1, 1, 1];
    }

    var segmentLength = distance / INTEGRATION_SAMPLES;
    var tCurrent = 0.5 * segmentLength;

    var odRayleigh = 0;
    var odMie = 0;
    var odOzone = 0;

    for (var i = 0; i < INTEGRATION_SAMPLES; i++) {
      // pos = rayOrigin + rayDirection * tCurrent
      var posX = rayOriginX + rayDirectionX * tCurrent;
      var posY = rayOriginY + rayDirectionY * tCurrent;
      // Simplified calculation: posZ term omitted since rayOriginZ and rayDirectionZ are both 0

      // Manual sqrt is faster than Math.hypot
      var lenPos = Math.sqrt(posX * posX + posY * posY);
      var h = lenPos - GROUND_RADIUS;

      var dR = Math.exp(-h * INV_RAYLEIGH_SCALE_HEIGHT);
      var dM = Math.exp(-h * INV_MIE_SCALE_HEIGHT);
      odRayleigh += dR * segmentLength;

      var ozoneDensity = 1.0 - Math.min(Math.abs(h - 25e3) * INV_OZONE_WIDTH, 1.0);
      odOzone += ozoneDensity * segmentLength;
      odMie += dM * segmentLength;

      tCurrent += segmentLength;
    }

    var tauR0 = RAYLEIGH_SCATTER[0] * odRayleigh;
    var tauR1 = RAYLEIGH_SCATTER[1] * odRayleigh;
    var tauR2 = RAYLEIGH_SCATTER[2] * odRayleigh;

    var tauM = MIE_ABSORB * odMie; // All components same

    var tauO0 = OZONE_ABSORB[0] * odOzone;
    var tauO1 = OZONE_ABSORB[1] * odOzone;
    var tauO2 = OZONE_ABSORB[2] * odOzone;

    // Return exp(-(tauR + tauM + tauO))
    if (out) {
      out[0] = Math.exp(-(tauR0 + tauM + tauO0));
      out[1] = Math.exp(-(tauR1 + tauM + tauO1));
      out[2] = Math.exp(-(tauR2 + tauM + tauO2));
      return out;
    }
    return [
      Math.exp(-(tauR0 + tauM + tauO0)),
      Math.exp(-(tauR1 + tauM + tauO1)),
      Math.exp(-(tauR2 + tauM + tauO2))
    ];
  }

  // ============================================================================
  // Inject CSS Styles
  // ============================================================================
  
  (function() {
    // Only inject CSS once
    if (document.getElementById('dynamic-sky-styles')) return;
    
    var css = [
      '/* Sky Background Container */',
      '#background-sky {',
      '  position: fixed;',
      '  top: 0;',
      '  left: 0;',
      '  width: 100vw;',
      '  height: 100vh;',
      '  height: 100dvh;',
      '  z-index: -2;',
      '  pointer-events: none;',
      '  transition: opacity 0.5s ease-in-out;',
      '  background-color: #121212;',
      '  margin: 0;',
      '  padding: 0;',
      '}',
      '',
      '/* Stars Container */',
      '#stars-container {',
      '  position: fixed;',
      '  top: 0;',
      '  left: 0;',
      '  width: 100%;',
      '  height: 100vh;',
      '  height: 100dvh;',
      '  overflow: hidden;',
      '  perspective: 100px;',
      '  perspective-origin: 50% 50%;',
      '  z-index: -1;',
      '  pointer-events: none;',
      '  transition: opacity 0.5s ease-in-out;',
      '}',
      '',
      '.dynamic-sky-layer {',
      '  position: absolute;',
      '  top: 0;',
      '  left: 0;',
      '  width: 100%;',
      '  height: 100%;',
      '  transform: translateZ(0px);',
      '}',
      '',
      '.dynamic-sky-star {',
      '  position: absolute;',
      '  width: 2px;',
      '  height: 2px;',
      '  background: #fff;',
      '  border-radius: 1px;',
      '}',
      '',
      '@media (max-width: 768px) {',
      '  .dynamic-sky-star {',
      '    opacity: 0.7;',
      '  }',
      '}'
    ].join('\n');
    
    var style = document.createElement('style');
    style.id = 'dynamic-sky-styles';
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
    document.head.appendChild(style);
  })();

  // ============================================================================
  // SunCalc Auto-Loader
  // ============================================================================
  
  // Promise that resolves when SunCalc is available
  var sunCalcReadyPromise = null;
  
  // Function to ensure SunCalc is loaded
  function ensureSunCalc() {
    // If SunCalc is already available, return resolved promise
    if (typeof global.SunCalc !== 'undefined') {
      return Promise.resolve();
    }
    
    // If we're already loading, return the existing promise
    if (sunCalcReadyPromise) {
      return sunCalcReadyPromise;
    }
    
    // Check if we're in a browser environment
    if (typeof document === 'undefined') {
      return Promise.reject(new Error('SunCalc library not found and cannot be auto-loaded in this environment'));
    }
    
    // Create promise for async loading
    sunCalcReadyPromise = new Promise(function(resolve, reject) {
      // Async script tag loading with Subresource Integrity (SRI)
      var script = document.createElement('script');
      // Use unminified version for stable SRI hash as per security policy
      script.src = 'https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.js';
      script.integrity = 'sha384-oiKvfHOCwLd5BVeyS4Zc1WW9KNRFXyXCkijYVrNbvw6BzoPFC+HiHzZi8FlRAvQ3';
      script.crossOrigin = 'anonymous';
      script.async = true;
      
      script.onload = function() {
        if (typeof global.SunCalc !== 'undefined') {
          resolve();
        } else {
          reject(new Error('SunCalc script loaded but SunCalc object not found'));
        }
      };
      
      script.onerror = function() {
        reject(new Error('Failed to load SunCalc from jsdelivr. Please check your network connection or include SunCalc manually.'));
      };
      
      // Append to head or body
      if (document.head) {
        document.head.appendChild(script);
      } else {
        document.body.appendChild(script);
      }
    });
    
    return sunCalcReadyPromise;
  }
  
  // Try to preload SunCalc immediately (non-blocking)
  if (typeof document !== 'undefined' && typeof global.SunCalc === 'undefined') {
    ensureSunCalc().catch(function(error) {
      // Silently fail - will retry when init() is called
      console.warn('DynamicSky: Could not preload SunCalc:', error.message);
    });
  }

  // ============================================================================
  // DynamicSky Library
  // ============================================================================

  // Utility functions
  function clamp(x, min, max) {
    return Math.max(min, Math.min(max, x));
  }

  function clamp01(x) {
    return x < 0 ? 0 : (x > 1 ? 1 : x);
  }

  function isValidCoordinate(lat, lng) {
    return typeof lat === 'number' && isFinite(lat) && Math.abs(lat) <= 90 &&
           typeof lng === 'number' && isFinite(lng) && Math.abs(lng) <= 180;
  }

  // Note: add, scale, exp, dot, len, norm, intersectSphere removed as they are now inlined or unused.

  /**
   * DynamicSky Class
   */
  function DynamicSky(options) {
    options = options || {};
    
    // Default configuration
    this.config = {
      // DOM selectors
      skyContainer: options.skyContainer || '#background-sky',
      starsContainer: options.starsContainer || '#stars-container',
      
      // Location
      latitude: options.latitude || null,
      longitude: options.longitude || null,
      autoDetectLocation: options.autoDetectLocation !== false,
      
      // Sky rendering options
      starLayers: options.starLayers || 3,
      starDensity: options.starDensity || 5,
      
      // Callbacks
      onUpdate: options.onUpdate || null,
      onLocationDetected: options.onLocationDetected || null,
      
      // Location API
      locationApiUrl: options.locationApiUrl || 'https://ipwho.is/'
    };

    // Internal state
    this.skyElement = null;
    this.starsElement = null;
    this.starsCreated = false;
    this.skyState = { diameter: 0 };
    this.userLatitude = null;
    this.userLongitude = null;
    this.isInitialized = false;
  }

  DynamicSky.prototype.init = function() {
    if (this.isInitialized) {
      console.warn('DynamicSky already initialized');
      return Promise.resolve(this);
    }

    // Get or create DOM elements
    this.skyElement = document.querySelector(this.config.skyContainer);
    this.starsElement = document.querySelector(this.config.starsContainer);

    // Create containers if they don't exist
    if (!this.skyElement) {
      this.skyElement = document.createElement('div');
      if (this.config.skyContainer.indexOf('#') === 0) {
        // It's an ID selector
        this.skyElement.id = this.config.skyContainer.substring(1);
      } else if (this.config.skyContainer.indexOf('.') === 0) {
        // It's a class selector
        this.skyElement.className = this.config.skyContainer.substring(1);
      }
      document.body.appendChild(this.skyElement);
    }

    if (!this.starsElement) {
      this.starsElement = document.createElement('div');
      if (this.config.starsContainer.indexOf('#') === 0) {
        // It's an ID selector
        this.starsElement.id = this.config.starsContainer.substring(1);
      } else if (this.config.starsContainer.indexOf('.') === 0) {
        // It's a class selector
        this.starsElement.className = this.config.starsContainer.substring(1);
      }
      document.body.appendChild(this.starsElement);
    }
    
    // Detect if containers are inside another element (not direct children of body)
    // If so, use absolute positioning instead of fixed
    var skyParent = this.skyElement.parentElement;
    var isContained = skyParent && skyParent !== document.body;
    
    if (isContained) {
      // Ensure parent has relative positioning
      var parentStyle = window.getComputedStyle(skyParent);
      if (parentStyle.position === 'static') {
        skyParent.style.position = 'relative';
      }
      
      // Use absolute positioning for contained elements
      this.skyElement.style.position = 'absolute';
      this.skyElement.style.top = '0';
      this.skyElement.style.left = '0';
      this.skyElement.style.width = '100%';
      this.skyElement.style.height = '100%';
      this.skyElement.style.zIndex = '0';
      this.skyElement.style.backgroundColor = '#121212';
      this.skyElement.style.pointerEvents = 'none';
      this.skyElement.style.margin = '0';
      this.skyElement.style.padding = '0';
      
      this.starsElement.style.position = 'absolute';
      this.starsElement.style.top = '0';
      this.starsElement.style.left = '0';
      this.starsElement.style.width = '100%';
      this.starsElement.style.height = '100%';
      this.starsElement.style.zIndex = '1';
      this.starsElement.style.overflow = 'hidden';
      this.starsElement.style.perspective = '100px';
      this.starsElement.style.perspectiveOrigin = '50% 50%';
    } else {
      // Use fixed positioning for full-page backgrounds
      this.skyElement.style.position = 'fixed';
      this.skyElement.style.top = '0';
      this.skyElement.style.left = '0';
      this.skyElement.style.width = '100vw';
      this.skyElement.style.height = '100dvh';
      this.skyElement.style.zIndex = '-2';
      
      this.starsElement.style.position = 'fixed';
      this.starsElement.style.top = '0';
      this.starsElement.style.left = '0';
      this.starsElement.style.width = '100%';
      this.starsElement.style.height = '100%';
      this.starsElement.style.height = '100dvh';
      this.starsElement.style.zIndex = '-1';
    }

    var self = this;
    
    // Return a Promise that resolves after initialization
    return new Promise(function(resolve, reject) {
      // Ensure SunCalc is loaded before proceeding
      ensureSunCalc().then(function() {
        // Detect or use provided location
        if (self.config.autoDetectLocation && (!self.config.latitude || !self.config.longitude)) {
          self.detectLocation().then(function() {
            self._initialRender();
            resolve(self);
          }).catch(function(error) {
            // Even if location detection fails, use fallback and continue
            self.userLatitude = 37.77;
            self.userLongitude = -122.41;
            self._initialRender();
            resolve(self);
          });
        } else {
          self.userLatitude = self.config.latitude || 37.77;
          self.userLongitude = self.config.longitude || -122.41;
          self._initialRender();
          resolve(self);
        }
      }).catch(function(error) {
        console.error('DynamicSky: Failed to load SunCalc:', error.message);
        console.error('Please include SunCalc manually: <script src="https://cdn.jsdelivr.net/npm/suncalc@1.9.0/suncalc.min.js"></script>');
        reject(error);
      });
    });
  };

  DynamicSky.prototype._initialRender = function() {
    // Initial render
    this.updateSky();

    this.isInitialized = true;
    
    // Dispatch event
    var event = new CustomEvent('dynamic-sky-initialized', { 
      detail: { 
        latitude: this.userLatitude, 
        longitude: this.userLongitude 
      } 
    });
    document.dispatchEvent(event);
  };

  DynamicSky.prototype.detectLocation = function() {
    var self = this;
    return fetch(this.config.locationApiUrl)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('API request failed with status ' + response.status);
        }
        return response.json();
      })
      .then(function(data) {
        if (!data.success) {
          throw new Error('API response indicates failure');
        }

        if (!isValidCoordinate(data.latitude, data.longitude)) {
          throw new Error('Invalid coordinates received from API');
        }

        self.userLatitude = data.latitude;
        self.userLongitude = data.longitude;
        
        if (self.config.onLocationDetected) {
          self.config.onLocationDetected(self.userLatitude, self.userLongitude);
        }
      })
      .catch(function(error) {
        console.error('DynamicSky: Error getting location from IP API, using fallback:', error);
        self.userLatitude = 37.77;
        self.userLongitude = -122.41;
      });
  };

  DynamicSky.prototype.updateSkyGeometry = function() {
    // Check if container is inside another element
    var skyParent = this.skyElement ? this.skyElement.parentElement : null;
    var isContained = skyParent && skyParent !== document.body;
    
    if (isContained) {
      // For contained elements, use the container's dimensions
      var rect = skyParent.getBoundingClientRect();
      var winW = rect.width;
      var winH = rect.height;
    } else {
      // For full-page backgrounds, use viewport dimensions
      var winW = window.innerWidth;
      var winH = window.innerHeight;
    }
    
    // Store dimensions for use in createSky
    this.skyState.width = winW;
    this.skyState.height = winH;
    // Star field will be w*2 x h*2 centered on pivot point (10% below container)
    this.skyState.starFieldWidth = winW * 2;
    this.skyState.starFieldHeight = winH * 2;
    // Use the larger dimension for diameter calculation
    this.skyState.diameter = Math.max(this.skyState.starFieldWidth, this.skyState.starFieldHeight);
  };

  DynamicSky.prototype.createSky = function() {
    if (this.starsCreated || !this.starsElement) {
      return;
    }

    this.updateSkyGeometry();
    var diameter = this.skyState.diameter;
    
    // Check if container is inside another element
    var skyParent = this.skyElement ? this.skyElement.parentElement : null;
    var isContained = skyParent && skyParent !== document.body;
    
    // Store these for use in nested functions
    var self = this;

    if (isContained) {
      // For contained elements, use container dimensions for stars
      var rect = skyParent.getBoundingClientRect();
      var containerWidth = rect.width;
      var containerHeight = rect.height;
      
      // Ensure container has dimensions, otherwise wait and retry
      if (containerWidth === 0 || containerHeight === 0) {
        var self = this;
        setTimeout(function() {
          self.createSky();
        }, 100);
        return;
      }
      
      // Pivot point is at 10% of container height BELOW the container
      // So pivot is at: (containerWidth/2, containerHeight + 0.1*containerHeight) = (w/2, 1.1*h)
      // Star field should be w*2 x h*2 centered on this pivot point
      var starFieldWidth = containerWidth * 2;
      var starFieldHeight = containerHeight * 2;
      diameter = Math.max(starFieldWidth, starFieldHeight);
      // Store star field dimensions for star distribution
      this.skyState.starFieldWidth = starFieldWidth;
      this.skyState.starFieldHeight = starFieldHeight;
      
      // Position star field so pivot point is at its center
      // Pivot point relative to container: (w/2, 1.1*h)
      // Star field center should be at pivot, so star field top-left relative to container:
      // left: w/2 - starFieldWidth/2 = w/2 - w = -w/2
      // top: 1.1*h - starFieldHeight/2 = 1.1*h - h = 0.1*h
      var pivotX = containerWidth / 2;
      var pivotY = containerHeight * 1.1; // 10% below container
      var starFieldLeft = pivotX - starFieldWidth / 2;
      var starFieldTop = pivotY - starFieldHeight / 2;
      
      // Set stars container to calculated size and position it
      this.starsElement.style.width = starFieldWidth + 'px';
      this.starsElement.style.height = starFieldHeight + 'px';
      this.starsElement.style.position = 'absolute';
      this.starsElement.style.left = starFieldLeft + 'px';
      this.starsElement.style.top = starFieldTop + 'px';
      this.starsElement.style.transform = '';
      this.starsElement.style.overflow = 'hidden';
      this.starsElement.style.perspective = '100px';
      this.starsElement.style.perspectiveOrigin = '50% 50%';
      this.starsElement.style.pointerEvents = 'none';
    } else {
      // For full-page backgrounds, pivot point is at 10% of viewport height BELOW viewport
      var viewportWidth = window.innerWidth;
      var viewportHeight = window.innerHeight;
      
      // Star field should be w*2 x h*2 centered on pivot point
      var starFieldWidth = viewportWidth * 2;
      var starFieldHeight = viewportHeight * 2;
      diameter = Math.max(starFieldWidth, starFieldHeight);
      // Store star field dimensions for star distribution
      this.skyState.starFieldWidth = starFieldWidth;
      this.skyState.starFieldHeight = starFieldHeight;
      
      // Pivot point: (viewportWidth/2, viewportHeight * 1.1)
      var pivotX = viewportWidth / 2;
      var pivotY = viewportHeight * 1.1; // 10% below viewport
      var starFieldLeft = pivotX - starFieldWidth / 2;
      var starFieldTop = pivotY - starFieldHeight / 2;
      
      this.starsElement.style.width = starFieldWidth + 'px';
      this.starsElement.style.height = starFieldHeight + 'px';
      this.starsElement.style.position = 'fixed';
      this.starsElement.style.left = starFieldLeft + 'px';
      this.starsElement.style.top = starFieldTop + 'px';
      this.starsElement.style.transform = '';
      this.starsElement.style.overflow = 'hidden';
    }

    // Adjust density for mobile
    var density = this.config.starDensity;
    if (window.innerWidth <= 768) {
      density = 2;
    }

    this.starsElement.dataset.allowbreathe = true;

    // Calculate star density based on container type
    // Keep star count the same as original (based on visible area w x h)
    // Stars will be distributed across the larger star field (w*2 x h*2)
    var screenArea, containerArea, areaScale;
    if (isContained) {
      // For contained elements, use container dimensions (original visible area)
      var rect = skyParent.getBoundingClientRect();
      screenArea = rect.width * rect.height;
      // Use original visible area for star count calculation to keep count the same
      containerArea = screenArea; // Same as visible area, not the larger star field
      areaScale = containerArea / screenArea; // This will be 1.0, keeping original star count
      // Scale down density for smaller containers
      density = density * Math.min(1, screenArea / (800 * 600));
    } else {
      // For full-page backgrounds, use viewport dimensions (original visible area)
      screenArea = window.innerWidth * window.innerHeight;
      // Use original visible area for star count calculation to keep count the same
      containerArea = screenArea; // Same as visible area, not the larger star field
      areaScale = containerArea / screenArea; // This will be 1.0, keeping original star count
    }

    var layers = this.config.starLayers;
    for (var i = 0; i < layers; i++) {
      var newLayer = document.createElement("DIV");
      var baseStarsCount = density * (200 * (0.5 / (i + 1)));
      var starsCount = Math.floor(baseStarsCount * areaScale);

      var fracComplete = (i + 1) / layers;
      var op = fracComplete + 0.1;

      newLayer.className = "dynamic-sky-layer dynamic-sky-layer" + i;
      newLayer.style.zIndex = i;
      newLayer.style.opacity = op;
      newLayer.dataset.stars = starsCount;
      newLayer.dataset.zoom = 1 + 2 * Math.pow(1.5, i);
      this.starsElement.appendChild(newLayer);
    }

    var layerNodes = this.starsElement.querySelectorAll(".dynamic-sky-layer");
    var self = this;

    function initStars(layer) {
      var starsCount = parseInt(layer.dataset.stars);
      
      // Use the actual star field dimensions (w*2 x h*2) for star distribution
      var w = self.skyState.starFieldWidth || diameter;
      var h = self.skyState.starFieldHeight || diameter;

      // Optimization: Use DocumentFragment to batch DOM insertions to reduce reflows
      var fragment = document.createDocumentFragment();

      for (var i = 0; i < starsCount; i++) {
        var star = document.createElement("DIV");
        var xVal = Math.random() * w;
        var yVal = Math.random() * h;
        var blue = "rgb(255," + (255 - Math.ceil(10 * Math.random())) + "," + (255 - Math.ceil(20 * Math.random())) + ")";
        var red = "rgb(" + (255 - Math.ceil(20 * Math.random())) + ",255,255)";

        star.className = "dynamic-sky-star";
        star.style.left = xVal + "px";
        star.style.top = yVal + "px";

        if (i % 2 == 0) {
          star.style.backgroundColor = blue;
        } else {
          star.style.backgroundColor = red;
        }

        fragment.appendChild(star);
      }
      layer.appendChild(fragment);
    }

    for (var i = 0; i < layerNodes.length; i++) {
      initStars(layerNodes[i]);
    }

    this.startBreathingAnimation();
    this.starsCreated = true;
  };

  DynamicSky.prototype.startBreathingAnimation = function(speed) {
    speed = speed || 10000;
    if (!this.starsElement) return;

    var layerNodes = this.starsElement.querySelectorAll(".dynamic-sky-layer");
    var self = this;

    for (var i = 0; i < layerNodes.length; i++) {
      var layer = layerNodes[i];
      var transition = "transform " + speed + "ms ease-in-out";
      layer.style.transition = transition;
      layer.style.WebkitTransition = "-webkit-" + transition;
      layer.style.MozTransition = "-moz-" + transition;
      layer.style.MsTransition = "-ms-" + transition;
      layer.style.OTransition = "-o-" + transition;

      var transform = "translateZ(0.1px)";
      layer.style.transform = transform;
      layer.style.WebkitTransform = transform;
      layer.style.MozTransform = transform;
      layer.style.MsTransform = transform;
      layer.style.OTransform = transform;

      this.breatheIn(layer, speed);
    }
  };

  DynamicSky.prototype.breatheIn = function(layer, speed) {
    var self = this;
    if (this.starsElement.dataset.allowbreathe === 'false') { return; }
    layer.style.transform = "translateZ(" + layer.dataset.zoom + "px)";
    setTimeout(function() {
      self.breatheOut(layer, speed);
    }, speed);
  };

  DynamicSky.prototype.breatheOut = function(layer, speed) {
    var self = this;
    if (this.starsElement.dataset.allowbreathe === 'false') { return; }
    layer.style.transform = "translateZ(0px)";
    setTimeout(function() {
      self.breatheIn(layer, speed);
    }, speed);
  };

  DynamicSky.prototype.renderGradient = function(altitude) {
    var cameraPositionX = 0;
    var cameraPositionY = GROUND_RADIUS;
    var cameraPositionZ = 0;

    // norm([Math.cos(altitude), Math.sin(altitude), 0])
    // The vector is already normalized as cos^2 + sin^2 = 1.
    var sunDirectionX = Math.cos(altitude);
    var sunDirectionY = Math.sin(altitude);
    var sunDirectionZ = 0;

    var focalZ = 1.0 / Math.tan((FOV_DEG * 0.5 * PI) / 180.0);

    // Pre-allocate arrays to reduce garbage collection
    var transmittanceCameraToSpace = [0, 0, 0];
    var transmittanceToSpace = [0, 0, 0];
    var transmittanceLight = [0, 0, 0];

    // Optimization: Build CSS string directly to avoid object allocation and sorting
    // Iterate in reverse so percent goes from 0 to 100
    var colorStops = "";
    var startRgb = null;
    var endRgb = null;

    for (var i = GRADIENT_SAMPLES - 1; i >= 0; i--) {
      var s = i / (GRADIENT_SAMPLES - 1);

      // viewDirection = norm([0, s, focalZ])
      var vdX = 0;
      var vdY = s;
      var vdZ = focalZ;
      // Manual sqrt is faster than Math.hypot
      var vdLen = Math.sqrt(vdY * vdY + vdZ * vdZ) || 1;
      vdX /= vdLen;
      vdY /= vdLen;
      vdZ /= vdLen;

      var inscatteredX = 0;
      var inscatteredY = 0;
      var inscatteredZ = 0;

      // intersectSphere(cameraPosition, viewDirection, TOP_RADIUS)
      // cameraPosition is 0, GROUND_RADIUS, 0
      var b = cameraPositionY * vdY; // other terms are 0
      var c = (cameraPositionY * cameraPositionY) - (TOP_RADIUS * TOP_RADIUS);
      var discr = b * b - c;

      var tExitTop = null;
      if (discr >= 0) {
        var sqrtDiscr = Math.sqrt(discr);
        var t = -b - sqrtDiscr;
        if (t < 0) t = -b + sqrtDiscr;
        tExitTop = t;
      }

      if (tExitTop !== null && tExitTop > 0) {
        var rayOriginX = cameraPositionX;
        var rayOriginY = cameraPositionY;
        var rayOriginZ = cameraPositionZ;

        var segmentLength = tExitTop / INTEGRATION_SAMPLES;
        var tRay = segmentLength * 0.5;

        // rayOriginRadius is just cameraPositionY because x and z are 0
        var rayOriginRadius = cameraPositionY;

        // dot(rayOrigin, viewDirection) -> rayOriginY * vdY
        var isRayPointingDownwardAtStart = (rayOriginY * vdY) / rayOriginRadius < 0.0;

        var startHeight = rayOriginRadius - GROUND_RADIUS;

        // startRayCos = clamp(dot(rayOrigin/radius, viewDirection), -1, 1)
        // rayOrigin/radius is [0, 1, 0]
        // dot is vdY
        var startRayCos = vdY;
        if (startRayCos < -1) startRayCos = -1;
        if (startRayCos > 1) startRayCos = 1;

        // Optimization: Pass cosine directly to avoid acos()
        computeTransmittance(
          startHeight,
          Math.abs(startRayCos),
          transmittanceCameraToSpace
        );

        // sunViewCos = clamp(dot(sunDirection, viewDirection), -1, 1)
        var sunViewCos = sunDirectionX * vdX + sunDirectionY * vdY + sunDirectionZ * vdZ;
        if (sunViewCos < -1) sunViewCos = -1;
        if (sunViewCos > 1) sunViewCos = 1;

        var phaseR = rayleighPhase(sunViewCos);
        var phaseM = miePhase(sunViewCos);

        for (var j = 0; j < INTEGRATION_SAMPLES; j++) {
          // samplePos = rayOrigin + viewDirection * tRay
          var samplePosX = rayOriginX + vdX * tRay;
          var samplePosY = rayOriginY + vdY * tRay;
          var samplePosZ = rayOriginZ + vdZ * tRay;

          // Manual sqrt is faster than Math.hypot
          var sampleRadius = Math.sqrt(samplePosX * samplePosX + samplePosY * samplePosY + samplePosZ * samplePosZ);

          var upUnitX = samplePosX / sampleRadius;
          var upUnitY = samplePosY / sampleRadius;
          var upUnitZ = samplePosZ / sampleRadius;

          var sampleHeight = sampleRadius - GROUND_RADIUS;

          // viewCos = clamp(dot(upUnit, viewDirection), -1, 1)
          var viewCos = upUnitX * vdX + upUnitY * vdY + upUnitZ * vdZ;
          if (viewCos < -1) viewCos = -1;
          if (viewCos > 1) viewCos = 1;

          // sunCos = clamp(dot(upUnit, sunDirection), -1, 1)
          var sunCos = upUnitX * sunDirectionX + upUnitY * sunDirectionY + upUnitZ * sunDirectionZ;
          if (sunCos < -1) sunCos = -1;
          if (sunCos > 1) sunCos = 1;

          // Optimization: Pass cosine directly to avoid acos()
          computeTransmittance(
            sampleHeight,
            Math.abs(viewCos),
            transmittanceToSpace
          );

          var transmittanceCameraToSample0, transmittanceCameraToSample1, transmittanceCameraToSample2;

          if (isRayPointingDownwardAtStart) {
            transmittanceCameraToSample0 = transmittanceToSpace[0] / transmittanceCameraToSpace[0];
            transmittanceCameraToSample1 = transmittanceToSpace[1] / transmittanceCameraToSpace[1];
            transmittanceCameraToSample2 = transmittanceToSpace[2] / transmittanceCameraToSpace[2];
          } else {
            transmittanceCameraToSample0 = transmittanceCameraToSpace[0] / transmittanceToSpace[0];
            transmittanceCameraToSample1 = transmittanceCameraToSpace[1] / transmittanceToSpace[1];
            transmittanceCameraToSample2 = transmittanceCameraToSpace[2] / transmittanceToSpace[2];
          }

          computeTransmittance(sampleHeight, sunCos, transmittanceLight);
          var opticalDensityRay = Math.exp(
            -sampleHeight * INV_RAYLEIGH_SCALE_HEIGHT
          );
          var opticalDensityMie = Math.exp(-sampleHeight * INV_MIE_SCALE_HEIGHT);

          // Rayleigh and Mie terms
          // rayleighTerm[k] = RAYLEIGH_SCATTER[k] * opticalDensityRay * phaseR
          // mieTerm = MIE_SCATTER * opticalDensityMie * phaseM (same for all channels)

          var mieTerm = MIE_SCATTER * opticalDensityMie * phaseM;

          var rayleighTerm0 = RAYLEIGH_SCATTER[0] * opticalDensityRay * phaseR;
          var scatteredRgb0 = transmittanceLight[0] * (rayleighTerm0 + mieTerm);

          var rayleighTerm1 = RAYLEIGH_SCATTER[1] * opticalDensityRay * phaseR;
          var scatteredRgb1 = transmittanceLight[1] * (rayleighTerm1 + mieTerm);

          var rayleighTerm2 = RAYLEIGH_SCATTER[2] * opticalDensityRay * phaseR;
          var scatteredRgb2 = transmittanceLight[2] * (rayleighTerm2 + mieTerm);

          inscatteredX += transmittanceCameraToSample0 * scatteredRgb0 * segmentLength;
          inscatteredY += transmittanceCameraToSample1 * scatteredRgb1 * segmentLength;
          inscatteredZ += transmittanceCameraToSample2 * scatteredRgb2 * segmentLength;

          tRay += segmentLength;
        }

        inscatteredX *= SUN_INTENSITY;
        inscatteredY *= SUN_INTENSITY;
        inscatteredZ *= SUN_INTENSITY;
      }

      // Exposure
      var c0 = inscatteredX * EXPOSURE;
      var c1 = inscatteredY * EXPOSURE;
      var c2 = inscatteredZ * EXPOSURE;

      // Apply Sunset Bias
      var lum = 0.2126 * c0 + 0.7152 * c1 + 0.0722 * c2;
      var w = 1.0 / (1.0 + 2.0 * lum);
      var k = SUNSET_BIAS_STRENGTH;
      var rb = 1.0 + 0.5 * k * w;
      var gb = 1.0 - 0.5 * k * w;
      var bb = 1.0 + 1.0 * k * w;

      c0 = Math.max(0, c0 * rb);
      c1 = Math.max(0, c1 * gb);
      c2 = Math.max(0, c2 * bb);

      // ACES Tone Mapping (inlined)
      // n = c * (2.51 * c + 0.03)
      // d = c * (2.43 * c + 0.59) + 0.14
      // val = n / d

      var n0 = c0 * (2.51 * c0 + 0.03);
      var d0 = c0 * (2.43 * c0 + 0.59) + 0.14;
      c0 = Math.max(0, Math.min(1, n0 / d0));

      var n1 = c1 * (2.51 * c1 + 0.03);
      var d1 = c1 * (2.43 * c1 + 0.59) + 0.14;
      c1 = Math.max(0, Math.min(1, n1 / d1));

      var n2 = c2 * (2.51 * c2 + 0.03);
      var d2 = c2 * (2.43 * c2 + 0.59) + 0.14;
      c2 = Math.max(0, Math.min(1, n2 / d2));

      // Gamma Correction
      var invGamma = 1.0 / GAMMA;
      c0 = Math.pow(c0, invGamma);
      c1 = Math.pow(c1, invGamma);
      c2 = Math.pow(c2, invGamma);

      var r = Math.round(clamp01(c0) * 255);
      var g = Math.round(clamp01(c1) * 255);
      var b = Math.round(clamp01(c2) * 255);

      var percent = (1 - s) * 100;

      // Capture start/end RGB for return values
      if (i === GRADIENT_SAMPLES - 1) {
        startRgb = [r, g, b];
      } else if (i === 0) {
        endRgb = [r, g, b];
      }

      if (colorStops) colorStops += ", ";
      colorStops += "rgb(" + r + ", " + g + ", " + b + ") " + (Math.round(percent * 100) / 100) + "%";
    }

    return [
      "linear-gradient(to bottom, " + colorStops + ")",
      startRgb,
      endRgb,
    ];
  };

  /**
   * Update the sky background for a specific date/time
   * This is the main method that sliders should call
   * 
   * @param {Date} date - The date/time to render the sky for. If not provided, uses current time.
   */
  DynamicSky.prototype.updateSky = function(date) {
    if (!this.userLatitude || !this.userLongitude) {
      console.warn('DynamicSky: Location not set. Call init() first or provide latitude/longitude.');
      return;
    }
    
    // Ensure SunCalc is available
    if (typeof global.SunCalc === 'undefined') {
      console.error('DynamicSky: SunCalc is not available. Please ensure SunCalc is loaded.');
      return;
    }

    this.createSky();

    var now = date || new Date();
    var times = SunCalc.getTimes(now, this.userLatitude, this.userLongitude);
    var sunPos = SunCalc.getPosition(now, this.userLatitude, this.userLongitude);

    var renderAltitude = sunPos.altitude;

    var sunsetAltitude = -0.833 * (Math.PI / 180);
    var duskAltitude = -6 * (Math.PI / 180);
    var dawnAltitude = -6 * (Math.PI / 180);
    var sunriseAltitude = -0.833 * (Math.PI / 180);
    var visualTwilightBottomAltitude = -3 * (Math.PI / 180);

    if (now > times.sunset && now < times.dusk) {
      var twilightProgress = (now - times.sunset) / (times.dusk - times.sunset);
      renderAltitude = sunsetAltitude + twilightProgress * (visualTwilightBottomAltitude - sunsetAltitude);
    }

    if (now > times.dawn && now < times.sunrise) {
      var twilightProgress = (now - times.dawn) / (times.sunrise - times.dawn);
      renderAltitude = visualTwilightBottomAltitude + twilightProgress * (sunriseAltitude - visualTwilightBottomAltitude);
    }

    var gradient = this.renderGradient(renderAltitude)[0];

    if (this.skyElement) {
      this.skyElement.style.backgroundImage = gradient;
    }

    // Handle stars visibility
    if (this.starsElement) {
      var twilightBeginsAltitude = 0;
      var fullNightAltitude = -6 * (Math.PI / 180);
      var nightIntensity = 0;

      if (sunPos.altitude < twilightBeginsAltitude) {
        var transitionRange = fullNightAltitude - twilightBeginsAltitude;
        var progress = (sunPos.altitude - twilightBeginsAltitude) / transitionRange;
        nightIntensity = clamp(progress, 0, 1.0);
      }

      this.starsElement.style.opacity = nightIntensity;
      if (this.starsElement.dataset) {
        this.starsElement.dataset.allowbreathe = nightIntensity > 0;
      }

      // Star rotation
      // Rotate around the pivot point (center of star field, which is 10% below container)
      var msInDay = 86400000;
      var currentMs = (now.getHours() * 3600000) + (now.getMinutes() * 60000) + (now.getSeconds() * 1000) + now.getMilliseconds();
      var rotationDegrees = (currentMs / msInDay) * 360;
      
      // Set transform-origin to center of star field (50% 50%)
      // The star field is positioned so its center is at the pivot point (10% below container)
      // This creates an arc effect as stars rotate around this lower pivot point
      this.starsElement.style.transformOrigin = '50% 50%';
      
      // Apply rotation - positioning is already handled in createSky()
      this.starsElement.style.transform = "rotate(" + rotationDegrees + "deg)";
    }

    // Callback
    if (this.config.onUpdate) {
      this.config.onUpdate({
        date: now,
        sunPosition: sunPos,
        sunTimes: times
      });
    }
  };


  /**
   * Set the location coordinates manually
   * 
   * @param {number} latitude - Latitude coordinate
   * @param {number} longitude - Longitude coordinate
   */
  DynamicSky.prototype.setLocation = function(latitude, longitude) {
    if (!isValidCoordinate(latitude, longitude)) {
      console.error('DynamicSky: Invalid coordinates provided to setLocation', latitude, longitude);
      return;
    }
    this.userLatitude = latitude;
    this.userLongitude = longitude;
    this.updateSky();
  };

  /**
   * Convert minutes of day (0-1440) to a Date object for today
   * Useful for sliders that work with minutes
   * 
   * @param {number} minutes - Minutes since midnight (0-1440)
   * @returns {Date} Date object for today at the specified minutes
   */
  DynamicSky.prototype.minutesToDate = function(minutes) {
    var now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, minutes);
  };

  /**
   * Convert a percentage (0-1) to a Date object for today
   * Useful for sliders that work with percentages
   * 
   * @param {number} percent - Percentage of day (0 = midnight, 1 = next midnight)
   * @returns {Date} Date object for today at the specified percentage
   */
  DynamicSky.prototype.percentToDate = function(percent) {
    var minutes = Math.round(percent * 1440) % 1440;
    return this.minutesToDate(minutes);
  };

  /**
   * Convert hours (0-24) to a Date object for today
   * Useful for sliders that work with hours
   * 
   * @param {number} hours - Hours since midnight (0-24)
   * @returns {Date} Date object for today at the specified hours
   */
  DynamicSky.prototype.hoursToDate = function(hours) {
    var minutes = Math.round(hours * 60) % 1440;
    return this.minutesToDate(minutes);
  };

  /**
   * Convert a Date object to minutes of day (0-1440)
   * Useful for getting current time in slider-friendly format
   * 
   * @param {Date} date - Date object (defaults to current time)
   * @returns {number} Minutes since midnight
   */
  DynamicSky.prototype.dateToMinutes = function(date) {
    date = date || new Date();
    var startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    return Math.round((date - startOfDay) / 60000);
  };

  /**
   * Convert a Date object to percentage of day (0-1)
   * Useful for getting current time in slider-friendly format
   * 
   * @param {Date} date - Date object (defaults to current time)
   * @returns {number} Percentage of day (0-1)
   */
  DynamicSky.prototype.dateToPercent = function(date) {
    return this.dateToMinutes(date) / 1440;
  };

  /**
   * Clean up and destroy the instance
   */
  DynamicSky.prototype.destroy = function() {
    this.isInitialized = false;
  };

  // Export to global scope
  global.DynamicSky = DynamicSky;

})(typeof window !== 'undefined' ? window : this);
