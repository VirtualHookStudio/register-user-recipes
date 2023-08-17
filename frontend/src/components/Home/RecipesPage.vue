<template>
    <div class="recipes-page">
        <br>
        <PageTitle icon="fa fa-cutlery" main="Lista de Receitas" sub=""></PageTitle>
        <form class="col-12">
            <div class="row">
                <div class="col-lg-7 ms-12">
                    <label for="validationServer01">Nome da receita</label>
                    <input type="text" class="form-control" id="recipe-name" v-model="recipe.name"/>
                </div>
                <div class="col-lg-4 ms-12">
                    <label for="validationServer02">Tipo da receita</label>
                    <select id="type-id" class="form-select" aria-label="Default select example" v-model="recipe.type_id">
                        <option selected>Escolha o tipo da receita</option>
                        <option v-for="(types, t) in types" :key="t" :value="types.id">{{ types.name }}</option>
                    </select>
                </div>
                <div class="col-lg-1 ms-12 d-flex justify-content-center align-items-end">
                    <br><br>
                    <a class="btn btn-outline-dark" @click="reset(true)" style="width: 100px;"><i class="fa fa-search" aria-hidden="true"></i></a>
                </div>
            </div>
        </form>
        <hr>
        <div class="card-group justify-content-center">
            <div style="padding: 5px;" v-for="(recipes, r) in paginatedItems" :key="r">
                <CardRecipeTemplate :recipe-card="recipes" @show-recipe="(r) => onShow(r)"/>
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
import { baseApiUrl } from '@/global';
import axios from 'axios';

export default {
    name: 'RecipesPage',
    components: {PageTitle, CardRecipeTemplate, DialogRecipeTemplate, PaginationTemplate},
    data: function() {
        return {
            recipe: {},
            recipes: [],
            recipeModel: {},
            types: [],
            itemsPerPage: 8,
            currentPage: 1,
        }
    },
    computed: {
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

            axios.post(`${baseApiUrl}/searchrecipes`).then(res => {
                this.recipes = res.data
            })
        },
        loadSearch() {
            axios.post(`${baseApiUrl}/searchrecipes`, this.recipe).then(res => {
                this.recipes = res.data
            })
        },
        reset(mode = false) {
            this.recipes = []
            if(mode){
                this.loadSearch()
            }else{
                this.loadYourList()
            }
            this.recipe = {}
        },
        onPageChange(page) {
            this.currentPage = page;
        },
    },
    mounted() {
        this.$store.state.isButtonsVisible = false
        this.myModal()
        this.loadYourList()
    }
}
</script>

<style>
    .recipes-page {
        border-radius: 10px;
        background: rgba(0,0,0,0.45);
        padding-left: 5%;
        padding-right: 5%;
    }
</style>