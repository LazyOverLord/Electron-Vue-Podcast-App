<template>
    <div>

    <router-link to="/"> Go Home </router-link>
    <md-card>
      <md-card-header>
        <md-card-header-text>
          <div class="md-title">Media card</div>
          <div class="md-subhead">Big size</div>
        </md-card-header-text>

        <md-card-media md-big>
          <img src="https://vuematerial.io/assets/examples/cover.png" alt="People">
        </md-card-media>
      </md-card-header>

      <md-card-actions>
        <md-button>Action</md-button>
        <md-button>Action</md-button>
      </md-card-actions>
    </md-card>

    </div>
</template>

<script>
export default {
    name:"card_test",
    data(){
        return{

        }
    }
}
</script>

<style scoped>

</style>


