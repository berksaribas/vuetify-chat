import Vue from 'vue'
import Vuetify from 'vuetify'
import VueResource from 'vue-resource'
import App from './App'
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'

import AlertComponent from './components/Shared/Alert.vue'

Vue.use(Vuetify)
Vue.use(VueResource)

Vue.config.productionTip = false

Vue.component('app-alert', AlertComponent)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
  created () {
    firebase.initializeApp({
      apiKey: 'AIzaSyBiqUbF0rN5LUD9G9msHN4xHF3f00MpOFE',
      authDomain: 'mutfak-chat.firebaseapp.com',
      databaseURL: 'https://mutfak-chat.firebaseio.com',
      projectId: 'mutfak-chat',
      storageBucket: 'mutfak-chat.appspot.com'
    })
  }
})
