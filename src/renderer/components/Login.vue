<template>
    <div>
        <p> Enter your username  <input v-model="user_name"> </p>
        <p> Enter your password <input v-model="password"> </p>
        <button @click="add_user()"> Add User </button>
        <p id="error_message"> error:  {{err_message}}</p>
    </div>

</template>

<script>
export default {
    name:"Login",
    data(){
        return {
            user_name:"",
            password:"",
            err_message:""
        }
    },

    methods:{
        add_user:function(){
            this.$auth.createUserWithEmailAndPassword(this.user_name,this.password).catch((err)=>{
                var err_code = err["code"];
                console.log(err_code);
                this.err_message = err_code;
            })
        }
    }
}
</script>

<style scoped>
    #error_message {
        color:red;
    }
</style>


