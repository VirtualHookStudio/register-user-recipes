<template>
    <div class="edit-profile-page">
        <form>
            <br><br>
            <div class="row justify-content-center">
                <div class="col-6 d-flex justify-content-center">
                    <img class="rounded-circle" type="file" :src="previewImage" @click.prevent="triggerFileInput">
                    <input type="file" ref="imageFileInput" id="user-img-location" accept = ".jpg, .png, .jpeg" @change="onImageSelected" :disabled="mode !== 'edit'" hidden>
                </div>
            </div>
            <br><br>
            <div class="row justify-content-center">
                <div class="col-6">
                    <label for="validationServer01">Nome de usuário</label>
                    <input type="text" class="form-control" id="user-name" v-model="user.name" :disabled="mode !== 'edit'"/>
                </div>
            </div>
            <br>
            <div class="row justify-content-center">
                <div class="col-6">
                    <label for="validationServer02">Email</label>
                    <input type="text" class="form-control" id="user-email" v-model="user.email" :disabled="mode !== 'edit'"/>
                </div>
            </div>
            <br>
            <div class="row justify-content-center">
                <div class="col-6">
                    <label for="validationServer03">Número de telefone</label>
                    <input type="text" class="form-control" id="user-phone" v-model="user.phone" :disabled="mode !== 'edit'"/>
                </div>
            </div>
            <br>
            <div class="row justify-content-center">
                <div class="col-6">
                    <label for="validationServer04">CPF</label>
                    <input type="text" class="form-control" id="user-cpf" v-model="user.cpf" :disabled="mode !== 'edit'"/>
                </div>
            </div>
            <div v-if="mode === 'edit'">
                <br>
                <div class="row justify-content-center">
                    <div class="col-6">
                        <label for="validationServer05">Senha (opcional)</label>
                        <input type="password" v-model="user.password" class="form-control" name="password" placeholder="Senha" autocomplete="on">
                    </div>
                </div>
                <br>
                <div class="row justify-content-center">
                    <div class="col-6">
                        <label for="validationServer06">Confirmação de Senha (opcional)</label>
                        <input type="password" v-model="user.confirmPassword" class="form-control" name="user-confirmPassword" placeholder="Confirme a Senha" autocomplete="on">
                    </div>
                </div>
            </div>
            <br><br>
            <div class="d-flex justify-content-center">
                <div class="btn-group col-6 mleft-button">
                    <div v-show="mode === 'show'">
                        <button class="btn btn-warning" v-if="mode === 'show'" @click.prevent="onEditMode">Editar</button>
                    </div>
                    <div v-show="mode === 'show'" class="px-2">
                        <button class="btn btn-danger" v-if="mode === 'show'" @click.prevent="onShow">Excluir</button>
                    </div>
                    <div v-show="mode === 'edit'">
                        <button class="btn btn-success" v-if="mode === 'edit'" @click.prevent="save">Salvar</button>
                    </div>
                    <div v-show="mode === 'edit'" class="px-2">
                        <button class="btn btn-primary" v-if="mode === 'edit'" @click.prevent="reset">Cancelar</button>
                    </div>
                </div>
            </div>
            <br>
        </form>
        <hr>
    </div>
    <div class="modal fade" id="modalDelete" tabindex="-1" aria-labelledby="modalDeleteLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="modalDeleteLabel">Deletar Usuário</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-3">
                            <i class="fa fa-exclamation-triangle fa-5x" aria-hidden="true"></i>
                        </div>
                        <div class="col-9">
                            <p>Deletando o usuário, todas as suas receitas serão excluidas juntas e você será descolado, deseja prosseguir?</p>
                        </div>
                        </div>
                    </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" @click="deleteAccount">Save changes</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { userKey } from '@/global';
import { baseApiUrl } from '@/global';
import {Modal} from 'bootstrap';

import axios from 'axios';
import toastMsgs from '@/config/msgs'

export default {
    name: 'EditProfilePage',
    data: function() {
        return {
            mode: 'show',
            previewImage: null,
            user: {},
        }
    },
    methods: {
        myModal(){
            let myModal = new Modal(document.getElementById('modalDelete'))
            return myModal
        },
        onShow() {
            this.modalDelete
            this.myModal().show()
        },
        onHide(){
            document.getElementsByClassName('modal-backdrop')[0].remove()
            this.myModal().hide()
        },
        loadUser() {
            const url = `${baseApiUrl}/userprofile`
            axios.get(url).then(res => {
                this.user = res.data
                this.resetIMG()
            })
        },
        onEditMode(){
            this.mode = 'edit'
        },
        reset() {
            this.mode = 'show',
            this.user = {},
            this.loadUser()
        },
        resetIMG(){
            this.user.img_verify = false
            document.getElementById('user-img-location').value = ""
            if(this.user.user_icon === "@/assets/genericIcon.png"){
                this.previewImage = require('@/assets/genericIcon.png')
            }else{
                this.previewImage = "data:image/png;base64," + this.user.user_icon
            }
        },
        save() {
            const id = this.user.id
            this.user.imageBase64 = this.previewImage

            axios.put(`${baseApiUrl}/users/${id}`, this.user)
                .then(() => {
                    toastMsgs.defaultSuccess(this, 'Registro feito com sucesso!')
                    window.location.reload();
                    this.reset()
                }).catch((e) => {
                    toastMsgs.defaultError(this, e.response.data)
                })
        },
        deleteAccount() {
            axios.post(`${baseApiUrl}/users/${this.user.id}`, {mode: 'remove'})
                .then(() => {
                    localStorage.removeItem(userKey)
                    this.$store.commit('setUser', null)
                    this.$router.push({name: 'auth'})
                    window.location.reload();
                }).catch((e) => {
                    toastMsgs.defaultError(this, e.response.data)
                })
        },
        onImageSelected(event) {
            const imgFile = event.target.files[0]

            if(event && imgFile){
                if(imgFile.name.endsWith('.jpg') || imgFile.name.endsWith('.png') || imgFile.name.endsWith('.jpeg')){
                    let reader = new FileReader;
                    reader.onload = (e) => {
                        const base64 = e.target.result.toString()
                        const bytesSize = (base64.length * (3 / 4)) - (base64.endsWith('==') ? 2 : base64.endsWith('=') ? 1 : 0);
                        if(bytesSize / 1024 > 2000){
                            this.resetIMG()
                            toastMsgs.defaultError(this, 'Limite do tamanho da image: 2MB')
                            return
                        }
                        
                        var testImage = document.createElement("img")
                        testImage.src = e.target.result
                        
                        testImage.onload = () => {
                            var canvas = document.createElement('canvas')
                            var context = canvas.getContext('2d');
                            canvas.width = 800
                            canvas.height = 458
                            context.drawImage(testImage, 0, 0, 800, 460)

                            
                            this.previewImage = context.canvas.toDataURL()
                        }
                    }
                    reader.readAsDataURL(this.$refs.imageFileInput.files[0]);
                    this.user.img_verify = true
                }else{
                    this.resetIMG()
                    toastMsgs.defaultError(this, 'Escolha um arquivo JPG ou PNG!')
                }
            }else{
                this.resetIMG()
            }
        },
        triggerFileInput(){
            this.$refs.imageFileInput.click()
        },
    },
    mounted() {
        this.myModal()
        this.loadUser()
    }
}
</script>

<style>
    .edit-profile-page {
        border-radius: 10px;
        background: rgba(0,0,0,0.45);
        padding-left: 5%;
        padding-right: 5%;
    }
    .edit-profile-page img {
        width: 200px;
        height: 200px;
    }
    .mleft-button { 
        margin-left: 15px;
    }
</style>