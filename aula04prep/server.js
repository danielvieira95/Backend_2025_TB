const express = require('express'); 
const cors = require("cors"); 
const axios = require('axios'); 
require('dotenv').config();
const app = express(); 
const PORT = 3000;
const apiKey = process.env.OPENWEATHER_API_KEY; 

app.use(cors());

app.get('/weather', async (req, res) => {

    const { city, country } = req.query;

    if (!city || !country) {
    return res.status(400).json({ error: 'Informe cidade e país.' });
    }

    try {

    const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric&lang=pt_br`
    );

    const data = response.data;

    const temperature = data.main?.temp ?? 0; 
    const humidity = data.main?.humidity ?? 0; 
    const windSpeed = data.wind?.speed ? data.wind.speed * 3.6 : 0;
    const rainChance = data.rain?.['1h'] ?? 0; 
    const weatherCondition = data.weather?.[0]?.description ?? 'Desconhecido'; 

    res.json({ temperature, humidity, windSpeed, rainChance, weatherCondition });
    } catch (err) {

    if (err.response?.status === 404) {
    return res.status(404).json({ error: 'Cidade não encontrada.' });
    }
    res.status(500).json({ error: 'Erro ao obter dados do clima.' });
    }
});

app.get('/multiple', async (req, res) => {
    const { cities } = req.query;

    if (!cities) {
        return res.status(400).json({ error: 'Informe pelo menos cidade.'});
    }

    const cityList = cities.split(',');
    const results = [];

    try {
        for (let city of cityList) {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt_br`
            );

        results.push({
            city,
            temperature: response.data.main?.temp ?? 0,
            weather: response.data.weather?.[0]?.description ?? 'Desconhecido'
        });
        }

        res.json(results);
        
    }   catch (err) {
        res.status(500).json({ error: 'Erro ao consultar API para múltiplas cidades.'})
    }    
});

app.get('/alert', async (req, res) => {
    const { city, country } = req.query;

    if (!city || !country) {
        return res.status(400).json({ error: 'Informe cidade e país.'});
    }

    try {
        const response = await axios.get (`https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${apiKey}&units=metric&lang=pt_br`
        );

        const temp = response.data.main?.temp ?? 0;

        let alert = temp > 30 ? 'Quente' : temp < 10 ? 'Frio' : 'Agradavel';

        res.json({ city, temperature: temp, alert});

    }   catch (err) {
        res.status(500).json({ error: 'Erro ao obter dados do clima.'})
    } 
});

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}/`));