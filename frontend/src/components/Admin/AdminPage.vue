<template>
    <div class="admin-page">
        <PageTitle icon="fa fa-cogs" main="Administração do Sistema"></PageTitle>
        <ul class="nav nav-pills mb-3" id="pills-tab" role="tablist">
            <li class="nav-item" role="presentation">
                <button type="button" class="nav-link active" data-bs-toggle="pill" data-bs-target="#pills-userlist" aria-selected="true" @click.prevent="callResetComponents(1)">Usuários</button>
            </li>
            <li class="nav-item" role="presentation">
                <button type="button" class="nav-link" data-bs-toggle="pill" data-bs-target="#pills-recipes" aria-controls="pills-recipes" aria-selected="false" @click.prevent="callResetComponents(2)">Receitas</button>
            </li>
            <li class="nav-item" role="presentation">
                <button type="button" class="nav-link" data-bs-toggle="pill" data-bs-target="#pills-types" aria-controls="pills-types" aria-selected="false" @click.prevent="callResetComponents(3)">Tipos de receitas</button>
            </li>
        </ul>
        <div class="tab-content" id="pills-tabContent">
            <div class="tab-pane fade show active" id="pills-userlist">
               <AdminUserList ref="componentAdmin"/>
            </div>
            <div class="tab-pane fade" id="pills-recipes" >
                <AdminRecipeList ref="componentRecipe"/>
            </div>
            <div class="tab-pane fade" id="pills-types" >
                <AdminTypeList ref="componentType"/>
            </div>
        </div>
    </div>
</template>

<script>
import PageTitle from '@/components/template/PageTitle.vue'
import AdminUserList from './AdminUserList.vue';
import AdminTypeList from './AdminTypeList.vue';
import AdminRecipeList from './AdminRecipeList.vue';

export default {
    name: 'AdminPage',
    components: {PageTitle, AdminUserList, AdminTypeList, AdminRecipeList},
    methods: {
        callResetComponents(component = 1){
            if(component === 1) {
                this.$refs.componentAdmin.reset()
            }else if(component === 2) {
                this.$refs.componentRecipe.reset()
            }else {
                this.$refs.componentType.reset()
            }
        },
    }
}
</script>

<style>
    .admin-page nav {
        justify-content: center; 
        display: flex;
    }

    .admin-page ul li button {
        color: white;
    }
</style>