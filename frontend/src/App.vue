<template>
  <div id="gridApp" :class="{'hide-menu': !isMenuVisible || !user}">
    <HeaderTemplate title="VirtualHookStudio - Registro de receitas" :hideToggle="!user" :hideUserDropDown="!user"/>
    <MenuTemplate v-if="user"/>
    <LoadingTemplate v-if="validationToken"/>
    <ContentTemplate v-else/>
    <FooterTemplate/>
  </div>
</template>

<script>
import axios from "axios"
import { baseApiUrl, userKey } from "./global"
import { mapState } from "vuex"
import HeaderTemplate from "@/components/template/HeaderTemplate.vue"
import FooterTemplate from "@/components/template/FooterTemplate.vue"
import MenuTemplate from "@/components/template/MenuTemplate.vue"
import ContentTemplate from "@/components/template/ContentTemplate.vue"
import LoadingTemplate from "@/components/template/LoadingTemplate.vue"

export default {
  name: 'App',
  components: {HeaderTemplate, FooterTemplate, MenuTemplate, ContentTemplate, LoadingTemplate},
  computed: mapState(['isMenuVisible', 'user']),
  data: function() {
    return {
      validationToken: true
    }
  },
  methods: {
    async validateToken() {
      this.validationToken = true
      
      const json = localStorage.getItem(userKey)
      const userData = JSON.parse(json)
      this.$store.commit('setUser', null)

      if(!userData) {
        this.validationToken = false
        return this.$router.push({name: 'auth'})
      }

      const res = await axios.post(`${baseApiUrl}/validateToken`, userData)

      if(res.data) {
        this.$store.commit('setUser', userData)
        if(window.innerWidth < 776){
          this.$store.commit('toggleMenu', false)
        }
      }else {
        localStorage.removeItem(userKey)
        this.$router.push({name: 'auth'})
      }

      this.validationToken = false
    }
  },
  created() {
    this.validateToken()
  }
}
</script>

<style>
  * {
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }

  body {
    padding: 0;
		margin: auto;
	}

  #gridApp {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;

    height: 100vh;
		display: grid;
		grid-template-rows: 60px 1fr 40px;
		grid-template-columns: 300px 1fr;
		grid-template-areas:
			"header header"
			"menu content"
			"footer footer";
  }

  #gridApp.hide-menu {
    grid-template-areas: 
      "header header"
      "content content"
      "footer footer";
  }
</style>
