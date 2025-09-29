import express from 'express';
import apiV1Router from './router/api-v1.mjs';
import apiV2Router from './router/api-v2.mjs';
import { initDB } from './database/database.mjs';
import { PORT } from './config.mjs';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import favicon from 'serve-favicon';
import { fileURLToPath } from 'url';
import path from 'path';


const _fileName = fileURLToPath(import.meta.url);
const _directoryName = path.dirname(_fileName);
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('static'));

app.set('view engine', 'ejs');
app.set('views', './views');

initDB();

app.use('/api-v1', apiV1Router);
app.use('/api-v2', apiV2Router);

app.use(express.static(path.join(_directoryName, 'static')));
app.get('/', (req, res) => {
  res.sendFile(path.join(_directoryName, 'static', 'client.html'));
});


app.use(favicon(path.join(_directoryName, "static", "logo_univ_16.png")));

// Configuration Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'devweb-shortener API',
    version: '1.0.0',
    description: 'Documentation de l’API pour le projet devweb-shortener',
  },
  servers: [
    { url: 'http://localhost:8080' }
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./router/*.mjs'], // Chemin vers tes fichiers de routes
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/error', (req, res) => {
    res.status(500).json({ error: 'Erreur interne' });
});



app.listen(PORT, () => {
    console.log(`Serveur lancé sur le port ${PORT}`);
});


