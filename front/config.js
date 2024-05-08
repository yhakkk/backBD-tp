// Capturar el formulario por su ID
const form = document.getElementById('form-crear-usuario');

// Agregar evento 'submit' para enviar los datos usando Axios
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevenir el comportamiento predeterminado de recargar la página
    
    // Tomar los valores de los campos del formulario
    const usuario = document.getElementById('usuario').value;
    const pass = document.getElementById('pass').value;
    const nombre = document.getElementById('nombre').value;
    const apellido = document.getElementById('apellido').value;

    try {
        // Hacer una solicitud POST con Axios
        const response = await axios.post('http://localhost:3005/crear_usuario', {
            usuario,
            pass,
            nombre,
            apellido
        });

        // Acciones a tomar después de la solicitud exitosa (como mostrar un mensaje)
        console.log('Usuario creado:', response.data);

        // Por ejemplo, redirigir a una página de éxito
        // window.location.href = '/usuario_creado';
    } catch (error) {
        console.error('Error al crear el usuario:', error);

        // Manejar errores (como mostrar un mensaje al usuario)
        // Ejemplo: alert('Error al crear el usuario');
    }
});
