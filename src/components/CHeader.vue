<template>
  <v-card>
    <v-toolbar :src="require('../assets/lettuce.jpg')">
      <v-icon class="mdi mdi-sprout mdi-48px green--text mr-2 ml-n1"></v-icon>
      <v-toolbar-title class="headline font-weight-bold orange--text">SistOponik</v-toolbar-title>
      <v-spacer/>
      <v-btn depressed color="blue-grey darken-4" dark @click="loadCamera();trigger = false">
        <v-icon left>mdi-video-wireless</v-icon>Camera
      </v-btn>
    </v-toolbar>
  </v-card>
</template>
<script>
import EventBus from '../eventBus.js'

export default {
  name: 'c-header',
  methods: {
    loadCamera () {
      this.$store.dispatch('dashboard/loadCamera')
      EventBus.$emit('trigger', false)
    }
  },
  computed: {
  }
}
</script>
<style>
::-webkit-scrollbar {
  width: 0.5em;
}
::-webkit-scrollbar-track {
  background: #cecece;
}
::-webkit-scrollbar-thumb {
  background: #424242;
}
</style>
