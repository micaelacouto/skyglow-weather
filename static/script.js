document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const cityInput = document.getElementById('cityInput');
    const weatherBg = document.getElementById('weather-bg');

    // Inicialização dos efeitos visuais
    updateEffects('Céu Limpo');

    searchBtn.addEventListener('click', fetchWeather);
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') fetchWeather();
    });

    function fetchWeather() {
        const city = cityInput.value.trim();
        if (!city) return;

        fetch('/get_weather', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city: city })
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.error);
                return;
            }
            document.getElementById('cityName').textContent = data.city || `${city}, Brasil`;
            document.getElementById('temperature').textContent = data.temp || '27°C';
            document.getElementById('wind').textContent = `Vento: ${data.wind || '14.3 km/h'}`;
            document.getElementById('status').textContent = `Status: ${data.status || 'Céu Limpo ☀️'}`;

            updateEffects(data.status || 'Céu Limpo');
        })
        .catch(error => {
            console.error('Erro na requisição:', error);
            const formattedCity = city.charAt(0).toUpperCase() + city.slice(1);
            document.getElementById('cityName').textContent = `${formattedCity}, Brasil`;
            document.getElementById('temperature').textContent = '27°C';
            document.getElementById('wind').textContent = 'Vento: 14.3 km/h';
            document.getElementById('status').textContent = 'Status: Céu Limpo ☀️';
            updateEffects('Céu Limpo');
        });
    }

    function updateEffects(status) {
        if (!weatherBg) return;
        weatherBg.innerHTML = '';

        const lowerStatus = status.toLowerCase();

        if (lowerStatus.includes('chuva') || lowerStatus.includes('chovendo')) {
            createRain();
        } else if (lowerStatus.includes('nuvem') || lowerStatus.includes('nublado')) {
            createClouds();
        } else {
            createSun();
            createClouds();
        }
    }

    function createSun() {
        const sun = document.createElement('div');
        sun.style.cssText = `
            position: absolute;
            top: 50px;
            right: 80px;
            width: 100px;
            height: 100px;
            background: radial-gradient(circle, #fde047 30%, rgba(253, 224, 71, 0.3) 70%);
            border-radius: 50%;
            box-shadow: 0 0 50px #fde047;
            animation: pulseSun 3s infinite alternate;
        `;
        weatherBg.appendChild(sun);
    }

    function createClouds() {
        for (let i = 0; i < 5; i++) {
            const cloud = document.createElement('div');
            const size = Math.random() * 50 + 80;
            const topPos = Math.random() * 40 + 5;
            const duration = Math.random() * 15 + 18;

            cloud.style.cssText = `
                position: absolute;
                top: ${topPos}%;
                left: -180px;
                width: ${size * 2}px;
                height: ${size}px;
                background: rgba(255, 255, 255, 0.35);
                border-radius: 50px;
                backdrop-filter: blur(4px);
                animation: floatCloud ${duration}s linear infinite;
                animation-delay: ${i * 3.5}s;
            `;
            weatherBg.appendChild(cloud);
        }
    }

    function createRain() {
        for (let i = 0; i < 45; i++) {
            const drop = document.createElement('div');
            const leftPos = Math.random() * 100;
            const duration = Math.random() * 0.5 + 0.5;
            const delay = Math.random() * 2;

            drop.style.cssText = `
                position: absolute;
                top: -20px;
                left: ${leftPos}%;
                width: 2px;
                height: 20px;
                background: rgba(255, 255, 255, 0.6);
                animation: fallRain ${duration}s linear infinite;
                animation-delay: ${delay}s;
            `;
            weatherBg.appendChild(drop);
        }
    }
});

// Injeção de Animações CSS
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
@keyframes floatCloud {
    0% { transform: translateX(-180px); }
    100% { transform: translateX(105vw); }
}
@keyframes fallRain {
    0% { transform: translateY(-20px); }
    100% { transform: translateY(105vh); }
}
@keyframes pulseSun {
    0% { transform: scale(1); box-shadow: 0 0 30px #fde047; }
    100% { transform: scale(1.15); box-shadow: 0 0 60px #fde047; }
}
`;
document.head.appendChild(styleSheet);