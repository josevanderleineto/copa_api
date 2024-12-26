import app from "./src/app.js";
// import conexao from "./src/app/db/conexao.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});