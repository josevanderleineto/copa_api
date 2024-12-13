import express from 'express';
import conexao from '../infra/conexao.js';

const app = express();

app.use(express.json());

// Função para buscar seleção por ID no banco de dados
function buscarSelecaoPorId(id) {
    const sql = 'SELECT * FROM selecoes WHERE id = ?';
    return new Promise((resolve, reject) => {
        conexao.query(sql, [id], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Conexão com o banco de dados
conexao.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
    } else {
        console.log('Conectado ao banco de dados');
    }
});

// Endpoint GET para listar todas as seleções
app.get('/selecoes', (_, res) => {
    const sql = 'SELECT * FROM selecoes';
    conexao.query(sql, (err, result) => {
        if (err) {
            res.status(404).send({ err: err });
        } else {
            res.status(200).send(result);
        }
    });
});

// Endpoint GET para buscar seleção por ID
app.get('/selecoes/:id', (req, res) => {
    const id = req.params.id;
    buscarSelecaoPorId(id)
        .then(result => {
            if (result.length > 0) {
                res.status(200).send(result[0]);
            } else {
                res.status(404).send({ message: 'Seleção não encontrada' });
            }
        })
        .catch(err => {
            res.status(500).send({ err: err });
        });
});

// Endpoint POST para adicionar uma nova seleção
app.post('/selecoes', (req, res) => {
    const { selecao, grupo } = req.body;

    if (!selecao || !grupo) {
        return res.status(400).json({ err: 'Seleção e grupo são obrigatórios' });
    }

    const sql = 'INSERT INTO selecoes (selecao, grupo) VALUES (?, ?)';

    conexao.query(sql, [selecao, grupo], (err, result) => {
        if (err) {
            res.status(400).json({ 'err': err });
        } else {
            res.status(201).json({
                id: result.insertId,
                selecao: selecao,
                grupo: grupo
            });
        }
    });
});

// Endpoint DELETE para deletar seleção por ID
app.delete('/selecoes/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'DELETE FROM selecoes WHERE id = ?';

    conexao.query(sql, [id], (err, result) => {
        if (err) {
            res.status(400).json({ 'err': err });
        } else if (result.affectedRows > 0) {
            res.status(200).send(`Seleção com id ${id} deletada com sucesso!`);
        } else {
            res.status(404).send({ message: 'Seleção não encontrada' });
        }
    });
});

// Endpoint PUT para atualizar seleção por ID
app.put('/selecoes/:id', (req, res) => {
    const id = req.params.id;
    const { selecao, grupo } = req.body;

    const sql = 'UPDATE selecoes SET selecao = ?, grupo = ? WHERE id = ?';

    conexao.query(sql, [selecao, grupo, id], (err, result) => {
        if (err) {
            res.status(400).json({ 'err': err });
        } else if (result.affectedRows > 0) {
            res.status(200).send(`Seleção com id ${id} atualizada com sucesso!`);
        } else {
            res.status(404).send({ message: 'Seleção não encontrada' });
        }
    });
});

export default app;
