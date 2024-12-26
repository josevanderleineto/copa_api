import express from 'express';
// import conexao from './app/db/conexao.js';
import selecaoController from './app/controllers/SelecaoController.js';
import SelecaoController from './app/controllers/SelecaoController.js';

const app = express();

app.use(express.json());

app.get('/selecoes', SelecaoController.index);
app.get('/selecoes/:id', SelecaoController.show);
app.post('/selecoes', selecaoController.store);
app.put('/selecoes/:id', selecaoController.update); 
app.delete('/selecoes/:id', selecaoController.delete);

export default app;
