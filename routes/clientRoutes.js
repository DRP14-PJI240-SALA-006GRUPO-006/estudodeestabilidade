const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/login.html'));
});
router.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/register.html'));
});
router.get('/studies', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/studies.html'));
});
router.get('/studies/create', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/create-study.html'));
});
router.get('/studies/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/view-study.html'));
});

module.exports = router;
