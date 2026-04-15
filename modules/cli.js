const inquirer = require('inquirer');
const chalk = require('chalk');
const { loadParticipants } = require('./loader');
const { spinWheel } = require('./roulette');
const { saveToHistory, loadHistory } = require('./logger');

/**
 * Главное меню
 */
async function mainMenu() {
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'Выберите действие:',
                choices: [
                    { name: '🎲 Запустить розыгрыш', value: 'spin' },
                    { name: '📜 Просмотреть историю', value: 'history' },
                    { name: '🚪 Выход', value: 'exit' }
                ]
            }
        ]);

        switch (action) {
            case 'spin':
                await runRoulette();
                break;
            case 'history':
                await showHistory();
                break;
            case 'exit':
                console.log(chalk.blue('До свидания!'));
                return;
        }
    }
}

/**
 * Запуск розыгрыша: запрос файла, загрузка, анимация, сохранение истории
 */
async function runRoulette() {
    try {
        const { filePath } = await inquirer.prompt([
            {
                type: 'input',
                name: 'filePath',
                message: 'Введите путь к файлу с участниками (CSV или JSON):',
                validate: input => input.trim() !== '' || 'Путь не может быть пустым',
                default: './data/participants.csv'
            }
        ]);

        console.log(chalk.blue(`Загрузка участников из ${filePath}...`));
        const participants = loadParticipants(filePath);
        console.log(chalk.green(`Загружено участников: ${participants.length}`));

        const winner = await spinWheel(participants);

        // Сохраняем в историю
        saveToHistory(participants, winner);
        console.log(chalk.green('Результат сохранён в историю.'));

    } catch (error) {
        console.error(chalk.red(`Ошибка: ${error.message}`));
    }
}

/**
 * Просмотр истории розыгрышей
 */
async function showHistory() {
    try {
        const history = loadHistory();
        if (history.length === 0) {
            console.log(chalk.yellow('История розыгрышей пуста.'));
            return;
        }

        console.log(chalk.cyan('\n=== ИСТОРИЯ РОЗЫГРЫШЕЙ ===\n'));
        history.forEach((record, index) => {
            console.log(chalk.white(`Запись #${index + 1}`));
            console.log(`  Дата: ${record.date} ${record.time}`);
            console.log(`  Участников: ${record.participantsCount}`);
            console.log(chalk.green(`  Победитель: ${record.winner.name} (${record.winner.contact})`));
            console.log('---');
        });
        console.log(chalk.cyan('=== КОНЕЦ ИСТОРИИ ===\n'));

    } catch (error) {
        console.error(chalk.red(`Ошибка при чтении истории: ${error.message}`));
    }
}

module.exports = { mainMenu };