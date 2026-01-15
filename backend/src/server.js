const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(express.json());
app.use(cors());

const PORTA = 3000;

const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASSWORD,
    database:process.env.DB_DATABASE
});

db.connect((erro) => {
    if (erro) {
        console.error("Erro ao conectar ao DB:", erro);
    } else {
        console.log("Conectado ao MySQL!");
    }
});

app.get('/', (requisicao, resposta) => {
    resposta.send("API está funcionando!");
});

app.post('/novoticket', (requisicao, resposta) => {
    const {assunto, mensagem, tipo_problema, nivel_urgencia, setor, usuario,} = requisicao.body;

    const sqlTicket = "INSERT INTO tickets (assunto, data_criacao, status, responsavel, tipo_problema, nivel_urgencia, setor, usuario) VALUES (?, NOW(), 'Aberto', 'Não Atribuído', ?, ?, ?, ?)";
    const dadosTicket = [assunto, tipo_problema, nivel_urgencia, setor, usuario];

    db.query(sqlTicket, dadosTicket, (erro, resultados) => {
        if (erro) {
            console.error("Erro ao inserir dados na DB:", erro);
            return resposta.status(500).send("Erro ao criar o ticket.");
        }

        const novoTicketId = resultados.insertId;
        const sqlMensagem = "INSERT INTO mensagens (ticket_id, autor, conteudo) VALUES (?, ?, ?)";
        const dadosMensagem = [novoTicketId, usuario, mensagem];

        db.query(sqlMensagem, dadosMensagem, (erro_msg) => {

            if (erro_msg) {
                console.error("Erro ao salvar mensagem:", erro_msg);
                return resposta.status(500).send("Erro ao salvar a mensagem do ticket.");
            }

            resposta.status(201).send("Ticket e mensagem criados com sucesso!");
        });
    });
});

app.get('/tickets', (requisicao, resposta) => {

    const sql = "SELECT * FROM tickets ORDER BY data_criacao DESC"

    db.query(sql, (erro, resultado) => {
        if (erro) {
            console.error("Erro ao buscar tickets:", erro);
            return resposta.status(500).send("Erro ao buscar tickets.");
        }
        return resposta.status(200).send(resultado);
    })
});

app.get('/ticket/:id', (requisicao, resposta) => {

    const ticketId = requisicao.params.id;
    const sqlTicket = `SELECT * FROM tickets WHERE id = ?;`
    const dadosTicket = [ticketId];

    db.query(sqlTicket, dadosTicket, (erroTicket, resultadosTicket) => {
        if (erroTicket) {
                console.error("Erro ao buscar ticket:", erroTicket);
                return resposta.status(500).send("Erro ao buscar ticket.");
            }

        if (resultadosTicket.length === 0) {
            return resposta.status(404).send("Ticket não encontrado.");
        };
        
        const ticketInfo = resultadosTicket[0];
        const sqlMensagens = "SELECT * FROM mensagens WHERE ticket_id = ?"
        const dadosMensagens = [ticketId]
        db.query(sqlMensagens, dadosMensagens, (erroMensagens, resultadoMensagens) => {

            if (erroMensagens) return resposta.status(500).send("Erro ao buscar mensagens.");

            ticketInfo.mensagens = resultadoMensagens;

            return resposta.status(200).send(ticketInfo);

        });
    });
});
        

app.listen(PORTA, () => {
    console.log(`Servidor rodando na porta ${PORTA}`);
});