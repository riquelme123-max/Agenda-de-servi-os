document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('formLogin');
            const mensagem = document.getElementById('mensagem');

            // Verificar se já está logado
            if (localStorage.getItem('usuarioLogado')) {
                window.location.href = 'dashboard.html';
            }

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value.trim();
                const senha = document.getElementById('senha').value.trim();

                if (!email || !senha) {
                    mostraMensagem('Preencha todos os campos.', false);
                    return;
                }

                // Simular validação (aceita qualquer email/senha válida)
                if (email && senha.length >= 4) {
                    localStorage.setItem('usuarioLogado', JSON.stringify({email, nome: email.split('@')[0]}));
                    mostraMensagem('Login realizado!', true);
                    setTimeout(() => window.location.href = 'dashboard.html', 1500);
                } else {
                    mostraMensagem('Email ou senha inválidos.', false);
                }
            });

            function mostraMensagem(texto, sucesso) {
                mensagem.textContent = texto;
                mensagem.className = 'mensagem ' + (sucesso ? 'sucesso' : 'erro');
                if (!sucesso) setTimeout(() => mensagem.textContent = '', 3000);
            }
        });