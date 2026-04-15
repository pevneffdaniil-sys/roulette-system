const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

/**
 * Загружает список участников из файла (CSV или JSON)
 * @param {string} filePath - путь к файлу
 * @returns {Array<{id: number, name: string, contact: string}>}
 */
function loadParticipants(filePath) {
    const absolutePath = path.resolve(filePath);
    if (!fs.existsSync(absolutePath)) {
        throw new Error(`Файл ${absolutePath} не найден`);
    }

    const ext = path.extname(absolutePath).toLowerCase();
    const content = fs.readFileSync(absolutePath, 'utf-8');

    let participants = [];

    if (ext === '.json') {
        try {
            const jsonData = JSON.parse(content);
            if (!Array.isArray(jsonData)) {
                throw new Error('JSON должен содержать массив участников');
            }
            participants = jsonData;
        } catch (e) {
            throw new Error(`Ошибка парсинга JSON: ${e.message}`);
        }
    } else if (ext === '.csv') {
        try {
            const records = parse(content, {
                columns: true,
                skip_empty_lines: true,
                trim: true
            });
            participants = records;
        } catch (e) {
            throw new Error(`Ошибка парсинга CSV: ${e.message}`);
        }
    } else {
        throw new Error('Неподдерживаемый формат файла. Используйте .csv или .json');
    }

    // Валидация и нормализация данных
    if (participants.length === 0) {
        throw new Error('Список участников пуст');
    }

    participants = participants.map((p, index) => {
        // Приводим к единой структуре: id, name, contact
        return {
            id: p.id !== undefined ? Number(p.id) : index + 1,
            name: p.name?.toString().trim() || `Участник ${index + 1}`,
            contact: p.contact?.toString().trim() || p.email?.toString().trim() || 'не указан'
        };
    });

    // Проверка обязательных полей
    participants.forEach(p => {
        if (!p.name) throw new Error('У участника отсутствует имя');
    });

    return participants;
}

module.exports = { loadParticipants };