<template>
  <v-container>
    Home
    <v-btn @click="doLogout">logout</v-btn>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'home',
  methods: {
    /**
     * logout action
     */
    doLogout() {
      // clear all token
      this.clearToken();

      // go to the login page
      this.$router.push('login');
    },
    // vuex
    ...mapActions([
      'clearToken',
    ]),
  },
};
</script>
