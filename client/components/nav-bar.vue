<template>
  <nav class="nav">
    <div class="nav-left">
      <nuxt-link :to="{ name: 'index' }" class="nav-item" exact>
        <span class="icon">
          <i class="fa fa-home"></i>
        </span>
        <span>Home</span>
      </nuxt-link>

      <nuxt-link :to="{ name: 'axios' }" class="nav-item">
        <span class="icon">
          <i class="fa fa-cog"></i>
        </span>
        <span>Axios Test Page</span>
      </nuxt-link>
    </div>

    <span class="nav-toggle" @click="onNavToggleClick">
      <span></span>
      <span></span>
      <span></span>
    </span>

    <div :class="{ 'nav-right': true, 'nav-menu': true, 'is-active': menuActive }">
      <template v-if="isLoggedIn">
        <a class="nav-item" href="#settings-to-do">
          <span class="icon">
            <i class="fa fa-user"></i>
          </span>
          <span>Hello {{currentUser.username}}!</span>
        </a>

        <a class="nav-item" @click="onLogoutClick">
          <span class="icon">
            <i class="fa fa-sign-out"></i>
          </span>
          <span>Logout</span>
        </a>
      </template>

      <template v-else>
        <nuxt-link :to="{ name: 'login' }" class="nav-item">
          <span class="icon">
            <i class="fa fa-sign-in"></i>
          </span>
          <span>Login</span>
        </nuxt-link>

        <nuxt-link :to="{ name: 'register' }" class="nav-item">
          <span class="icon">
            <i class="fa fa-plus"></i>
          </span>
          <span>Register</span>
        </nuxt-link>
      </template>
    </div>
  </nav>
</template>

<script>
  export default {
    props: ['currentUser', 'isLoggedIn'],

    data () {
      return {
        menuActive: false
      }
    },

    watch: {
      '$route': 'onRouteChange'
    },

    methods: {
      onLogoutClick () {
        this.$emit('logout')
      },

      onNavToggleClick () {
        this.menuActive = !this.menuActive
      },

      onRouteChange () {
        this.menuActive = false
      }
    }
  }
</script>
