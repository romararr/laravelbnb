/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

import router from './routes'
import VueRouter from 'vue-router'
import Vue from 'vue';
import index from './Index'
import moment from 'moment'
import Vuex from 'vuex';

import StarRating from './shared/components/StarRating.vue'
import FatalError from './shared/components/FatalError.vue'
import ValidationError from './shared/components/ValidationError.vue'
import Success from './shared/components/Success.vue'
import Store from './store.js'

window.Vue = require('vue').default;

Vue.use(VueRouter)
Vue.use(Vuex)

Vue.filter("fromNow", val => moment(val).fromNow())

Vue.component("star-rating", StarRating)
Vue.component("fatal-error", FatalError)
Vue.component("success", Success)
Vue.component("v-error", ValidationError)

const store = new Vuex.Store(Store)

const app = new Vue({
    el: '#app',
    router,
    store,
    components: {
        index
    },
    beforeCreate() {
        this.$store.dispatch('loadStoredState')
    }
});
