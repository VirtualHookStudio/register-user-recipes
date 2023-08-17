<template>
    <div class="user-dropdown">
        <div class="user-button">
            <span class="d-none d-sm-block">{{ user.name }}</span>
            <div class="user-dropdown-img">
                <img ref="imgIcon" class="rounded-circle"/>
            </div>
            <i class="fa fa-angle-down"></i>
        </div>
        <div class="user-dropdown-content">
            <RouterLink to="/admin" v-if="user.permission">
                <i class="fa fa-cogs">&nbsp;&nbsp;<i>Administração</i></i>
            </RouterLink>
            <RouterLink to="/editprofilepage">
                <i class="fa fa-user">&nbsp;&nbsp;<i>Profile</i></i>
            </RouterLink>
            <a href @click.prevent="logout"><i class="fa fa-sign-out">&nbsp;&nbsp;<i>Sair</i></i></a>
        </div>
    </div>
</template>

<script>
import { userKey } from '@/global';
import { mapState } from 'vuex'
import { baseApiUrl} from '@/global';

import axios from 'axios';

export default {
    name: 'UserDropDownTemplate',
    computed: mapState(['user']),
    methods: {
        logout() {
            localStorage.removeItem(userKey)
            this.$store.commit('setUser', null)
            this.$router.push({name: 'auth'})
        },
    },
    mounted() {
        axios.get(`${baseApiUrl}/imgProfileIconUser`).then(res => {
            if(res.data === '@/assets/genericIcon.png'){
                this.$refs.imgIcon.src = require("@/assets/genericIcon.png")
            }else{
                this.$refs.imgIcon.src = "data:image/png;base64," + res.data
            }
        }) 
    }
}
</script>

<style>
    .user-dropdown {
        z-index: 1000;
        position: relative;
        height: 100%;
    }
    .user-button {
        display: flex;
        align-items: center;
        color: #fff;
        font-weight: 100;
        height: 100%;
        padding: 0px 20px;
    }

    .user-dropdown:hover {
        background-color: rgba(0, 0, 0, 0.2);
    }

    .user-dropdown-content a {
        color: #fff;
        text-decoration: none;
        font-size: 20px;
        padding: 10px;
    }

    .user-dropdown-content a:hover {
        background-color: #EDEDED;
    }

    .user-dropdown-img {
        margin: 0px 10px;
    }

    .user-dropdown-img > img {
        max-height: 37px;
        width: 50px;
        border: 5px;
    }

    .user-dropdown-content {
        position: absolute;
        right: 0px;
        background-color: #353535;
        min-width: 170px;
        box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
        padding: 10px;
        z-index: 1;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        visibility: hidden;
        opacity: 0;
        transition: visibility 0s, opacity 0.5s, linear;
    }

    .user-dropdown:hover .user-dropdown-content{
        visibility: visible;
        opacity: 1;
    }
</style>