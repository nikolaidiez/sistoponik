<template>
  <v-row>
    <v-col cols="12">
      <div class="container" id="rtsp-player" :accessToken="accessToken"></div>
    </v-col>
    <v-col cols="12">
      <v-card elevation="0">
        <v-card-actions>
          <v-spacer />
          <v-btn-toggle>
            <v-btn small fab color="orange" @click="play()">
              <v-icon dark>mdi-play-circle-outline</v-icon>
            </v-btn>
            <v-btn small fab color="red" @click="stop()">
              <v-icon dark>mdi-stop-circle-outline</v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import EZUIKit from 'ezuikit-js'
import EventBus from '../eventBus.js'

export default {
  props: ['accessToken'],
  data () {
    return {
      player: null
    }
  },
  mounted () {
    this.player = new EZUIKit.EZUIKitPlayer({
      id: 'rtsp-player',
      autoplay: false,
      url: 'ezopen://XAZRWT@isgpopen.ezviz.com/F66643443/1.live',
      accessToken: this.accessToken,
      decoderPath: '',
      template: 'simple',
      height: (window.innerWidth < 600) ? window.innerHeight / 3 : window.innerHeight / 2,
      width: window.innerWidth
    })
    EventBus.$on('trigger', (value) => {
      if (value === true) {
        this.stop()
      }
    })
  },
  methods: {
    play () {
      this.player.play()
    },
    stop () {
      this.player.stop()
    }
  }
}
</script>
<style scoped>
  .container{
    display: flex;
    flex-wrap: wrap;
  }
</style>
