<template>
    <div>
        <h2>{{podcast_data.name}}</h2>
        <p>
            <img :src="podcast_data.cover_path">
        </p>

        <p>
            <router-link :to='{path:"/",exact:true}' >Go Home </router-link>
        </p>

       
        <p> 
            There are {{downloads.length}} Downloads and {{pending_downloads.length}} Pending Downloads
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
        ...mapGetters({
            downloads:'get_Download_Items',
            pending_downloads:'get_Pending_Downloads'
        })
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

