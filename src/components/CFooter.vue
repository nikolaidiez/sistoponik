<template>
  <v-footer fixed padless outlined dense>
    <v-list-item>
    <v-list-item-content>
        <v-list-item-title class="headline font-weight-bold" :class="{'subtitle-1':$vuetify.breakpoint.smAndDown}">Penelitian Terapan Dosen Pemula</v-list-item-title>
        <v-list-item-subtitle :class="{'caption':$vuetify.breakpoint.smAndDown}">Politeknik Negeri Pontianak</v-list-item-subtitle>
    </v-list-item-content>
    </v-list-item>
  </v-footer>
</template>
<script>
export default {
  name: 'c-footer'
}
</script>
