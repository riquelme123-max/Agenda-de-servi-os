document.addEventListener('DOMContentLoaded', function () {
            const usuarioLogado = localStorage.getItem('usuarioLogado');
            if (!usuarioLogado) {
                window.location.href = 'index.html';
                return;
            }

            const usuario = JSON.parse(usuarioLogado);
            renderizarAgendamentos(usuario.email);
        });

        async function renderizarAgendamentos(emailUsuario) {
            let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

            agendamentos = agendamentos.map(a => ({
                ...a,
                telefone: a.telefone || ''
            }));

            const meuAgendamentos = agendamentos.filter(a => a.emailUsuario === emailUsuario);
            const container = document.getElementById('listaAgendamentos');

            if (meuAgendamentos.length === 0) {
                container.innerHTML = `<div class="vazio">
                    <p>Você não possui agendamentos</p>
                    <button class="btn-novo-agendamento" onclick="window.location.href='agendamento.html'">Novo Agendamento</button>
                </div>`;
                return;
            }

            meuAgendamentos.sort((a, b) => new Date(`${a.data}T${a.hora}`) - new Date(`${b.data}T${b.hora}`));

            container.innerHTML = meuAgendamentos.map(agendamento => `
            <div class="agendamento-card">
                <div class="agendamento-info">

                    <div class="info-linha">
                        <span class="label">Cliente:</span>
                        <span class="valor">${agendamento.nome}</span>
                    </div>

                    <div class="info-linha">
                        <span class="label">Serviço:</span>
                        <span class="valor">${traduzirServico(agendamento.servico)}</span>
                    </div>

                    <div class="info-linha">
                        <span class="label">Telefone:</span>
                        <span class="valor">${formatarTelefone(agendamento.telefone)}</span>
                    </div>

                    <div class="info-linha">
                        <span class="label">Data:</span>
                        <span class="valor">${formatarData(agendamento.data)}</span>
                    </div>

                    <div class="info-linha">
                        <span class="label">Horário:</span>
                        <span class="valor">${agendamento.hora}</span>
                    </div>

                </div>

                <div class="botoes-agendamento">
                    <button class="btn-editar" onclick="abrirModalReagendar(${agendamento.id})">Reagendar</button>
                    <button class="btn-desmarcar" onclick="desmarcarAgendamento(${agendamento.id})">Desmarcar</button>
                </div>
            </div>
        `).join('');
        }

        function traduzirServico(servico) {
            return {
                'corte': 'Corte',
                'barba': 'Barba',
                'corte_barba': 'Corte + Barba'
            }[servico] || servico;
        }

        function formatarData(data) {
            const [ano, mes, dia] = data.split('-');
            return `${dia}/${mes}/${ano}`;
        }

        function formatarTelefone(tel) {
            if (!tel) return 'Não informado';

            let v = tel.replace(/\D/g, '');
            if (v.length === 11) {
                return v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
            }
            return tel;
        }

        function desmarcarAgendamento(id) {
            let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];
            agendamentos = agendamentos.filter(a => a.id !== id);
            localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            renderizarAgendamentos(usuarioLogado.email);
        }

        // ✅ ABRIR MODAL
        function abrirModalReagendar(id) {
            agendamentoEmEdicao = id;
            document.getElementById('modalReagendar').style.display = 'block';
        }

        // ✅ FECHAR MODAL
        function fecharModal() {
            document.getElementById('modalReagendar').style.display = 'none';
        }

        // ✅ SALVAR REAGENDAMENTO
        document.getElementById('formReagendar').addEventListener('submit', function (e) {
            e.preventDefault();

            const novaData = document.getElementById('novaData').value;
            const novaHora = document.getElementById('novaHora').value;

            let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

            agendamentos = agendamentos.map(a => {
                if (a.id === agendamentoEmEdicao) {
                    return {
                        ...a,
                        data: novaData,
                        hora: novaHora
                    };
                }
                return a;
            });

            localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

            fecharModal();

            const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
            renderizarAgendamentos(usuarioLogado.email);
        });