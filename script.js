// Regex para validação de email
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

// Funções de validação
function validarNome(nome) {
    if (!nome || nome.trim() === '') {
        return { valido: false, mensagem: 'Nome é obrigatório' };
    }
    if (nome.length < 3 || nome.length > 50) {
        return { valido: false, mensagem: 'Nome deve ter entre 3 e 50 caracteres' };
    }
    return { valido: true, mensagem: '' };
}

function validarSobrenome(sobrenome) {
    if (!sobrenome || sobrenome.trim() === '') {
        return { valido: false, mensagem: 'Sobrenome é obrigatório' };
    }
    if (sobrenome.length < 3 || sobrenome.length > 50) {
        return { valido: false, mensagem: 'Sobrenome deve ter entre 3 e 50 caracteres' };
    }
    return { valido: true, mensagem: '' };
}

function validarEmail(email) {
    if (!email || email.trim() === '') {
        return { valido: false, mensagem: 'Email é obrigatório' };
    }
    if (!emailRegex.test(email.toLowerCase())) {
        return { valido: false, mensagem: 'Email deve ser válido' };
    }
    return { valido: true, mensagem: '' };
}

function validarIdade(idade) {
    if (!idade || idade === '') {
        return { valido: false, mensagem: 'Idade é obrigatória' };
    }
    const idadeNum = parseInt(idade);
    if (isNaN(idadeNum) || idadeNum <= 0 || idadeNum >= 120 || !Number.isInteger(idadeNum)) {
        return { valido: false, mensagem: 'Idade deve ser um número inteiro positivo menor que 120' };
    }
    return { valido: true, mensagem: '' };
}

// Validação em tempo real
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    
    if (form) {
        // Validação em tempo real
        const campos = ['nome', 'sobrenome', 'email', 'idade'];
        campos.forEach(campo => {
            const input = document.getElementById(campo);
            if (input) {
                input.addEventListener('blur', function() {
                    validarCampo(campo, this.value);
                });
                
                input.addEventListener('input', function() {
                    // Limpa mensagem de erro enquanto digita
                    const errorElement = document.getElementById(campo + 'Error');
                    if (errorElement) {
                        errorElement.textContent = '';
                    }
                });
            }
        });

        // Submissão do formulário
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const dados = {
                nome: document.getElementById('nome').value.trim(),
                sobrenome: document.getElementById('sobrenome').value.trim(),
                email: document.getElementById('email').value.trim(),
                idade: document.getElementById('idade').value.trim()
            };

            // Valida todos os campos
            const validacoes = {
                nome: validarNome(dados.nome),
                sobrenome: validarSobrenome(dados.sobrenome),
                email: validarEmail(dados.email),
                idade: validarIdade(dados.idade)
            };

            let formValido = true;

            // Exibe mensagens de erro
            Object.keys(validacoes).forEach(campo => {
                const validacao = validacoes[campo];
                const errorElement = document.getElementById(campo + 'Error');
                
                if (errorElement) {
                    errorElement.textContent = validacao.mensagem;
                    errorElement.style.display = validacao.valido ? 'none' : 'block';
                }
                
                if (!validacao.valido) {
                    formValido = false;
                }
            });

            // Se formulário válido, salva dados e redireciona
            if (formValido) {
                localStorage.setItem('dadosFormulario', JSON.stringify(dados));
                window.location.href = 'confirmation.html';
            }
        });
    }

    // Página de confirmação
    if (window.location.pathname.includes('confirmation.html')) {
        const dadosConfirmacao = document.getElementById('dadosConfirmacao');
        const btnConfirmar = document.getElementById('btnConfirmar');
        const btnCorrigir = document.getElementById('btnCorrigir');

        // Recupera dados do localStorage
        const dados = JSON.parse(localStorage.getItem('dadosFormulario') || '{}');

        if (dadosConfirmacao && Object.keys(dados).length > 0) {
            dadosConfirmacao.innerHTML = `
                <div class="data-item">
                    <strong>Nome:</strong> <span>${dados.nome}</span>
                </div>
                <div class="data-item">
                    <strong>Sobrenome:</strong> <span>${dados.sobrenome}</span>
                </div>
                <div class="data-item">
                    <strong>Email:</strong> <span>${dados.email}</span>
                </div>
                <div class="data-item">
                    <strong>Idade:</strong> <span>${dados.idade} anos</span>
                </div>
            `;
        }

        if (btnConfirmar) {
            btnConfirmar.addEventListener('click', function() {
                salvarDadosJSON(dados);
                
                alert('✅ Dados transmitidos com sucesso! Redirecionando para o Início...');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            });
        }

        if (btnCorrigir) {
            btnCorrigir.addEventListener('click', function() {
                window.location.href = 'form.html';
            });
        }
    }
});

function validarCampo(campo, valor) {
    let resultado;
    
    switch(campo) {
        case 'nome':
            resultado = validarNome(valor);
            break;
        case 'sobrenome':
            resultado = validarSobrenome(valor);
            break;
        case 'email':
            resultado = validarEmail(valor);
            break;
        case 'idade':
            resultado = validarIdade(valor);
            break;
        default:
            return;
    }

    const errorElement = document.getElementById(campo + 'Error');
    if (errorElement) {
        errorElement.textContent = resultado.mensagem;
        errorElement.style.display = resultado.valido ? 'none' : 'block';
    }
}

function salvarDadosJSON(dados) {
    localStorage.setItem('ultimoCadastro', JSON.stringify(dados));
    console.log('Dados salvos (simulação data.json):', dados);

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}