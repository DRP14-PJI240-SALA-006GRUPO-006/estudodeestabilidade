document.getElementById('create-study-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.day0 = {
        aspect: formData.get('day0[aspect]'),
        color: formData.get('day0[color]'),
        odor: formData.get('day0[odor]'),
        viscosity: formData.get('day0[viscosity]'),
        ph: formData.get('day0[ph]'),
        density: formData.get('day0[density]')
    };

    // Tratamento de campos booleanos e comentários
    data.approved = formData.get('approved') ? true : false;

    const commentText = formData.get('comment[text]');
    const commentCreatedBy = formData.get('comment[createdBy]');
    if (commentText && commentCreatedBy) {
        data.comments = [{ text: commentText, createdBy: commentCreatedBy }];
    }

    const token = sessionStorage.getItem('token');
    console.log(token)
    if (!token) {
        alert('Você precisa estar logado para criar um estudo.');
        window.location.href = '/login';
        return;
    }

    const response = await fetch('/api/studies', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': `${token}`
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (response.ok) {
        alert('Estudo criado com sucesso!');
        window.location.href = '/studies';
    } else {
        alert('Falha ao criar o estudo: ' + result.msg);
    }
});

// Função para verificar a expiração do token
function checkTokenExpiration() {
    const expirationTime = sessionStorage.getItem('tokenExpiration');
    if (expirationTime && new Date().getTime() > expirationTime) {
        // Remove o token se expirado
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('tokenExpiration');
        alert('Sua sessão expirou. Por favor, faça login novamente.');
        window.location.href = '/login';
    }
}

// Verifica a expiração do token ao carregar a página
window.onload = checkTokenExpiration;