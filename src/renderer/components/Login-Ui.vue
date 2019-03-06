<template>
    <div>
        <p> Testing the firebase login Ui</p>
        <div id="auth_id_holder">
        </div>

    </div>
</template>


<script>
import * as firebaseui from 'firebaseui'


export default {
    name:"Login_Ui",
    data(){
        return{
            
            uiConfig :{
            signInSuccessUrl: '<url-to-redirect-to-on-success>',
            signInOptions: [
          // Leave the lines as is for the providers you want to offer your users.
          //this.$auth.GoogleAuthProvider.PROVIDER_ID,
          //this.$auth.FacebookAuthProvider.PROVIDER_ID,
          //this.$auth.TwitterAuthProvider.PROVIDER_ID,
          //this.$auth.GithubAuthProvider.PROVIDER_ID,
          this.$auth.EmailAuthProvider.PROVIDER_ID,
          //this.$auth.PhoneAuthProvider.PROVIDER_ID,
          //this.$auth.AnonymousAuthProvider.PROVIDER_ID
        ],
        // tosUrl and privacyPolicyUrl accept either url string or a callback
        // function.
        // Terms of service url/callback.
            tosUrl: '<your-tos-url>',
        // Privacy policy url/callback.
        
      }

        }
    },

    mounted:function(){
        this.$authUi.start('auth_id_holder',this.uiConfig);
    }
}
</script>

<style scoped>

</style>


