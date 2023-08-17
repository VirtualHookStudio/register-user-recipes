<template>
    <div class="admin-type-list">
        <form>
            <input id="type-id" type="hidden" v-model="type.id">
            <div class="row">
                <div class="col md-6 sm-12">
                    <input class="form-control" id="type-name" type="text" v-model="type.name" :readonly="mode === 'remove'" required placeholder="Informe o nome do Tipo de receita"/>
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
        <table ref="tableTypes" class="table table-striped">
          <thead>
            <tr>
              <th scope="col" class="col-1">#</th>
              <th scope="col" class="col-5">Nome</th>
              <th scope="col" class="col-2">Criação</th>
              <th scope="col" class="col-2">Deletado</th>
              <th scope="col" class="col-2 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(types, t) in paginatedItems" :key="t">
              <td>{{ types.id }}</td>
              <td>{{ types.name }}</td>
              <td>{{ types.created_at }}</td>
              <td>{{ (types.deleted_at) ? types.deleted_at : 'Não deletado' }}</td>
              <td class="text-center">
                <button type="button" class="btn btn-outline-warning margin-right-button" @click.prevent="loadType(types, 'edit')">
                    <i class="fa fa-pencil"></i>
                </button>
                <button type="button" class="btn btn-outline-danger" v-show="(!types.deleted_at)" @click.prevent="loadType(types, 'remove')">
                    <i class="fa fa-trash"></i>
                </button>
                <button type="button" class="btn btn-outline-danger" v-show="(types.deleted_at)" @click.prevent="loadType(types, 'restore')">
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
    name: 'AdminTypeList',
    components: {PaginationTemplate},
    data: function() {
        return {
            mode: 'save',
            type: {},
            types: [],
            itemsPerPage: 10,
            currentPage: 1,
        }
    },
    computed: {
        paginatedItems() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.types.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(this.types.length / this.itemsPerPage);
        }
    },
    methods: {
        loadTypes() {
            const url = `${baseApiUrl}/typeGetAdmin`
            axios.get(url).then(res => {
                this.types = res.data
            })
        },
        reset() {
            this.mode = 'save',
            this.type = {},
            this.types = [],
            this.loadTypes()
        },
        save() {
            const method = this.type.id ? 'put' : 'post'
            
            const id = this.type.id ? `${this.type.id}` : ''

            axios[method](`${baseApiUrl}/types/${id}`, this.type)
                .then(() => {
                    toastMsgs.defaultSuccess(this, 'Registro feito com sucesso!')
                    this.reset()
                }).catch((e) => {
                    toastMsgs.defaultError(this, e.response.data)
                })
        },
        removeRestore() {
            const id = this.type.id
            
            axios.post(`${baseApiUrl}/types/${id}`, {mode: this.mode})
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
        loadType(type, mode = 'save') {
            this.mode = mode
            this.type.id = type.id
            this.type.name = type.name
        },
        onPageChange(page) {
            this.currentPage = page;
        },
    },
    mounted() {
        this.loadTypes()
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