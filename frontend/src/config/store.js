import axios from 'axios'
import {createStore} from 'vuex'

const store = createStore({
    state: {
        isButtonsVisible: false,
        isMenuVisible: false,
        user: null,
    },
    mutations: {
        toggleMenu(state, isVisible) {
            if(!state.user){
                state.isMenuVisible = false
                return
            }

            if(isVisible === undefined) {
                state.isMenuVisible = !state.isMenuVisible
            } else {
                state.isMenuVisible = isVisible
            }
        },
        toggleButtons(state, isVisible){
            if(!state.user){
                state.isButtonsVisible = false
                return
            }

            if(isVisible === undefined){
                state.isButtonsVisible = !state.isButtonsVisible
            } else {
                state.isButtonsVisible = isVisible
            }
        },
        setUser(state, user) {
            state.user = user
            if(user) {
                axios.defaults.headers.common['Authorization'] = `bearer ${user.token}`
                state.isMenuVisible = true
            }else {
                delete axios.defaults.headers.common['Authorization']
                state.isMenuVisible = false
            }
        },
    }
})

export default store