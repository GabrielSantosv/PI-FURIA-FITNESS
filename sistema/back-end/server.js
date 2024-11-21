import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import oracledb from 'oracledb';
import router from './routes.js';
import { initializeDB } from './dbConnection.js';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configura a pasta "public" para servir arquivos estáticos
app.use(express.static('public'));

// Configura a rota para servir o cadastro.html
app.get('/cadastro', (req, res) => {
    res.sendFile('cadastro.html', { root: 'public' });
});

// Configura as rotas
app.use(router);

// Inicializa o servidor e a conexão com o banco de dados
initializeDB().then(() => {
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}).catch((err) => {
    console.error('Erro ao inicializar o banco de dados:', err);
});