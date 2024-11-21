// public/js/login.js
document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        if (result.success) {
            alert('Login realizado com sucesso!');
        } else {
            alert(result.message || 'Erro no login.');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro no login.');
    }
});
