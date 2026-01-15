async function carregarTickets(){
    const url = "http://localhost:3000/tickets";
    try {
        const resposta = await fetch(url);
        const respostaJSON = await resposta.json();
        const tabela = document.getElementById("tabela-tickets");

        for(let i = 0; i < respostaJSON.length; i++){

            const ticket = respostaJSON[i];
            const linhaHTML = `
                <tr>
                    <td>${ticket.id}</td>
                    <td>${ticket.assunto}</td>
                    <td>${ticket.data_criacao}</td>
                    <td>${ticket.status}</td>
                    <td>${ticket.nivel_urgencia}</td>
                    <td>
                        <a href="detalhes.html?id=${ticket.id}" class="btn-acao">Ver</a>
                    </td>
                </tr>
            `;

            tabela.innerHTML += linhaHTML;

        }
    } catch (erro) {
        console.error("Erro ao carregar tickets:", erro);
        alert("Erro ao buscar a lista de tickets.");
    };
};

document.addEventListener("DOMContentLoaded", carregarTickets);