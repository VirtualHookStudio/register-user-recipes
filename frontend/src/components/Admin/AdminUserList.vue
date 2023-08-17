<template>
    <div class="admin-user-list">
        <h1>Lista de usuários</h1>
        <table ref="tableUsers" class="table table-striped">
          <thead>
            <tr>
              <th scope="col-1">#</th>
              <th scope="co">Nome</th>
              <th scope="col">Email</th>
              <th scope="col">CPF</th>
              <th scope="col">Telefone</th>
              <th scope="col">Criação</th>
              <th scope="col">Deletado</th>
              <th scope="col" class="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(users, u) in paginatedItems" :key="u">
              <td>{{ users.id }}</td>
              <td>{{ users.name }}</td>
              <td>{{ users.email }}</td>
              <td>{{ users.phone }}</td>
              <td>{{ users.cpf }}</td>
              <td>{{ users.created_at }}</td>
              <td>{{ (users.deleted_at) ? users.deleted_at : 'Não deletado' }}</td>
              <td class="text-center">
                <div v-if="!users.permission">
                  <button type="button" class="btn btn-outline-danger" v-show="(!users.deleted_at)" @click.prevent="removeRestore(users.id)">
                      <i class="fa fa-trash"></i>
                  </button>
                  <button type="button" class="btn btn-outline-danger" v-show="(users.deleted_at)" @click.prevent="removeRestore(users.id, 'restore')">
                      <i class="fa fa-heart"></i>
                  </button>
                </div>
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
    name: 'AdminUserList',
    components: {PaginationTemplate},
    data: function() {
      return {
        users: [],
        itemsPerPage: 10,
        currentPage: 1,
      }
    },
    computed: {
        paginatedItems() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.users.slice(startIndex, endIndex);
        },
        totalPages() {
            return Math.ceil(this.users.length / this.itemsPerPage);
        }
    },
    methods: {
      loadUsers() {
          const url = `${baseApiUrl}/users`
          axios.get(url).then(res => {
              this.users = res.data
          })
      },
      reset() {
          this.recipes = [],
          this.loadUsers()
      },
      removeRestore(id, mode = 'remove') {
          axios.post(`${baseApiUrl}/users/${id}`, {mode: mode})
              .then(() => {
                  var msg = ''
                  if(mode === 'restore') {msg = 'Usuário restaurado com sucesso!'}
                  else{msg = 'Usuário deletado com sucesso!'}
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
    mounted() {
        this.loadUsers()
    }
}

</script>

<style>
    
</style>