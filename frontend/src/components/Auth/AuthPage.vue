<template>
    <div class="auth-content">
        <div class="auth-modal">
            <div class="auth-content-align">
                <img src="@/assets/signin.png">
                <div class="auth-title">
                    <h1>{{ showSignup ? 'Cadastro' : 'Login' }}</h1>
                </div>
            </div>
            <hr>
            <div class="auth-column-inputs">
                <input v-if="showSignup" v-model="user.name" type="text" placeholder="Nome" name="name">
                <input v-model="user.email" type="text" placeholder="E-mail" name="email">
                <input v-if="showSignup" v-model="user.phone" type="text" placeholder="Phone" name="phone">
                <input v-if="showSignup" v-model="user.cpf" type="text" placeholder="CPF" name="cpf">
                <input v-model="user.password" type="password" placeholder="Senha" name="password">
                <input v-if="showSignup" v-model="user.confirmPassword" type="password" placeholder="Confirme a Senha">
            </div>
            <div class="auth-column-buttons">
                <button v-if="showSignup" @click="signup">Registrar</button>
                <button v-else @click="signin">Entrar</button>
            </div>
            <a class="d-flex justify-content-center mt-3" href @click.prevent="showSignup = !showSignup">
                <span v-if="showSignup">Já tem cadastro? Acesse o Login!</span>
                <span v-else>Não tem cadastro? Registre-se aqui!</span>
            </a>
        </div>
    </div>
</template>

<script>
import { baseApiUrl, userKey } from '@/global';
import axios from 'axios';
import toastMsgs from '@/config/msgs'

export default {
    name: 'AuthPage',
    data: function() {
        return {
            showSignup: false,
            user: {}
        }
    },
    methods: {
        signin() {
            axios.post(`${baseApiUrl}/signin`, this.user)
                .then(res => {
                    this.$store.commit('setUser', res.data)
                    localStorage.setItem(userKey, JSON.stringify(res.data))
                    this.$router.push({path: '/'})
                }).catch((e) => {
                    toastMsgs.defaultError(this,    e.response.data)
                })
        },
        signup() {
            axios.post(`${baseApiUrl}/signup`, this.user)
                .then(() => {
                    toastMsgs.defaultSuccess(this, 'Registro feito com sucesso!')
                    this.user = {}
                    this.showSignup = false
                }).catch((e) => {
                    toastMsgs.defaultError(this, e.response.data)
                })
        }
    }
}
</script>

<style>
    .auth-content {
        border-radius: 10px;
        background: rgba(0,0,0,0.45);
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .auth-modal {
        background-color: #fff;
        width: 350px;
        padding: 35px;
        box-shadow: 0 1px 5px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        align-items: column;
    }

    .auth-content-align {
        display: flex;
        align-items: center;
        justify-content: left;
    }
    

    .auth-column-inputs {
        display: flex;
        flex-direction: column;
    }

    .auth-column-buttons {
        display: flex;
        justify-content: center;
        margin-top: 10%;
    }

    .auth-column-buttons button{
        background-color: rgba(11,10,33,1);
        border: none;
        color: white;
        padding: 20px 60px 20px 60px;
        text-align: center;
        cursor: pointer;
        text-decoration: none;
        border-radius: 8px;
    }

    img {
        margin-right: 5%;
        height: 50px;
    }

    .justify-content-center {
        text-decoration: none;
        color: white;
    }

    .justify-content-center span:hover {
        color: black;
    }
</style>