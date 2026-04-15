const chalk = require('chalk');

/**
 * Задержка на ms миллисекунд
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Генерирует случайное целое число от min до max (включительно)
 */
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

/**
 * Имитация анимации "колеса фортуны" и выбор победителя
 * @param {Array} participants - массив участников
 * @returns {Promise<Object>} - объект победителя
 */
async function spinWheel(participants) {
    if (!participants || participants.length === 0) {
        throw new Error('Нет участников для розыгрыша');
    }

    const frames = ['◉', '◉', '●', '◉']; // кадры анимации
    const totalFrames = 20;               // количество итераций анимации

    console.log(chalk.cyan('\nЗапуск колеса фортуны...\n'));

    for (let i = 0; i < totalFrames; i++) {
        // Выбираем случайного участника для отображения в анимации
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        const frameSymbol = frames[i % frames.length];

        // Очищаем предыдущую строку и выводим новую
        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(
            `${frameSymbol}  ${chalk.yellow(randomParticipant.name)}  ${frameSymbol}`
        );

        // Замедление: время задержки увеличивается с каждой итерацией
        const delay = 50 + i * 15;
        await sleep(delay);
    }

    // Финальный выбор победителя
    const winner = participants[Math.floor(Math.random() * participants.length)];

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(chalk.green(`\n🎉 Победитель: ${winner.name} (${winner.contact}) 🎉\n`));

    return winner;
}

module.exports = { spinWheel };