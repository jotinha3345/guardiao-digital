const app = require("./app");

const port = process.env.PORT || 3333;

app.listen(port, () => {
  console.log(`Guardiao Digital API rodando em http://localhost:${port}`);
});
