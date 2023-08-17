<template>
    <div class="your-list-recipes-page">
        <br>
        <PageTitle icon="fa fa-list" main="Sua lista de Receitas" sub=""></PageTitle>
        <form class="col-12">
            <input id="recipe-id" type="hidden" v-model="recipe.id">
            <div class="row">
                <div class="col-lg-6 ms-12">
                    <label for="validationServer01">Nome da receita</label>
                    <input class="form-control" id="recipe-name" type="text" v-model="recipe.name" :readonly="mode === 'remove'" required/>
                    <br>
                </div>
                <div class="col-lg-6 ms-12">
                    <label for="validationServer02">Tipo da receita</label>
                    <select id="type-id" class="form-select" aria-label="Default select example" v-model="recipe.type_id" :disabled="mode === 'remove'">
                        <option selected>Escolha o tipo da receita</option>
                        <option v-for="(types, t) in types" :key="t" :value="types.id">{{ types.name }}</option>
                    </select>
                </div>
            </div>
            <br>
            <div class="row">
                <div class="col-lg-6 ms-12">
                    <label for="validationServer03">Foto da receita</label>
                    <img ref="imageIMG" :src="previewImage" class="img-fluid rounded" >
                </div>
                <div class="col-lg-6 ms-12">
                    <div class="custom-file">
                        <label class="custom-file-label" for="customFileLang">Selecionar Archivo ( JPG | PNG | JPEG )</label>
                        <input type="file" ref="imageFileInput" class="form-control custom-file-input" id="recipe-img-location" accept = ".jpg, .png, .jpeg" @change="onImageSelected" :disabled="mode === 'remove'">
                    </div>
                    <br>
                    <label for="validationServer04">Modo de preparo</label>
                    <textarea class="form-control" id="recipe-description" rows="15" v-model="recipe.description" maxlength="2000" :readonly="mode === 'remove'"></textarea>
                </div>
            </div>
            <div class="btn-group mt-3">
                <div v-show="mode === 'save' || mode === 'edit'">
                    <button class="btn btn-success" v-if="mode === 'save' || mode === 'edit'" @click.prevent="save">Salvar</button>
                </div>
                <div v-show="mode === 'remove'">
                    <button class="btn btn-danger" v-if="mode === 'remove'" @click.prevent="removeRestore">Excluir</button>
                </div>
                <div v-show="mode === 'restore'">
                    <button class="btn btn-info" v-if="mode === 'restore'" @click.prevent="removeRestore">Restaurar</button>
                </div>
                <div class="px-2" v-show="mode !== 'save'">
                    <button class="btn btn-primary" v-if="mode !== 'save'" @click.prevent="reset">Cancelar</button>
                </div>
            </div>
        </form>
        <hr>
        <div class="card-group justify-content-center">
            <div style="padding: 5px;" v-for="(recipes, r) in paginatedItems" :key="r">
                <CardRecipeTemplate :recipe-card="recipes" @delete-recipe="(r) => onDeleteEdit(r, 'remove')" @edit-recipe="(r) => onDeleteEdit(r, 'edit')" @show-recipe="(r) => onShow(r)"/>
            </div>
        </div>
        <br>
        <div class="col-12 d-flex justify-content-center">
            <PaginationTemplate :current-page="currentPage" :total-pages="totalPages" @page-change="onPageChange"/>
        </div>
        <div class="modal fade" id="dialogRecipe" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <DialogRecipeTemplate :recipe-dialog="this.recipeModel" @hide-modal="onHide()"/>
        </div>
        <br>
    </div>
</template>

<script>
import PageTitle from '@/components/template/PageTitle.vue'
import CardRecipeTemplate from '@/components/template/CardRecipeTemplate.vue';
import DialogRecipeTemplate from '../template/DialogRecipeTemplate.vue';
import PaginationTemplate from '../template/PaginationTemplate.vue';

import {Modal} from 'bootstrap';
import { mapState } from 'vuex'
import { baseApiUrl} from '@/global';

