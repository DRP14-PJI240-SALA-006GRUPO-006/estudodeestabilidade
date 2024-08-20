const express = require('express')
const connectDB = require('./config/database')
const path = require('path')
const userRoutes = require('./routes/userRoutes')
const stabilityStudyRoutes = require('./routes/stabilityStudyRoutes')

const PORT = process.env.PORT
const app = express()

connectDB()

// Middleware para o body parser
app.use(express.json());

// Rotas api
app.use('/api/users', userRoutes);
app.use('/api/studies', stabilityStudyRoutes);

// Rotas front
app.use(express.static('views'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','login.html'));
});
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','register.html'));
});
app.get('/studies', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','studies.html'));
});
app.get('/studies/create', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','create.html'));
});
app.get('/studies/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'views','view.html'));
});

//rotas de suporte suporte para vieww
app.use(express.static(path.join(__dirname, 'public')));


app.listen(PORT, () => {
    console.log(`\nServidor iniciado com sucesso!\n`)
    console.log(`URL -> http://localhost:${PORT}\n`)
});