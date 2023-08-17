import {createWebHistory, createRouter} from 'vue-router'

import HomePage from '@/components/Home/HomePage.vue'
import EditProfilePage from '@/components/Auth/EditProfilePage.vue'
import RecipesPage from '@/components/Home/RecipesPage.vue'
import YourListRecipesPage from '@/components/Home/YourListRecipesPage.vue'

import AdminPage from '@/components/Admin/AdminPage.vue'
import Auth from '@/components/Auth/AuthPage.vue'

import { userKey } from '@/global'

const routes = [{
    name: 'homepage',
    path: '/',
    component: HomePage
}, {
    name: 'adminpage',
    path: '/admin',
    component: AdminPage,
    meta: {permission: true}
}, {
    name: 'auth',
    path: '/auth',
    component: Auth
}, {
    name: 'editprofilepage',
    path: '/editprofilepage',
    component: EditProfilePage
}, {
    name: 'recipespage',
    path: '/recipespage',
    component: RecipesPage
}, {
    name: 'yourlistrecipespage',
    path: '/yourlistrecipespage',
    component: YourListRecipesPage
}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const json = localStorage.getItem(userKey)
    if(to.matched.some(record => record.meta.permission)) {
        const user = JSON.parse(json)
        user && user.permission ? next() : next({path: '/'})
    }else{
        next()
    }
})

export default router