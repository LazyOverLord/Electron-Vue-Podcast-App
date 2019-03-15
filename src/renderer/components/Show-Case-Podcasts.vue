<template>
    
    <div>
        

        <router-link to="/downloads"> Go to downloads </router-link>

        
            
        <div v-if="config.length == 0">
            <p> You have no podcasts added. Click search to search for podcasts to add </p>
            <router-link to="/podcast_search"> Search Podcasts </router-link>
        </div>
 
        
        <div v-else>  
            <ul>
                <li v-for="(data,i) in config">
                    <router-link :to="`/podcasts/${data.id}`">{{data.name}}</router-link>
                </li>
            </ul>


            <router-link to="/podcast_search"> Search Podcasts </router-link>
            <p> ----- </p>
            <router-link to="/manage-feeds/"> Manage your feeds </router-link>

            

        </div>

        
    </div>

    
</template>


<script>
import {mapGetters} from "vuex"
import {ipcRenderer, ipcMain} from 'electron'
import fs from 'fs'
import data_url from 'dataurl'

export default {
    name:"show-case-podcast",
    data(){
        return {
            

    }

    },
    computed:{
        ...mapGetters({
            config:"getConfigAll",
            
        }),



        
        
    },

    mounted:function(){
        ipcRenderer.send('async_check_folder_exists');
    },

    

    

    
    
}
</script>


<style scoped>
</style>



