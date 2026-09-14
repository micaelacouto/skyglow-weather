from flask import Flask, render_template, request, jsonify
import requests
import re

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/clima', methods=['GET'])
def obter_clima():
    cidade = request.args.get('cidade', '').strip()

    # 1. Validação: Texto vazio
    if not cidade:
        return jsonify({'erro': 'Por favor, digite o nome de uma cidade.'}), 400

    # 2. Validação: Apenas números
    if cidade.isdigit():
        return jsonify({'erro': 'Digite o nome de uma cidade válida, não apenas números.'}), 400

    # 3. Validação: Menos de 2 caracteres ou símbolos estranhos
    if len(cidade) < 2 or not re.match(r"^[a-zA-ZÀ-ÿ\s'-]+$", cidade):
        return jsonify({'erro': 'O busca contém caracteres inválidos ou é muito curta.'}), 400

    # Busca geográfica (traz até 5 resultados para filtrar melhor)
    geo_url = f"https://geocoding-api.open-meteo.com/v1/search?name={cidade}&count=5&language=pt&format=json"
    
    try:
        geo_res = requests.get(geo_url, timeout=5).json()
    except requests.exceptions.RequestException:
        return jsonify({'erro': 'Erro de conexão com o serviço de mapa.'}), 500

    results = geo_res.get('results')
    if not results:
        return jsonify({'erro': 'Cidade não encontrada. Tente buscar pelo nome do município.'}), 404

    # Pega o primeiro e mais relevante resultado
    local = results[0]
    lat = local['latitude']
    lon = local['longitude']
    nome_cidade = local['name']
    estado_ou_pais = local.get('admin1') or local.get('country', '')

    # Busca o clima
    clima_url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true"
    clima_res = requests.get(clima_url).json()
    dados_clima = clima_res.get('current_weather', {})

    return jsonify({
        'cidade': f"{nome_cidade}, {estado_ou_pais}",
        'temperatura': dados_clima.get('temperature'),
        'vento': dados_clima.get('windspeed'),
        'codigo_clima': dados_clima.get('weathercode')
    })

if __name__ == '__main__':
    app.run(debug=True)