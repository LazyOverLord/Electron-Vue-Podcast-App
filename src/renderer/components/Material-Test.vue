<template>
    <div >
    <md-card >
      <md-card-header>
        <div class="md-title">Material Design with Vue.js 2 Demo</div>
        <div class="md-subhead">by CodingTheSmartWay.com</div>
      </md-card-header>
      <md-card-content>
        
        <md-button class="md-raised md-primary" v-on:click="fillTable()">Fill table</md-button>
        <md-button class="md-raised md-primary" v-on:click="clearTable()">Clear table</md-button>
        <br />
         <md-table>
            <md-table-row>
              <md-table-head>First name</md-table-head>
              <md-table-head>Last name</md-table-head>
              <md-table-head>Email</md-table-head>
            </md-table-row>
          
            <md-table-row>
              <md-table-cell>Sutton</md-table-cell>
              <md-table-cell>Page</md-table-cell>
              <md-table-cell>test@gmail.com</md-table-cell>
            </md-table-row>
        </md-table>
      </md-card-content>
    </md-card>
  </div>
</template>

<script>
export default {
    name:"material_test",
    data(){
        return{

        }
    }
}
</script>

<style scoped>

</style>


