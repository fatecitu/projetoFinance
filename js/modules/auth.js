import {SUPABASE_URL, API_KEY} from './config.js'

//Login do usuário
export async function login(email, password) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
            'apikey': API_KEY,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password})
    })
    const data = await res.json()
    if(res.ok) {
        localStorage.setItem('sb_token', data.access_token)
        return true
    } else {
        throw new Error(data.msg || "Erro no login")
    }
}

