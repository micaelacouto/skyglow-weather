from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_weather', methods=['POST'])
def get_weather():
    data = request.get_json() or {}
    city_input = data.get('city', '').strip()
    
    if not city_input:
        return jsonify({'error': 'Por favor, digite o nome de uma cidade.'}), 400

    formatted_city = city_input.title()
    city_lower = city_input.lower()

    # Simulação de dados com variação de clima para testar as animações
    if any(word in city_lower for word in ['chuva', 'curitiba', 'porto alegre', 'london']):
        temp = '18°C'
        wind = '19.2 km/h'
        status = 'Chuva 🌧️'
    elif any(word in city_lower for word in ['nublado', 'sao paulo', 'são paulo', 'sp']):
        temp = '22°C'
        wind = '10.5 km/h'
        status = 'Nublado ☁️'
    else:
        temp = '28°C'
        wind = '14.3 km/h'
        status = 'Céu Limpo ☀️'

    return jsonify({
        'city': f"{formatted_city}, Brasil",
        'temp': temp,
        'wind': wind,
        'status': status
    })

if __name__ == '__main__':
    app.run(debug=True)