document.addEventListener('DOMContentLoaded', function () {
            const usuarioLogado = localStorage.getItem('usuarioLogado');
            if (!usuarioLogado) {
                window.location.href = 'index.html';
                return;
            }

            const usuario = JSON.parse(usuarioLogado);
            document.getElementById('nome').value = usuario.nome;

            const form = document.getElementById('formAgendamento');
            const mensagem = document.getElementById('mensagem');

            // Define data mínima como hoje
            const hoje = new Date().toISOString().split('T')[0];
            document.getElementById('data').min = hoje;

            form.addEventListener('submit', function (e) {
                e.preventDefault();

                const nome = document.getElementById('nome').value.trim();
                const servico = document.getElementById('servico').value;
                const data = document.getElementById('data').value;
                const hora = document.getElementById('hora').value;
                const telefone = document.getElementById('telefone').value.trim();

                const novoAgendamento = {
                    id: Date.now(),
                    emailUsuario: usuario.email,
                    servico,
                    data,
                    hora,
                    telefone // 👈 novo campo
                };

                if (!nome || !servico || !data || !hora) {
                    mostraMensagem('Todos os campos são obrigatórios.', false);
                    return;
                }

                const dataHora = new Date(`${data}T${hora}`);
                if (dataHora < new Date()) {
                    mostraMensagem('Data e horário devem ser no futuro.', false);
                    return;
                }

                let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

                // Verificar conflito de horário
                const conflito = agendamentos.some(a => a.data === data && a.hora === hora && a.emailUsuario === usuario.email);
                if (conflito) {
                    mostraMensagem('Você já tem um agendamento nesse horário.', false);
                    return;
                }

                const agendamento = {
                    id: Date.now(),
                    nome,
                    servico,
                    data,
                    hora,
                    telefone,
                    emailUsuario: usuario.email,
                    dataAgendamento: new Date().toISOString()
                };

                agendamentos.push(agendamento);
                localStorage.setItem('agendamentos', JSON.stringify(agendamentos));


                mostraMensagem('Agendamento realizado com sucesso!', true);
                setTimeout(() => window.location.href = 'meus-agendamentos.html', 1500);
            });

            function mostraMensagem(texto, sucesso) {
                mensagem.textContent = texto;
                mensagem.className = 'mensagem ' + (sucesso ? 'sucesso' : 'erro');
            }
        });