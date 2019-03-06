import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import firebase from 'firebase';
import * as firebaseui from 'firebaseui'

var config = {
  apiKey: "***REMOVED***",
  authDomain: "***REMOVED***",
  databaseURL: "***REMOVED***",
  projectId: "***REMOVED***",
  storageBucket: "***REMOVED***.appspot.com",
  messagingSenderId: "***REMOVED***"
};



var firebase_obj =firebase.initializeApp(config);

//var auth_ui = new firebaseui.auth.AuthUI(firebase_obj.auth());


if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.prototype.$auth = firebase_obj.auth();
//Vue.prototype.$authUi = auth_ui;
Vue.prototype.$database = firebase_obj.database();




/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>',
}).$mount('#app')


