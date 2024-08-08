const express = require('express')
const connectDB = require('./config/database')
const PORT = process.env.PORT
const app = express()

connectDB()

app.get('/', (req, res) => {
    res.send('Estudo de estabilidade')
})

app.listen(PORT, () => {
    console.log(`\nServidor iniciado com sucesso!\n`)
    console.log(`URL -> http://localhost:${PORT}\n`)
});