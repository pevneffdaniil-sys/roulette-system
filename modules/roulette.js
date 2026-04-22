const chalk = require('chalk');

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function spinWheel(participants) {
    if (!participants || participants.length === 0) {
        throw new Error('Нет участников для розыгрыша');
    }

    const frames = ['◉', '◉', '●', '◉'];
    const totalFrames = 20;

    console.log(chalk.cyan('\nЗапуск колеса фортуны...\n'));

    for (let i = 0; i < totalFrames; i++) {
        const randomParticipant = participants[Math.floor(Math.random() * participants.length)];
        const frameSymbol = frames[i % frames.length];

        process.stdout.clearLine(0);
        process.stdout.cursorTo(0);
        process.stdout.write(
            `${frameSymbol}  ${chalk.yellow(randomParticipant.name)}  ${frameSymbol}`
        );

        const delay = 50 + i * 15;
        await sleep(delay);
    }

    const winner = participants[Math.floor(Math.random() * participants.length)];

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    console.log(chalk.green(`\n🎉 Победитель: ${winner.name} (${winner.contact}) 🎉\n`));

    return winner;
}

module.exports = { spinWheel };