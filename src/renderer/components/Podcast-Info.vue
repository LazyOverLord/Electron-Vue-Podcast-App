<template>
    <div>
        <h2>{{podcast_data.name}}</h2>
        <p>
            <img :src="podcast_data.cover_path">
        </p>

        <p>
            <router-link :to='{path:"/",exact:true}' >Go Home </router-link>
        </p>

       
        

    </div>

</template>


<script>
import {mapGetters} from "vuex";
export default {
    name:'podcast-info',
    data(){
        return{

        }
    },

    props:["podcast_data"],

    computed:{
        
    }

    

    

    
    
}
</script>


<style scoped>
    img{
        width:300px;
        height:300px;
    }

    p{
        text-align: center;
    }

    h2{
        text-align: center;
    }

    
</style>

