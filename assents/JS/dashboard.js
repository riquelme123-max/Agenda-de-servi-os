 document.addEventListener('DOMContentLoaded', function() {
            const usuarioLogado = localStorage.getItem('usuarioLogado');
            
            if (!usuarioLogado) {
                window.location.href = 'index.html';
                return;
            }

            const usuario = JSON.parse(usuarioLogado);
            document.getElementById('nomeUsuario').textContent = usuario.nome;
            document.getElementById('emailUsuario').textContent = usuario.email;
        });

        function logout() {
            localStorage.removeItem('usuarioLogado');
            window.location.href = 'index.html';
        }