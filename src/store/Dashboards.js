import Vue from 'vue'
import firebase from '../firebase'
import { getDatabase, ref, onValue, query, limitToLast } from 'firebase/database'
import axios from 'axios'
import VueAxios from 'vue-axios'
import qs from 'qs'

Vue.use(firebase, axios, VueAxios)
const dashboards = {
  namespaced: true,
  state: {
    icons: [
      { id: 'pH', title: 'pH', fileName: 'ph.png' },
      { id: 'suhu', title: 'Suhu', fileName: 'suhu.png' },
      { id: 'tds', title: 'TDS', fileName: 'nutrition.png' }
    ],
    lastSenData: [],
    senData: [],
    dataGrafik: {},
    opsiGrafik: {},
    dialog: false,
    camDialog: false,
    loading: false,
    header: '',
    playerOption: ''
  },
  actions: {
    loadLastData ({ commit }) {
      const database = getDatabase(firebase)
      const dataSensor = query(ref(database, 'datasensor'), limitToLast(1))
      onValue(dataSensor, (DataSnapshot) => {
        const data = DataSnapshot.val()
        // console.log(data)
        commit('SET_LASTDTSENSOR', data)
      })
    },
    loadDetail ({ dispatch, commit }, part) {
      commit('SET_LOADING', true)
      // load data (inti)
      const database = getDatabase(firebase)
      const dataSensor = ref(database, 'datasensor')
      onValue(dataSensor, (DataSnapshot) => {
        const resp = DataSnapshot.val()
        const groupBy = (array, key) => {
          return array.reduce((result, currentValue, currentIndex) => {
            if (!result[currentValue[key]]) {
              result[currentValue[key]] = []
            }
            result[currentValue[key]].push(currentValue)
            return result
          }, {})
        }
        const groupbyTgl = groupBy(Object.values(resp), 'tanggal')
        const tglsekarang = new Date()
        const keyHapus = tglsekarang.getDate() + '-' + (tglsekarang.getMonth() + 1) + '-' + tglsekarang.getFullYear()
        // hapus tanggal yang baru masuk
        delete groupbyTgl[keyHapus]
        // Setting Data Tabel
        const groupforTabel = []
        const datalb = []
        const dataGP = []
        const dataGSi = []
        const dataGSo = []
        const groupforChart = {}
        for (let i = 0; i < Object.keys(groupbyTgl).length; i++) {
          const pecahStringTgl = Object.keys(groupbyTgl)[i].split('-')
          const tgl = new Date(pecahStringTgl[2], pecahStringTgl[1], pecahStringTgl[0]).getTime()
          const tglacuan = new Date(2021, 10, 27).getTime()
          if (tgl > tglacuan) {
            const entri = {}
            entri.tanggal = Object.keys(groupbyTgl)[i]
            entri.pagi = (Object.values(groupbyTgl)[i][3][part]).toFixed(2)
            entri.siang = (Object.values(groupbyTgl)[i][6][part]).toFixed(2)
            entri.sore = (Object.values(groupbyTgl)[i][8][part]).toFixed(2)
            groupforTabel.push(entri)
            // grafik
            datalb.push(entri.tanggal)
            dataGP.push(entri.pagi)
            dataGSi.push(entri.siang)
            dataGSo.push(entri.sore)
          }
        }
        // mengambil 4 data terakhir untuk ditampilkan di grafik
        datalb.splice(0, datalb.length - 4)
        dataGP.splice(0, dataGP.length - 4)
        dataGSi.splice(0, dataGSi.length - 4)
        dataGSo.splice(0, dataGSo.length - 4)
        groupforChart.labels = datalb
        groupforChart.datasets = [{ label: 'Data Pagi', backgroundColor: 'rgba(245, 189, 39, 0.5)', borderColor: 'rgb(240, 235, 226)', borderWidth: '1', data: dataGP }, { label: 'Data Sore', backgroundColor: 'rgba(255, 64, 0, 0.5)', borderColor: 'rgb(240, 235, 226)', borderWidth: '1', data: dataGSi }, { label: 'Data Sore', backgroundColor: 'rgba(164, 255, 73, 0.5)', borderColor: 'rgb(240, 235, 226)', borderWidth: '1', data: dataGSo }]
        commit('SET_SENDATA', groupforTabel)
        commit('SET_DATAGRAFIK', groupforChart)
      })
      dispatch('setDialog', true)
      dispatch('setHeader', part)
      commit('SET_LOADING', false)
    },
    loadCamera ({ dispatch, commit }) {
      dispatch('setCamDialog', true)
      // get accessToken and expired date
      const accessToken = (localStorage.getItem('accTok')) ? localStorage.getItem('accTok') : ''
      const expireTime = (localStorage.getItem('expTime')) ? localStorage.getItem('expTime') : ''
      const tglAkses = new Date().getTime()
      if (accessToken === '' || expireTime < tglAkses) {
        localStorage.removeItem(accessToken)
        localStorage.removeItem(expireTime)
        const loadAccessToken = async () => {
          try {
            const param = {
              appKey: 'e0c266094894468dbd67aaa4cb4c529a',
              appSecret: 'c7bc93ee7df44601a8e1b7e867136020'
            }
            const response = await axios({
              method: 'post',
              url: 'https://isgpopen.ezvizlife.com/api/lapp/token/get',
              data: qs.stringify(param),
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            console.log(response.data)
            const resp = response.data
            localStorage.setItem('accTok', resp.data.accessToken)
            localStorage.setItem('expTime', resp.data.expireTime)
          } catch {
            console.log('sangsot')
          }
        }
        loadAccessToken()
      }
      const accessTokenFinal = localStorage.getItem('accTok')
      commit('SET_PARAMPLAYER', accessTokenFinal)
    },
    setCamDialog ({ commit }, value) {
      commit('SET_CAMDIALOG', value)
    },
    setDialog ({ commit }, value) {
      commit('SET_DIALOG', value)
    },
    setHeader ({ commit }, value) {
      commit('SET_HEADER', value)
    }
  },
  mutations: {
    SET_LASTDTSENSOR: (state, value) => {
      state.lastSenData = value
    },
    SET_CAMDIALOG: (state, value) => {
      state.camDialog = value
    },
    SET_DIALOG: (state, value) => {
      state.dialog = value
    },
    SET_HEADER: (state, value) => {
      state.header = value
    },
    SET_OPSIGRAFIK: (state, value) => {
      state.opsiGrafik = value
    },
    SET_SENDATA: (state, value) => {
      state.senData = value
    },
    SET_DATAGRAFIK: (state, value) => {
      state.dataGrafik = value
    },
    SET_LOADING: (state, value) => {
      state.loading = value
    },
    SET_PARAMPLAYER: (state, value) => {
      state.playerOption = value
    }
  }
}

export default dashboards
