const express = require('express');
const mysql = require('mysql');
const cors = require('cors'); 

const port = process.env.PORT || 3001
const conectar = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'Gerenciador'
});

const app =  express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE', 
  };
  app.use(cors(corsOptions));
app.get('/Tarefa/create', (req, res) => {
 
    conectar.query('SELECT * FROM tarefas',  (err, result) => {
        res.send(result)
    })
})
// pegando os dados para atualizar ou excluir
app.get('/Tarefa/create/:id', (req, res) => {
        const id = req.params.id; // Recupera a ID da tarefa da URL
        conectar.query(`SELECT * FROM tarefas WHERE id = ?`, [id], (err, result) => {
            if (err) {
                console.error('Erro ao buscar detalhes da tarefa:', err);
                res.status(500).send('Erro ao buscar detalhes da tarefa.');
            } else {
                if (result.length === 0) {
                    res.status(404).send('Tarefa não encontrada.');
                } else {
                    res.send(result[0]);
                }
            }
        });
    });
    //deletando do banco de dados
    app.delete('/Tarefa/delete/:id', (req, res) => {
        const id = req.params.id;
        const sql = 'DELETE FROM tarefas WHERE id = ?';
      
        conectar.query(sql, [id], (err, result) => {
          if (err) {
            console.error('Erro ao excluir a tarefa:', err);
            res.status(500).send('Erro ao excluir a tarefa.');
          } else {
            console.log('Tarefa excluída com sucesso!');
            res.status(200).send('Tarefa excluída com sucesso!');
          }
        });
      });
   
// adicionando ao banco de dados
app.post('/Tarefa/create', (req, res) => {
    const nomeTarefa = req.body.Nome;
    const tipoTarefa = req.body.Tipo;
   
        const sql = 'INSERT INTO tarefas (nome, tipo) VALUES (?, ?)';
        conectar.query(sql, [nomeTarefa, tipoTarefa], (err, result) => {
            if (err) {
                console.error('Erro ao inserir no banco de dados:', err);
                res.status(500).send('Erro ao inserir no banco de dados.');
            } else {
                console.log('Dados inseridos com sucesso!');
                res.status(200).send('Dados inseridos com sucesso!');
            }
        });
});
 app.put('/Tarefa/update/:id', (req, res) => {
    const id = req.params.id;
    const nomeTarefa = req.body.Nome;
    const tipoTarefa = req.body.Tipo;
        const sql = 'UPDATE tarefas SET nome = ?, tipo = ? WHERE id = ?';
      
        conectar.query(sql, [nomeTarefa, tipoTarefa, id], (err, result) => {
          if (err) {
            console.error('Erro ao Editar a tarefa:', err);
            res.status(500).send('Erro ao Editar a tarefa.');
          } else {
            console.log('Tarefa Editada com sucesso!');
            res.status(200).send('Tarefa Editada com sucesso!');
          }
        });
      });
      app.put('/Tarefa/create/:id', (req, res) => {
        const id = req.params.id;
        conectar.query('SELECT Status FROM tarefas WHERE id = ?', [id], (err, rows) => {
          if (err) {
            console.error('Erro ao obter o status da tarefa:', err);
            res.status(500).send('Erro ao obter o status da tarefa.');
            return;
          }
          if (rows.length === 0) {
            res.status(404).send('Tarefa não encontrada.');
            return;
          }
          const estadoAtual = rows[0].Status;
          let novoEstado;
      
          if (estadoAtual === 'Realizada') {
            novoEstado = 'Não Realizada';
          } else {
            novoEstado = 'Realizada';
          }
            const sql = 'UPDATE tarefas SET Status = ? WHERE id = ?';
          
            conectar.query(sql, [novoEstado,  id], (err, result) => {
              if (err) {
                console.error('Erro ao mudar o status da tarefa:', err);
                res.status(500).send('Erro ao mudar o status a tarefa.');
              } else {
                console.log('status mudado com sucesso!');
                res.status(200).send('status mudado com sucesso!');
              }
            });
          });
        });
app.listen('3030', () => {
    console.log('Processando...');
})