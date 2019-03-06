<template>
    <div>
        <p> <router-link :to='{path:"/",exact:true}' >Go Home </router-link></p>
        <p> The current user is {{current_user}}</p>
        <p> Sign Up </p>
        <p> Enter your email <input v-model="user_name"> </p>
        <p> Enter your password <input v-model="password"> </p>
        <button @click="add_user()"> Add User </button>
        <p class="error_message"> error:  {{err_message}}</p>


        <p> Sign In </p>
            <p> Enter your email <input v-model="user_name_login"> </p>
            <p> Enter your password <input v-model="password_login"> </p>
            <button @click="login_in_user()"> Login In </button>
            <p class="error_message"> error:  {{login_error}}</p>


        
    </div>

</template>

<script>
export default {
    name:"Login",
    data(){
        return {
            user_name:"",
            password:"",
            err_message:"",
            user_name_login:"",
            password_login:"",
            login_error:"",
            current_user:"",
        }
    },

    methods:{
        add_user:function(){
            this.$auth.createUserWithEmailAndPassword(this.user_name,this.password)
            .then((result)=>{
                console.log(result);
            })
        
            
            .catch((err)=>{
                var err_code = err["code"];
                console.log(err_code);
                this.err_message = err_code;
                if(err_code == undefined){
                    this.user_name = "";
                    this.password = "";
                }
            })
        },

        login_in_user:function(){
            this.$auth.signInWithEmailAndPassword(this.user_name_login,this.password_login).then((result)=>{
                console.log(result);
                console.log(result['user']);
                
            })

            .catch((err)=>{
                console.log(err);
            })

            
        }


    }
}
</script>

<style scoped>
    .error_message {
        color:red;
    }
</style>


