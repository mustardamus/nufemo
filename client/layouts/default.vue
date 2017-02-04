<style lang="sass">
  $fa-font-path: "~font-awesome/fonts"

  @import "~bulma/bulma.sass"
  @import "~font-awesome/scss/font-awesome.scss"
</style>

<template>
  <div id="app">
    <div class="container">
      <nav-bar
        :currentUser="currentUser"
        :isLoggedIn="isLoggedIn"
        @logout="onLogout"
      />
    </div>

    <div class="container">
      <nuxt/>
    </div>
  </div>
</template>

<script>
  import NavBar from '../components/nav-bar'
  import services from '../services'

  export default {
    head: {
      title: 'Ow, default title'
    },

    components: { NavBar },

    computed: {
      currentUser () {
        return this.$store.state.user.currentUser
      },

      isLoggedIn () {
        return this.$store.getters['user/isLoggedIn']
      }
    },

    created () {
      if (process.BROWSER_BUILD) {
        let token = services.app.get('token')

        if (token) {
          this.$store.dispatch('user/loginToken', token)
        }
      }
    },

    methods: {
      onLogout () {
        this.$store.dispatch('user/logout')
        .then(() => this.$router.push({ name: 'index' }))
        .catch(err => console.log('show err', err))
      }
    }
  }
</script>
