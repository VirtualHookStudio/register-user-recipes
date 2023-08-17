<template>
    <div class="admin-recipe-list">
        <hr>
        <table ref="tableRecipes" class="table table-striped">
          <thead>
            <tr>
              <th scope="col" class="col-1">#</th>
              <th scope="col" class="col-3">Nome</th>
              <th scope="col" class="col-3">Criação</th>
              <th scope="col" class="col-3">Deletado</th>
              <th scope="col" class="col-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(recipes, t) in paginatedItems" :key="t">
              <td>{{ recipes.id }}</td>
              <td>{{ recipes.name }}</td>
              <td>{{ recipes.created_at }}</td>
              <td>{{ (recipes.deleted_at) ? recipes.deleted_at : 'Não deletado' }}</td>
              <td class="text-center">
                <button type="button" class="btn btn-outline-danger" v-show="(!recipes.deleted_at)" @click.prevent="removeRestore(recipes.id)">
                    <i class="fa fa-trash"></i>
                </button>
                <button type="button" class="btn btn-outline-danger" v-show="(recipes.deleted_at)" @click.prevent="removeRestore(recipes.id, 'restore')">
                    <i class="fa fa-heart"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <PaginationTemplate :current-page="currentPage" :total-pages="totalPages" @page-change="onPageChange"/>
    </div>
</template>

<script>
import PaginationTemplate from '../template/PaginationTemplate.vue';

import { baseApiUrl } from '@/global';
import axios from 'axios';
import toastMsgs from '@/config/msgs'

export default {
    name: 'AdminRecipeList',
    components: {PaginationTemplate},
    data: function() {
        return {
            mode: 'save',
            recipe: {},
            recipes: [],
            itemsPerPage: 10,
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
        loadRecipes() {
            const id = 2
            const url = `${baseApiUrl}/recipes/${id}`
            axios.get(url).then(res => {
                this.recipes = res.data
            })
        },
        reset() {
            this.recipe = {},
            this.recipes = [],
            this.loadRecipes()
        },
        save() {
            const method = this.recipe.id ? 'put' : 'post'
            
            const id = this.recipe.id ? `${this.recipe.id}` : ''

            axios[method](`${baseApiUrl}/recipes/${id}`, this.recipe)
                .then(() => {
                    toastMsgs.defaultSuccess(this, 'Registro feito com sucesso!')
                    this.reset()
                }).catch((e) => {
                    toastMsgs.defaultError(this, e.response.data)
                })
        },
        removeRestore(id, mode = 'remove') {
            axios.post(`${baseApiUrl}/recipes/${id}`, {mode: mode})
                .then(() => {
                    var msg = ''
                    if(mode === 'restore') {msg = 'Registro restaurado com sucesso!'}
                    else{msg = 'Registro deletado com sucesso!'}

                    toastMsgs.defaultSuccess(this, msg)
                    this.reset()
                }).catch((e) => {
                    toastMsgs.defaultError(this, e.response.data)
                })
        },
        loadRecipe(recipe, mode = 'save') {
            this.mode = mode
            this.recipe.id = recipe.id
            this.recipe.name = recipe.name
        },
        onPageChange(page) {
            this.currentPage = page;
        },
    },
    mounted() {
        this.loadRecipes()
    }
}
</script>

<style>
    .row button{
        background-color: rgba(11,10,33,1);
        border: none;
        color: white;
        margin-top: 15%;
        padding: 20px 60px 20px 60px;
        text-align: center;
        cursor: pointer;
        text-decoration: none;
        border-radius: 8px;
    }

    .margin-right-button{ 
        margin-right: 10px;
    }
</style>