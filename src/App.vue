<template>
  <v-app>
    <c-header/>
    <v-main>
      <router-view></router-view>
    </v-main>
    <c-footer/>
  </v-app>
</template>

<script>
import CHeader from './components/CHeader.vue'
import CFooter from './components/CFooter.vue'
export default {
  components: { CHeader, CFooter },
  name: 'App',

  data: () => ({
    //
  })
}
</script>
<style>
@font-face {
  font-family: "Product Sans";
  src: local("Product Sans"),
  url(./fonts/ProductSansRegular.ttf) format("truetype");
}
</style>
