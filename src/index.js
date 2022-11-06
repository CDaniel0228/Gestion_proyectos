const app = require("./app");

async function main() {
  app.listen(3000);
  console.log(`Server funcionando en http://localhost:3000`);
}

main();
