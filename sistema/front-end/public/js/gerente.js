document.addEventListener('DOMContentLoaded', function() {

    // 1. Exibir uma mensagem de boas-vindas
    function exibirMensagemBoasVindas() {
        const nomeGerente = "ADMIN"; // Aqui você pode personalizar ou pegar o nome do gerente via sistema
        alert(`Bem-vindo ao Painel do Gerente, ${nomeGerente}!`);
    }

    exibirMensagemBoasVindas();

    // 2. Confirmar saída
    const btnSair = document.querySelector('a[href="#"]'); // O link de "Sair"
    if (btnSair) {
        btnSair.addEventListener('click', function(event) {
            event.preventDefault(); // Previne o comportamento padrão de navegação
            const sairConfirmado = confirm("Você tem certeza que deseja sair?");
            if (sairConfirmado) {
                // Redireciona para a página de login ou outra página de saída
                window.location.href = 'login.html'; // ou qualquer página de logout
            }
        });
    }

    // 3. Ação de navegação com mensagens ou ações específicas
    const linksGerente = document.querySelectorAll('.opcoes-gerente a');
    linksGerente.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault(); // Previne a navegação imediata
            const acao = link.getAttribute('href');
            switch (acao) {
                case "relatorio_aluno.html":
                    alert("Você está acessando os Relatórios dos alunos.");
                    break;
                case "assinatura.html":
                    alert("Você está acessando as assinaturas dos alunos.");
                    break;
                case "nivel.html":
                    alert("Você está acessando os níveis dos alunos.");
                    break;
                default:
                    alert("Página desconhecida.");
            }
            // Após a mensagem de alerta, podemos redirecionar o usuário
            setTimeout(() => {
                window.location.href = acao; // Navega para a página desejada
            }, 1000); // 1 segundo após o alerta
        });
    });

});
