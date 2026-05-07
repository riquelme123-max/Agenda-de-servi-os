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

    const hoje = new Date().toISOString().split('T')[0];
    document.getElementById('data').min = hoje;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('nome').value.trim();
        const servico = document.getElementById('servico').value;
        const data = document.getElementById('data').value;
        const hora = document.getElementById('hora').value;
        const telefone = document.getElementById('telefone').value.trim();

        if (!nome || !servico || !data || !hora) {
            mostrarMensagem('Todos os campos são obrigatórios.', false);
            return;
        }

        const dataHora = new Date(`${data}T${hora}`);
        if (dataHora < new Date()) {
            mostrarMensagem('Data e horário devem ser no futuro.', false);
            return;
        }

        let agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || [];

        const conflito = agendamentos.some(a =>
            a.data === data &&
            a.hora === hora &&
            a.emailUsuario === usuario.email
        );

        if (conflito) {
            mostrarMensagem('Você já tem um agendamento nesse horário.', false);
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
            dataAgendamento: new Date().toISOString(),

            // 📸 foto automática
            foto: `https://randomuser.me/api/portraits/men/${Math.floor(Math.random() * 99)}.jpg`
        };

        agendamentos.push(agendamento);
        localStorage.setItem('agendamentos', JSON.stringify(agendamentos));

        mostrarMensagem('Agendamento realizado com sucesso!', true);

        setTimeout(() => {
            window.location.href = 'meus-agendamentos.html';
        }, 1500);
    });

    function mostrarMensagem(texto, sucesso) {
        mensagem.textContent = texto;
        mensagem.className = 'mensagem ' + (sucesso ? 'sucesso' : 'erro');
    }
});