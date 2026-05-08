let agendamentoEmEdicao = null;

document.addEventListener('DOMContentLoaded', function () {
    const usuarioLogado = localStorage.getItem('usuarioLogado');

    if (!usuarioLogado) {
        window.location.href = 'index.html';
        return;
    }

    const usuario = JSON.parse(usuarioLogado);
    renderizarAgendamentos(usuario.email);
});

function renderizarAgendamentos(emailUsuario) {
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    const meus = agendamentos.filter(a => a.emailUsuario === emailUsuario);

    const container = document.getElementById('listaAgendamentos');

    if (meus.length === 0) {
        container.innerHTML = `
            <div class="vazio">
                <p>Você não possui agendamentos</p>
                <button onclick="window.location.href='agendamento.html'">
                    Novo Agendamento
                </button>
            </div>
        `;
        return;
    }

    meus.sort((a, b) =>
        new Date(`${a.data}T${a.hora}`) - new Date(`${b.data}T${b.hora}`)
    );

    container.innerHTML = meus.map(a => `
        <div class="agendamento-card">

            <img src="${a.foto}" class="foto-cliente" />

            <div class="agendamento-info">
                <p><b>Cliente:</b> ${a.nome}</p>
                <p><b>Serviço:</b> ${traduzir(a.servico)}</p>
                <p><b>Telefone:</b> ${formatarTelefone(a.telefone)}</p>
                <p><b>Data:</b> ${formatarData(a.data)}</p>
                <p><b>Hora:</b> ${a.hora}</p>
            </div>

            <div class="botoes-agendamento">
                <button onclick="abrirModalReagendar(${a.id})">
                    Reagendar
                </button>

                <button onclick="desmarcar(${a.id})">
                    Desmarcar
                </button>
            </div>

        </div>
    `).join('');
}

function traduzir(servico) {
    return {
        corte: 'Corte',
        barba: 'Barba',
        corte_barba: 'Corte + Barba'
    }[servico] || servico;
}

function formatarData(data) {
    const [y, m, d] = data.split('-');
    return `${d}/${m}/${y}`;
}

function formatarTelefone(tel) {
    if (!tel) return 'Não informado';
    let v = tel.replace(/\D/g, '');

    if (v.length === 11) {
        return v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    }

    return tel;
}

function desmarcar(id) {
    let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

    agendamentos = agendamentos.filter(a => a.id !== id);

    localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    renderizarAgendamentos(usuario.email);
}

/* =======================
   🔥 REAGENDAR
======================= */

function abrirModalReagendar(id) {
    agendamentoEmEdicao = id;
    document.getElementById('modalReagendar').style.display = 'block';
}

function fecharModal() {
    document.getElementById('modalReagendar').style.display = 'none';
    agendamentoEmEdicao = null;
}

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

    const usuario = JSON.parse(localStorage.getItem('usuarioLogado'));

    renderizarAgendamentos(usuario.email);
});