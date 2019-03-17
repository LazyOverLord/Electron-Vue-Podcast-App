<template>
    <div>

    <router-link to="/"> Go Home </router-link>
    <p> -------------------------------- </p>
    <md-card v-for="data in config" md-with-hover v-bind:data="data" v-bind:key="data.id">
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">{{data.name}}</div>
          <div class="md-subhead">Big size</div>
        </md-card-header-text>

        <md-card-media md-big>
          <img :src="data.cover_path" alt="People">
        </md-card-media>
      </md-card-header>

      <md-card-actions>
        <router-link :to="`/podcasts/${data.id}`">
            <md-button> Go To Feed  </md-button>
        </router-link>
      </md-card-actions>
    </md-card>


    


    </div>
</template>

<script>
import {mapGetters} from 'vuex'
export default {
    name:"card_test",
    data(){
        return{
            test:["sutton","connor"]
        }
    },

    computed:{
        ...mapGetters({
            config:"getConfigAll",
            
        }),   
    }

}
</script>

<style scoped>
    .md-card {
    width: 350px;
    margin: 8px;
    display: inline-block;
    vertical-align: top;
    border-radius: 1em;
  }
</style>


