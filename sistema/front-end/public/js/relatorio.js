// public/js/relatorio.js
document.getElementById('relatorio-aluno').addEventListener('submit', async function(event) {
    event.preventDefault();  // Impede o envio tradicional do formulário
    
    const cpf = document.getElementById('cpf').value.trim();  // Captura o CPF inserido

    // Valida o CPF (pode adicionar validações mais complexas aqui)
    if (!cpf) {
        alert("Por favor, insira um CPF válido.");
        return;
    }

    const data = { cpf: cpf };  // Prepara os dados para envio

    try {
        // Envia os dados para o servidor usando uma requisição POST
        const response = await fetch('http://localhost:3000/relatorio', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        // Espera a resposta do servidor
        const result = await response.json();
        
        if (result.success) {
            // Preenche os dados do relatório
            document.getElementById('nome-relatorio').textContent = result.nome;
            document.getElementById('data-nasc-relatorio').textContent = result.data_nasc;
            document.getElementById('telefone-relatorio').textContent = result.telefone;
            document.getElementById('email-relatorio').textContent = result.email;
            document.getElementById('genero-relatorio').textContent = result.genero;
            document.getElementById('peso-relatorio').textContent = result.peso;
            document.getElementById('altura-relatorio').textContent = result.altura;

            // Exibe o relatório
            document.getElementById('resultado-relatorio').style.display = 'block';
        } else {
            // Caso o servidor retorne um erro
            alert(result.message || 'Erro ao buscar o relatório.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar o relatório.');
    }
});
