document.addEventListener('DOMContentLoaded', () => {
    // Initialize Accordions (Replacing inline onclick handlers)
    document.querySelectorAll('.code-accordion-header').forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('expanded');
            this.setAttribute('aria-expanded', this.classList.contains('expanded'));
            this.nextElementSibling.classList.toggle('expanded');

            // Update button text if needed (optional enhancement based on common patterns)
            // But strict replacement is safer.
        });
    });

    // Helper function to format time
    function formatTime(minutes) {
        // Handle 1440 (24 hours) as 12:00 AM
        if (minutes >= 1440) minutes = 0;
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHours = hours % 12 || 12;
        return `${displayHours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
    }

    // Location data
    const locations = {
        'new-york': { lat: 40.7128, lng: -74.0060, name: 'New York' },
        'tokyo': { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
        'london': { lat: 51.5074, lng: -0.1278, name: 'London' },
        'sydney': { lat: -33.8688, lng: 151.2093, name: 'Sydney' }
    };

    // Initialize background sky - starts with current live time
    const backgroundSky = new DynamicSky({
        skyContainer: '#background-sky',
        starsContainer: '#stars-container'
    });

    backgroundSky.init().then(() => {
        const backgroundSlider = document.getElementById('background-slider');
        const backgroundTimeDisplay = document.getElementById('background-time');
        let resetTimeout = null;

        function updateBackgroundSky() {
            let minutes = parseInt(backgroundSlider.value);
            // Handle 1440 as 0 (both represent midnight)
            if (minutes >= 1440) minutes = 0;
            const date = backgroundSky.minutesToDate(minutes);
            const timeString = formatTime(minutes);
            backgroundTimeDisplay.textContent = timeString;
            backgroundSlider.setAttribute('aria-valuetext', timeString);
            backgroundSky.updateSky(date);
        }

        function resetToCurrentTime() {
            const now = new Date();
            const currentMinutes = backgroundSky.dateToMinutes(now);
            const startMinutes = parseInt(backgroundSlider.value);

            // Only reset if not already at current time (within 1 minute tolerance)
            if (Math.abs(currentMinutes - startMinutes) > 1) {
                // Smoothly animate slider to current time over 2 seconds
                const duration = 2000; // 2 seconds for smooth animation
                const steps = 60; // 60 steps for smooth animation
                const stepDuration = duration / steps;
                const stepSize = (currentMinutes - startMinutes) / steps;
                let step = 0;

                const animate = () => {
                    if (step >= steps) {
                        backgroundSlider.value = currentMinutes;
                        updateBackgroundSky();
                        return;
                    }

                    const progress = step / steps;
                    // Ease-out function for smooth deceleration
                    const easedProgress = 1 - Math.pow(1 - progress, 3);
                    const currentValue = Math.round(startMinutes + (currentMinutes - startMinutes) * easedProgress);
                    backgroundSlider.value = currentValue;
                    updateBackgroundSky();
                    step++;
                    setTimeout(animate, stepDuration);
                };

                animate();
            }
        }

        function scheduleReset() {
            // Clear any existing timeout
            if (resetTimeout) {
                clearTimeout(resetTimeout);
            }

            // Schedule reset after 5 seconds
            resetTimeout = setTimeout(resetToCurrentTime, 5000);
        }

        backgroundSlider.addEventListener('input', () => {
            updateBackgroundSky();
            scheduleReset(); // Reset the timer on each interaction
        });

        // Initialize with current live time
        const now = new Date();
        const currentMinutes = backgroundSky.dateToMinutes(now);
        backgroundSlider.value = currentMinutes;
        const initialTimeString = formatTime(currentMinutes);
        backgroundTimeDisplay.textContent = initialTimeString;
        backgroundSlider.setAttribute('aria-valuetext', initialTimeString);
        backgroundSky.updateSky(now);
    });

    // Example 2: Weather App
    const weatherSky = new DynamicSky({
        skyContainer: '#weather-sky',
        starsContainer: '#weather-stars'
    });

    weatherSky.init().then(() => {
        const slider = document.getElementById('weather-slider');
        const timeDisplay = document.getElementById('weather-time');

        function updateWeatherSky() {
            let minutes = parseInt(slider.value);
            // Handle 1440 as 0 (both represent midnight)
            if (minutes >= 1440) minutes = 0;
            const date = weatherSky.minutesToDate(minutes);
            const timeString = formatTime(minutes);
            timeDisplay.textContent = timeString;
            slider.setAttribute('aria-valuetext', timeString);
            weatherSky.updateSky(date);
        }

        slider.addEventListener('input', updateWeatherSky);
        // Start at midnight (12:00 AM)
        slider.value = 0;
        updateWeatherSky();
    });

    // Example 3: Dashboard Widget with Programmatic Control
    const dashboardSky = new DynamicSky({
        skyContainer: '#dashboard-sky',
        starsContainer: '#dashboard-stars'
    });

    dashboardSky.init().then(() => {
        const slider = document.getElementById('dashboard-slider');
        const timeDisplay = document.getElementById('dashboard-time');

        function updateDashboardSky() {
            let minutes = parseInt(slider.value);
            // Handle 1440 as 0 (both represent midnight)
            if (minutes >= 1440) minutes = 0;
            const date = dashboardSky.minutesToDate(minutes);
            const timeString = formatTime(minutes);
            timeDisplay.textContent = timeString;
            slider.setAttribute('aria-valuetext', timeString);
            dashboardSky.updateSky(date);
        }

        // Allow manual control if user interacts
        slider.addEventListener('input', updateDashboardSky);

        // Programmatic control: Automatically cycle through the day
        let currentMinutes = 0;
        const cycleSpeed = 50; // Minutes per second (for demo purposes)

        function programmaticUpdate() {
            currentMinutes += cycleSpeed;

            // Wrap around at 1440 (24 hours)
            if (currentMinutes >= 1440) {
                currentMinutes = 0;
            }

            // Update slider value programmatically
            slider.value = currentMinutes;
            updateDashboardSky();
        }

        // Start at midnight
        slider.value = 0;
        updateDashboardSky();

        // Update every second (50 minutes per second = full day in ~28.8 seconds)
        setInterval(programmaticUpdate, 1000);
    });

    // Example 4: Travel App
    let currentTravelLocation = 'new-york';
    const travelSky = new DynamicSky({
        skyContainer: '#travel-sky',
        starsContainer: '#travel-stars',
        latitude: locations[currentTravelLocation].lat,
        longitude: locations[currentTravelLocation].lng
    });

    travelSky.init().then(() => {
        const slider = document.getElementById('travel-slider');
        const timeDisplay = document.getElementById('travel-time');
        const labelDisplay = document.getElementById('travel-label');

        function updateTravelSky() {
            let minutes = parseInt(slider.value);
            // Handle 1440 as 0 (both represent midnight)
            if (minutes >= 1440) minutes = 0;
            const date = travelSky.minutesToDate(minutes);
            const timeString = formatTime(minutes);
            timeDisplay.textContent = timeString;
            slider.setAttribute('aria-valuetext', timeString);
            labelDisplay.textContent = `${locations[currentTravelLocation].name} - ${timeString}`;
            travelSky.updateSky(date);
        }

        slider.addEventListener('input', updateTravelSky);

        // Location buttons
        document.querySelectorAll('.location-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.location-btn').forEach(b => {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
                currentTravelLocation = btn.dataset.location;
                travelSky.setLocation(
                    locations[currentTravelLocation].lat,
                    locations[currentTravelLocation].lng
                );
                updateTravelSky();
            });
        });

        // Start at midnight (12:00 AM)
        slider.value = 0;
        updateTravelSky();
    });

    // Example 5: Auto-Updating Sky
    const autoSky = new DynamicSky({
        skyContainer: '#auto-sky',
        starsContainer: '#auto-stars'
    });

    autoSky.init().then(() => {
        function updateAutoSky() {
        const now = new Date();
            const minutes = autoSky.dateToMinutes(now);
            document.getElementById('auto-time-display').textContent = formatTime(minutes);
            autoSky.updateSky(now);
        }

        // Update immediately
        updateAutoSky();

        // Update every minute
        setInterval(updateAutoSky, 60000);
    });

    // Example 6: Product Card
    const productSky = new DynamicSky({
        skyContainer: '#product-sky',
        starsContainer: '#product-stars'
    });

    productSky.init().then(() => {
        const slider = document.getElementById('product-slider');
        const timeDisplay = document.getElementById('product-time');

        function updateProductSky() {
            let minutes = parseInt(slider.value);
            // Handle 1440 as 0 (both represent midnight)
            if (minutes >= 1440) minutes = 0;
            const date = productSky.minutesToDate(minutes);
            const timeString = formatTime(minutes);
            timeDisplay.textContent = timeString;
            slider.setAttribute('aria-valuetext', timeString);
            productSky.updateSky(date);
        }

        slider.addEventListener('input', updateProductSky);
        // Start at midnight (12:00 AM)
        slider.value = 0;
        updateProductSky();
    });

    // Example 7: Time Comparison (Morning, Noon, Evening)
    const morningSky = new DynamicSky({
        skyContainer: '#morning-sky',
        starsContainer: '#morning-stars'
    });

    const noonSky = new DynamicSky({
        skyContainer: '#noon-sky',
        starsContainer: '#noon-stars'
    });

    const eveningSky = new DynamicSky({
        skyContainer: '#evening-sky',
        starsContainer: '#evening-stars'
    });

    Promise.all([
        morningSky.init(),
        noonSky.init(),
        eveningSky.init()
    ]).then(() => {
        // Morning: 6 AM
        morningSky.updateSky(morningSky.minutesToDate(360));
        // Noon: 12 PM
        noonSky.updateSky(noonSky.minutesToDate(720));
        // Evening: 6 PM
        eveningSky.updateSky(eveningSky.minutesToDate(1080));
    });

    // Example 8: Location Comparison
    const comparisonLocations = [
        { lat: 37.7749, lng: -122.4194, name: 'San Francisco' },
        { lat: 40.7128, lng: -74.0060, name: 'New York' },
        { lat: 35.6762, lng: 139.6503, name: 'Tokyo' },
        { lat: 51.5074, lng: -0.1278, name: 'London' }
    ];

    const comparisonSkies = comparisonLocations.map((loc, index) => {
        return new DynamicSky({
            skyContainer: `#compare-${index + 1}-sky`,
            starsContainer: `#compare-${index + 1}-stars`,
            latitude: loc.lat,
            longitude: loc.lng
        });
    });

    Promise.all(comparisonSkies.map(sky => sky.init())).then(() => {
        const slider = document.getElementById('compare-slider');
        const timeDisplay = document.getElementById('compare-time');

        function updateComparison() {
            let minutes = parseInt(slider.value);
            // Handle 1440 as 0 (both represent midnight)
            if (minutes >= 1440) minutes = 0;
            const date = comparisonSkies[0].minutesToDate(minutes);
            const timeString = formatTime(minutes);
            timeDisplay.textContent = timeString;
            slider.setAttribute('aria-valuetext', timeString);

            comparisonSkies.forEach(sky => {
                sky.updateSky(date);
            });
        }

        slider.addEventListener('input', updateComparison);
        // Start at midnight (12:00 AM)
        slider.value = 0;
        updateComparison();
    });

    // Smooth scroll animation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
                // Explicitly set focus to the target for accessibility
                target.setAttribute('tabindex', '-1');
                target.focus();
            }
        });
    });

    // Initialize copy buttons
    document.querySelectorAll('.code-block').forEach(block => {
        const btn = document.createElement('button');
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.ariaLabel = 'Copy code to clipboard';
        block.appendChild(btn);

        btn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const code = block.querySelector('code')?.innerText || '';
            if (!code) return;

            try {
                await navigator.clipboard.writeText(code);
                btn.textContent = 'Copied!';
                btn.classList.add('copied');
                btn.ariaLabel = 'Copied successfully';
                setTimeout(() => {
                    btn.textContent = 'Copy';
                    btn.classList.remove('copied');
                    btn.ariaLabel = 'Copy code to clipboard';
                }, 2000);
            } catch (err) {
                btn.textContent = 'Error';
                setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
            }
        });
    });
});
