const form = document.getElementById("form-novo-ticket");

form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const formData = new FormData(form);
  const formDataJSON = Object.fromEntries(formData);
  const url = "http://localhost:3000/novoticket";
  const options = {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formDataJSON),
  };

  try {
    const resposta = await fetch(url, options);

    if (resposta.ok) {
      alert("Ticket criado com sucesso!");
      form.reset();
    } else {
      alert("Erro: Não foi possível criar o ticket.");
    }
  } catch (erro) {
    console.error("Erro na rede ou ao conectar com a API:", erro);
    alert("Erro de conexão. O servidor está rodando?");
  }
});