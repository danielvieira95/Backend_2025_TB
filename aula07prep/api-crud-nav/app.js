// app.js
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const historico = [];

// Página com entrada + lista dinâmica
app.get('/', (req, res) => {
  res.send(/* html */`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Entrada pelo Navegador</title>
    </head>
    <body style="font-family: sans-serif; max-width: 560px; margin: 40px auto;">
      <h1>Digite algo</h1>

      <input id="msg" placeholder="Escreva aqui..." style="padding:8px; width: 70%;"/>
      <button id="btn" style="padding:8px 12px;">Enviar</button>

      <h2>Histórico</h2>
      <ol id="hist"></ol>

      <script>
        async function carregarHistorico() {
          const r = await fetch('/historico');
          const dados = await r.json();
          const ol = document.getElementById('hist');
          ol.innerHTML = '';
          dados.forEach((item, i) => {
            const li = document.createElement('li');
            li.textContent = item;
            ol.appendChild(li);
          });
        }
        carregarHistorico();

        document.getElementById('btn').addEventListener('click', async () => {
          const valor = document.getElementById('msg').value.trim();
          if (!valor) return;
          await fetch('/enviar-json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensagem: valor })
          });
          document.getElementById('msg').value = '';
          carregarHistorico(); // atualiza sem recarregar a página
        });
      </script>
    </body>
    </html>
  `);
});

// Recebe via fetch
app.post('/enviar-json', (req, res) => {
  const { mensagem } = req.body;
  if (mensagem && mensagem.trim()) {
    historico.push(mensagem.trim());
    return res.status(201).json({ ok: true });
  }
  res.status(400).json({ error: 'Mensagem vazia' });
});

// Retorna histórico
app.get('/historico', (req, res) => {
  res.json(historico);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
