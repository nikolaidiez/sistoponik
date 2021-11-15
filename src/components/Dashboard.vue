<template>
  <div>
    <span class="bg">
      <v-container class="pb-15 mx-0" v-for="(data, item) in dataSensorLast" :key="item">
        <v-row>
          <v-col class="text-left">
            <v-chip label class="mx-1 px-3 font-weight-black" color="orange" text-color="white">
              <v-icon left>mdi-calendar-check</v-icon>
              {{ data.tanggal }}
            </v-chip>
            <v-chip label class="px-3 font-weight-black" color="green" text-color="white">
              <v-icon left>mdi-update</v-icon>
              {{ data.waktu }}
            </v-chip>
          </v-col>
        </v-row>
        <v-row class="ma-auto" dense>
          <v-col v-for="(parameter,index) in icon" :key="index" class="mb-2" cols="6" xs="3" sm="3" md="3">
            <v-card outlined class="py-5">
                <v-img :src="require('../assets/'+icon[index].fileName+'')" max-width="128" class="mx-auto my-3"></v-img>
            </v-card>
            <v-divider></v-divider>
            <v-card color="blue-grey" class="mb-2">
              <v-chip dark label color="orange darken-3" class="body-2 font-weight-black mt-n10 ml-n1" :class="{'caption':$vuetify.breakpoint.smAndDown}">{{ parameter.title }}</v-chip>
              <v-row>
                <v-col cols="7" :class="{'title':$vuetify.breakpoint.mdAndDown}" class="text-right white--text display-1 font-weight-black">
                  {{ data[parameter.id].toFixed(2) }}
                </v-col>
                <v-col cols="4" class="mt-6 ml-auto mr-2">
                  <v-btn :loading=loading dark small color="orange" @click="loadDetail(parameter.id)">
                    <v-icon :class="{'subtitle-2':$vuetify.breakpoint.mdAndDown}">mdi-chart-box</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>
        <v-row>
          <v-dialog
          v-model="dialog"
          fullscreen
          transition="dialog-bottom-transition">
            <v-card>
              <v-toolbar color='grey lighten-2'>
                <v-icon class="mdi mdi-database-check mdi-48px green--text mr-2 ml-n1"></v-icon>
                <v-toolbar-title class="title font-weight-bold orange--text">Data {{ header }}</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  @click="dialog = false">
                  <v-icon>mdi-close-box</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-data-table :items-per-page="itemCount" :headers="headersTabel" :items="dataSensor" item-key="tanggal" class="elevation-5 mt-5 rounded">
                    </v-data-table>
                  </v-col>
                  <v-col cols="12" md="5" sm="12" xs="12">
                    <bar-chart dense class="mt-2" :chart-data="chartValue" :options="barOptions"/>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
         <v-row>
          <v-dialog
          v-model="camDialog"
          fullscreen
          transition="dialog-bottom-transition">
            <v-card>
              <v-toolbar color='grey lighten-2'>
                <v-icon class="mdi mdi-video-wireless mdi-32px green--text mr-2 ml-n1"></v-icon>
                <v-toolbar-title class="title font-weight-bold orange--text">IP Camera</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn
                  icon
                  @click="updateTriggerToStop();camDialog = false">
                  <v-icon>mdi-close-box</v-icon>
                </v-btn>
              </v-toolbar>
              <v-card-text>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-card class="mt-5">
                      <RTSPPlayer :accessToken="playerValue" />
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </span>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
import BarChart from './BarChart'
import RTSPPlayer from './RTSPPlayer'
import EventBus from '../eventBus.js'

export default {
  name: 'Dashboard',
  components: {
    BarChart, RTSPPlayer
  },
  data () {
    return {
      player: '',
      itemCount: 5,
      headersTabel: [
        {
          text: 'Tanggal',
          sortable: true,
          value: 'tanggal',
          class: 'blue-grey lighten-4 text-body-1 font-weight-black',
          cellClass: 'text-subtitle-2 font-weight-black',
          align: 'end'
        },
        {
          text: 'Data Pagi',
          sortable: true,
          value: 'pagi',
          class: 'text-body-1 font-weight-black white--text',
          cellClass: 'text-body-2 font-weight-medium',
          align: 'end'
        },
        {
          text: 'Data Siang',
          sortable: true,
          value: 'siang',
          class: 'text-body-1 font-weight-black white--text',
          cellClass: 'text-body-2 font-weight-medium',
          align: 'end'
        },
        {
          text: 'Data Sore',
          sortable: true,
          value: 'sore',
          class: 'text-body-1 font-weight-black white--text',
          cellClass: 'text-body-2 font-weight-medium',
          align: 'end'
        }
      ],
      barOptions: {
        responsive: true,
        maintainAspectRatio: false,
        title:
          {
            display: true,
            text: 'Data 4 Hari Terakhir',
            fontSize: 20,
            padding: 10
          },
        legend:
          {
            display: true,
            position: 'bottom'
          }
      }
    }
  },
  computed: {
    ...mapState({
      dataSensorLast: state => state.dashboard.lastSenData,
      dataSensor: state => state.dashboard.senData,
      dataGrafik: state => state.dashboard.dataGrafik,
      icon: state => state.dashboard.icons,
      acDialog: state => state.dashboard.dialog,
      acCamDialog: state => state.dashboard.camDialog,
      acHeader: state => state.dashboard.header,
      acLoading: state => state.dashboard.loading,
      paramPlayer: state => state.dashboard.playerOption
    }),
    dialog: {
      get () {
        return this.acDialog
      },
      set (value) {
        this.setDialog(value)
      }
    },
    camDialog: {
      get () {
        return this.acCamDialog
      },
      set (value) {
        this.setCamDialog(value)
      }
    },
    header: {
      get () {
        return this.acHeader
      },
      set (value) {
        this.setHeader(value)
      }
    },
    loading: {
      get () {
        return this.acLoading
      }
    },
    chartValue: {
      get () {
        return this.dataGrafik
      }
    },
    playerValue: {
      get () {
        return this.paramPlayer
      }
    }
  },
  mounted: function () {
    this.$store.dispatch('dashboard/loadLastData')
  },
  created () {
    document.title = 'Dashboard Sistoponik'
  },
  methods: {
    ...mapActions({
      setDialog: 'dashboard/setDialog',
      setCamDialog: 'dashboard/setCamDialog',
      setHeader: 'dashboard/setHeader'
    }),
    loadDetail (part) {
      this.$store.dispatch('dashboard/loadDetail', part)
    },
    updateTriggerToStop () {
      EventBus.$emit('trigger', true)
    }
  }
}
</script>
<style>
.bg {
  width: 100%;
  height: 100%;
  position: absolute;
}
tbody tr:nth-of-type(odd) {
   background-color: #F5F5F5
}
tbody td:nth-of-type(1) {
   background-color: #ECEFF1
}
thead > tr > th {
  background-color: #78909C
}
</style>
