import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import * as firebase from 'firebase'
import router from './router'
import { store } from './store'
import AlertComponent from './components/Shared/Alert.vue'

Vue.config.productionTip = false
Vue.component('app-alert', AlertComponent)

new Vue({
  vuetify,
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
}).$mount('#app')
