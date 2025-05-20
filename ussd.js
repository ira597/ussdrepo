const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const db = new sqlite3.Database('./ussd.db');

app.post('/ussd', (req, res) => {
    const { sessionId, phoneNumber, text } = req.body;
    const input = text.split('*');
    const level = input.length;
    let response = '';

    // Save session if new
    db.get("SELECT * FROM sessions WHERE sessionID = ?", [sessionId], (err, row) => {
        if (!row) {
            db.run("INSERT INTO sessions (sessionID, phoneNumber, userInput) VALUES (?, ?, ?)",
                [sessionId, phoneNumber, text]);
        } else {
            db.run("UPDATE sessions SET userInput = ? WHERE sessionID = ?", [text, sessionId]);
        }
    });

    // Language Selection
    if (text === '') {
        response = `CON Welcome / Karibu\n1. English\n2. Swahili`;
    } else if (text === '1') {
        response = `CON Main Menu:\n1. Buy Shoes\n2. View Orders\n0. Back`;
    } else if (text === '2') {
        response = `CON Menyu Kuu:\n1. Nunua Viatu\n2. Angalia Oda\n0. Rudi`;
    } else if (text === '1*1' || text === '2*1') {
        response = `CON Choose Shoe:\n1. Nike\n2. Adidas`;
    } else if (level === 3) {
        response = `CON Enter quantity:`;
    } else if (level === 4) {
        const shoe_model = input[2] === '1' ? 'Nike' : 'Adidas';
        const quantity = parseInt(input[3]);

        db.run(`INSERT INTO transactions (phoneNumber, shoe_model, quantity) VALUES (?, ?, ?)`,
            [phoneNumber, shoe_model, quantity]);

        response = `END Order for ${quantity} ${shoe_model}(s) received. Thank you!`;
    } else {
        response = `END Invalid input. Try again.`;
    }

    res.set('Content-Type', 'text/plain');
    res.send(response);
});

app.listen(3000, () => console.log("USSD app running on port 3000"));