import axios from 'axios';
import toastMsgs from '@/config/msgs'

export default {
    name: 'YourListRecipesPage',
    components: { PageTitle, CardRecipeTemplate, DialogRecipeTemplate, PaginationTemplate},
    data: function() {
        return {
            mode: 'save',
            previewImage: null,
            recipe: {},
            recipeModel: {},
            recipes: [],
            types: [],
            itemsPerPage: 8,
            currentPage: 1,
        }
    },
    computed: {
        ...mapState(['user']),
        paginatedItems() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.recipes.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(this.recipes.length / this.itemsPerPage);
        }
    },
    methods: {
        myModal(){
            let myModal = new Modal(document.getElementById('dialogRecipe'))
            return myModal
        },
        onShow(recipe) {
            this.recipeModel = recipe
            this.myModal().show()
        },
        onHide(){
            document.getElementsByClassName('modal-backdrop')[0].remove()
            this.myModal().hide()
        },
        loadYourList() {
            axios.get(`${baseApiUrl}/types`).then(res => {
                this.types = res.data
            })
            
            axios.post(`${baseApiUrl}/searchrecipes`, {user_id: this.user.id}).then(res => {
                this.recipes = res.data
            })
        },
        reset() {
            this.mode = 'save',
            this.recipe = {},
            this.recipes = [],
            this.loadYourList(),
            this.resetIMG()
        },
        onDeleteEdit(recipe, m){
            this.mode = m
            this.recipe.id = recipe.id
            this.recipe.name = recipe.name
            var idType
            this.types.forEach(function(t){
                if(t.name === recipe.type_id){
                    idType = t.id
                }
            })
            this.recipe.type_id = idType
            this.recipe.description = recipe.description
            this.recipe.img_verify = true
            this.previewImage = "data:image/png;base64," + recipe.img_location
        },
        resetIMG(){
            this.recipe.img_verify = null
            document.getElementById('recipe-img-location').value = ""
            this.previewImage = require('@/assets/img_default.png')
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
                            context.drawImage(testImage, 0, 0, 800, 500)
                            
                            this.previewImage = context.canvas.toDataURL()
                        }
                    }
                    reader.readAsDataURL(this.$refs.imageFileInput.files[0]);
                    this.recipe.img_verify = true
                }else{
                    this.resetIMG()
                    toastMsgs.defaultError(this, 'Escolha um arquivo JPG ou PNG!')
                }
            }else{
                this.resetIMG()
            }
        },
        save() {
            this.recipe.imageBase64 = this.previewImage

            const method = this.recipe.id ? 'put' : 'post'
            const id = this.recipe.id ? `/${this.recipe.id}` : ''
            
            axios[method](`${baseApiUrl}/recipes${id}`, this.recipe)
                .then(() => {
                    toastMsgs.defaultSuccess(this, 'Registro feito com sucesso!')
                    this.reset()
                }).catch((e) => {
                    toastMsgs.defaultError(this, e.response.data)
                })
        },
        removeRestore() {
            const id = this.recipe.id
            
            axios.post(`${baseApiUrl}/recipes/${id}`, {mode: this.mode})
                .then(() => {
                    var msg = ''
                    if(this.mode === 'restore') {msg = 'Registro restaurado com sucesso!'}
                    else{msg = 'Registro deletado com sucesso!'}

                    toastMsgs.defaultSuccess(this, msg)
                    this.reset()
                }).catch((e) => {
                    toastMsgs.defaultError(this, e.response.data)
                })
        },
        onPageChange(page) {
            this.currentPage = page;
        },
    },
    beforeMount() {
        this.previewImage = require('@/assets/img_default.png')
    },
    mounted() {
        this.$store.state.isButtonsVisible = true
        this.myModal()
        this.loadYourList()
    }
}
</script>

<style>
    .your-list-recipes-page {
        border-radius: 10px;
        background: rgba(0,0,0,0.45);
        padding-left: 5%;
        padding-right: 5%;
    }
</style>