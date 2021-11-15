import Vue from 'vue'
import Vuex from 'vuex'
import Dashboards from './store/Dashboards'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    dashboard: Dashboards
  }
})
