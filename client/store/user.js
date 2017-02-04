import services from '../services'

export const state = {
  currentUser: null
}

export const getters = {
  isLoggedIn (state) {
    return state.currentUser !== null
  }
}

export const mutations = {
  SET_CURRENT_USER (state, data) {
    state.currentUser = data
  },

  CLEAR_CURRENT_USER (state) {
    state.currentUser = null
  }
}

export const actions = {
  loginCredentials ({ commit }, { username, password }) {
    return new Promise((resolve, reject) => {
      services.app.authenticate({ type: 'local', username, password })
      .then(res => {
        commit('SET_CURRENT_USER', res.data)
        resolve(res.data)
      })
      .catch(err => reject(err))
    })
  },

  loginToken ({ commit }, token) {
    return new Promise((resolve, reject) => {
      services.app.authenticate({ type: 'token', token })
      .then(res => {
        commit('SET_CURRENT_USER', res.data)
        resolve(res.data)
      })
      .catch(err => reject(err))
    })
  },

  logout ({ commit }) {
    services.app.logout()
    commit('CLEAR_CURRENT_USER')
  },

  create ({ dispatch }, { username, email, password }) {
    return new Promise((resolve, reject) => {
      services.users.create({ username, email, password })
      .then(res => {
        dispatch('loginCredentials', { username, password })
        resolve(res)
      })
      .catch(err => reject(err))
    })
  }
}
