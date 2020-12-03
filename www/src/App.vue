<template>
  <div class="graveyard-page container">
    <a href="https://github.com/MikeyDunn/graveyard" target="_blank">github</a>
    <a href="mailto:contact@st.lk" target="_blank">contact</a>
    <a href="https://destiny.gg" target="_blank">destiny.gg</a>

    <h1>
      destiny's graveyard
      <div class="loader" v-if="loading"></div>
    </h1>

    <div v-for="(ban, index) in banList" :key="index">
      <blockquote>
        <div v-for="(message, index) in ban.messages" :key="index">
          <small class="timestamp">[{{ parseDate(message.time) }}]</small>&nbsp;
          <u>{{ ban.user }}:</u>
          {{ message.message }}
        </div>
        <br />
        <small>
          <b>!ipban {{ ban.duration }} {{ ban.user }} {{ ban.reason }}</b>
        </small>
      </blockquote>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Graveyard',
  data () {
    return {
      loading: false,
      banList: []
    }
  },
  created () {
    this.getBans()
  },
  methods: {
    async getBans () {
      this.loading = true

      try {
        const url = 'https://k76f10w2u3.execute-api.us-east-1.amazonaws.com/dev/bans'
        const resp = await fetch(url)
        const data = await resp.json()

        this.banList = data
      } catch (e) {}

      this.loading = false
    },
    parseDate (date) {
      const dateTime = new Date(date.replace(/-/g, '/'))

      return dateTime.toTimeString().split(' ')[0]
    }
  }
}
</script>

<style>
body {
  overflow-y: scroll;
  max-width: 550px;
  margin: 5px auto;
}

.graveyard-page h1 {
  margin: 35px 0 50px;
}

.graveyard-page a {
  margin-right: 15px;
  text-decoration: underline;
  color: #333;
}

blockquote {
  animation: fadein 0.33s;
}

.timestamp {
  color: black;
  font-size: 8px;
  font-weight: 900;
}

.loader {
  float: right;
  margin-top: 10px;
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadein {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
