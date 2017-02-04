<template>
  <form @submit.prevent="onSubmit">
    <label class="label" for="username">Username</label>
    <p class="control has-icon has-icon-left">
      <input id="username" type="text" placeholder="Username"
        :class="{ input: true, 'is-danger': $v.username.$error }"
        v-model.trim="username"
      >

      <span class="icon is-small" v-if="!$v.username.$error">
        <i class="fa fa-user"></i>
      </span>
      <span class="icon is-small" v-else>
        <i class="fa fa-warning"></i>
      </span>

      <span class="help is-danger" v-if="$v.username.$error && !$v.username.required">
        Username is required
      </span>
      <span class="help is-danger" v-if="$v.username.$error && !$v.username.username">
        Username can only contain letters and numbers
      </span>
    </p>

    <label class="label" for="password">Password</label>
    <p class="control has-icon has-icon-left">
      <input id="password" type="password" placeholder="********"
        :class="{ input: true, 'is-danger': $v.password.$error }"
        v-model.trim="password"
      >

      <span class="icon is-small" v-if="!$v.password.$error">
        <i class="fa fa-asterisk"></i>
      </span>
      <span class="icon is-small" v-else>
        <i class="fa fa-warning"></i>
      </span>

      <span class="help is-danger" v-if="$v.password.$error && !$v.password.required">
        Password is required
      </span>
      <span class="help is-danger" v-if="$v.password.$error && !$v.password.minLength">
        Must be at least 8 characters long
      </span>
    </p>

    <p class="control">
      <button class="button is-primary" type="submit">Login</button>
    </p>
  </form>
</template>

<script>
  import { required, minLength } from 'vuelidate/lib/validators'
  import { username } from '../../helpers/validations'

  export default {
    head: {
      title: 'Login'
    },

    data () {
      return {
        username: '',
        password: ''
      }
    },

    validations: {
      username: { required, username },
      password: {
        required,
        minLength: minLength(8)
      }
    },

    mounted () {
      document.getElementById('username').focus()
    },

    methods: {
      onSubmit () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.loginUser()
        }
      },

      loginUser () {
        this.$store.dispatch('user/loginCredentials', {
          username: this.username,
          password: this.password
        })
        .then(() => this.$router.push({ name: 'index' }))
        .catch(err => console.log('show err', err))
      }
    }
  }
</script>
