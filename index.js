const { mainMenu } = require('./modules/cli');

console.log('Добро пожаловать в Систему розыгрыша призов!');
mainMenu().catch(err => {
    console.error('Критическая ошибка:', err);
    process.exit(1);
});