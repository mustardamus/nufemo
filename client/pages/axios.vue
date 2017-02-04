<template>
  <div>
    <h1>axios page</h1>
    <h2>{{title}} huh</h2>

    <div v-for="post in posts">
      {{post.title}}
    </div>
  </div>
</template>

<script>
  import services from '../services'

  export default {
    head: {
      title: 'Axios testing page brah'
    },

    async data () {
      let res = await services.posts.find()

      return {
        posts: res.data,
        title: 'neat'
      }
    }
  }
</script>
