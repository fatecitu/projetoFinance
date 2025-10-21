import { login, logout } from "../modules/auth.js";

export function loginUi(){
    const form = document.getElementById('formLogin')
    if (!form) return //não encontrou o form?

    form.addEventListener('submit', async(e) => {
        e.preventDefault() //evita recarregar
        const email = document.getElementById('email').value
        const password = document.getElementById('password').value
        if(!email || !password){
            Swal.fire({
                icon: 'error',
                title: 'erro de login',
                text: 'É obrigatório informar o email e a senha para fazer o login',
                confirmButtonText: 'Tentar novamente'
            })
            return
        }
        try{
            await login(email, password)
            await Swal.fire({
                icon: 'success',
                title: 'Login bem sucedido!',
                text: 'Redirecionando para o menu...',
                showConfirmButton: false,
                timer: 1500
            })
            window.location.href = 'menu.html'
        } catch (err){
             Swal.fire({
                icon: 'error',
                title: 'Erro ao efetuar o login',
                text: err.msg || 'Erro no login',
                confirmButtonText: 'Tentar novamente'
             })
        }
    })
}

export function logoutUi(){
    document.getElementById('btnLogout').addEventListener('click', logout)
}
