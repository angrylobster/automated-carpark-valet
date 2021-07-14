import { Parker } from './src/parker';
const filePath = process.argv[2];

const parker = new Parker();
(async () => {
    await parker.run(filePath);
    console.log(parker.getLogs());
})();
