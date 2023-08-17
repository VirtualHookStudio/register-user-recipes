<template>
    <div class="menu flex-shrink-0 p-3" v-show="isMenuVisible">
        <ul class="nav nav-pills flex-column mb-auto">
            <li class="nav-item" @click.prevent="testInnetWidth">
                <RouterLink class="nav-link" to="/recipespage">
                    <span class="h4 align-middle"> Lista Geral</span>
                </RouterLink>
            </li>
            <li class="nav-item" @click.prevent="testInnetWidth">
                <RouterLink class="nav-link" to="/yourlistrecipespage">
                    <span class="h4 align-middle"> Suas Receitas</span>
                </RouterLink>
            </li>
        </ul>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'MenuTemplate',
    computed: mapState(['isMenuVisible']),
    data: function() {
        return {
            isActive: true,
        }
    },
    methods: {
        testInnetWidth(){
            if(window.innerWidth < 776){
                this.$store.commit('toggleMenu', false)
            }
        }
    }
}
</script>

<style>
    .menu {
        grid-area: menu;
        background: linear-gradient(180deg, rgba(11,10,33,1) 0%, rgba(48,48,48,1) 100%);
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }
    
    .menu ul li span{
        color: white;
        font-size: 1.2rem;
        font-weight: 100;
        flex-grow: 1;
        transition: background-color 0.3s ease;
    }
</style>