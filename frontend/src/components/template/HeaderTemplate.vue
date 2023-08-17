<template>
    <header class="header">
        <a class="toggle" @click="toggleMenu" v-if="!hideToggle">
            <i class="fa fa-lg" :class="icon"></i>
        </a>
        <h1 class="title">
            <RouterLink to="/">{{ title }}</RouterLink>
        </h1>
        <UserDropDownTemplate v-if="!hideUserDropDown"/>
    </header>
</template>

<script>
import UserDropDownTemplate from './UserDropDownTemplate.vue';

export default {
    name: 'HeaderTemplate',
    components: { UserDropDownTemplate },
    props: {
        title: String,
        hideToggle: Boolean,
        hideUserDropDown: Boolean
    },
    computed: {
        icon() {
            return this.$store.state.isMenuVisible ? "fa-angle-left" : "fa-angle-down"
        }
    },
    methods: {
        toggleMenu() {
            this.$store.commit('toggleMenu')
        }
    }
}
</script>

<style>
    .header {
        grid-area: header;
        background: linear-gradient(90deg, rgba(11,10,33,1) 30%, rgb(48, 48, 48) 100%);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .title {
        font-size: 1.2rem;
        font-weight: 100;
        flex-grow: 1;
        text-align: center;
    }

    .title a{
        color: white;
        text-decoration: none;
    }

    header.header > a.toggle {
        width: 60px;
        height: 100%;
        color: white;
        justify-self: flex-start;
        text-decoration: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    header.header > a.toggle:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }
</style>