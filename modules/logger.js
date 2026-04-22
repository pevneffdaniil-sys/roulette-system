const fs = require('fs');
const path = require('path');

const HISTORY_FILE = path.join(__dirname, '..', 'data', 'history.json');

function saveToHistory(participants, winner) {
    const record = {
        date: new Date().toLocaleDateString('ru-RU'),
        time: new Date().toLocaleTimeString('ru-RU'),
        participantsCount: participants.length,
        participants: participants.map(p => ({ id: p.id, name: p.name, contact: p.contact })),
        winner: { id: winner.id, name: winner.name, contact: winner.contact }
    };

    let history = [];
    if (fs.existsSync(HISTORY_FILE)) {
        try {
            const content = fs.readFileSync(HISTORY_FILE, 'utf-8');
            history = JSON.parse(content);
            if (!Array.isArray(history)) history = [];
        } catch (e) {
            history = [];
        }
    }

    history.push(record);
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf-8');
}

function loadHistory() {
    if (!fs.existsSync(HISTORY_FILE)) {
        return [];
    }
    const content = fs.readFileSync(HISTORY_FILE, 'utf-8');
    return JSON.parse(content);
}

module.exports = { saveToHistory, loadHistory };