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

    <label class="label" for="email">E-Mail</label>
    <p class="control has-icon has-icon-left">
      <input id="email" type="text" placeholder="your@email.com"
        :class="{ input: true, 'is-danger': $v.email.$error }"
        v-model.trim="email"
      >

      <span class="icon is-small" v-if="!$v.email.$error">
        <i class="fa fa-envelope"></i>
      </span>
      <span class="icon is-small" v-else>
        <i class="fa fa-warning"></i>
      </span>

      <span class="help is-danger" v-if="$v.email.$error && !$v.email.required">
        E-Mail is required
      </span>
      <span class="help is-danger" v-if="$v.email.$error && !$v.email.email">
        Must be a valid E-Mail address
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

    <label class="label" for="password">Password Confirmation</label>
    <p class="control has-icon has-icon-left">
      <input id="repeatPassword" type="password" placeholder="********"
        :class="{ input: true, 'is-danger': $v.repeatPassword.$error }"
        v-model.trim="repeatPassword"
      >

      <span class="icon is-small" v-if="!$v.repeatPassword.$error">
        <i class="fa fa-asterisk"></i>
      </span>
      <span class="icon is-small" v-else>
        <i class="fa fa-warning"></i>
      </span>

      <span class="help is-danger" v-if="$v.repeatPassword.$error && !$v.repeatPassword.required">
        Password confirmation is required
      </span>
      <span class="help is-danger" v-if="$v.repeatPassword.$error && !$v.repeatPassword.sameAsPassword">
        Password confirmation must match
      </span>
    </p>

    <p class="control">
      <button class="button is-primary" type="submit">Submit</button>
    </p>
  </form>
</template>

<script>
  import { required, email, minLength, sameAs } from 'vuelidate/lib/validators'
  import { username } from '../../helpers/validations'

  export default {
    head: {
      title: 'Register'
    },

    data () {
      return {
        username: '',
        email: '',
        password: '',
        repeatPassword: ''
      }
    },

    validations: {
      username: { required, username },
      email: { required, email },
      password: {
        required,
        minLength: minLength(8)
      },
      repeatPassword: {
        required,
        sameAsPassword: sameAs('password')
      }
    },

    mounted () {
      document.getElementById('username').focus()
    },

    methods: {
      onSubmit () {
        this.$v.$touch()

        if (!this.$v.$invalid) {
          this.createUser()
        }
      },

      createUser () {
        this.$store.dispatch('user/create', {
          username: this.username,
          email: this.email,
          password: this.password
        })
        .then(() => this.$router.push({ name: 'index' }))
        .catch(err => console.log('show err', err))
      }
    }
  }
</script>
