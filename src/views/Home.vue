<template>
  <v-container class="fill-height flex-column justify-center">
    <!-- logout button -->
    <v-btn class="logout-btn font-weight-black" color="error" text
      @click="doLogout">로그아웃</v-btn>

    <!-- contents -->
    <v-btn class="mb-5"
      @click="getProtectedResource">보호된 자원 가져오기</v-btn>

    <v-sheet elevation="1" class="mx-auto" v-text="renderData" />
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { post } from 'axios';

export default {
  name: 'home',
  data: () => ({
    renderData: '',
  }),
  computed: {
    ...mapState([
      'accessToken',
      'userId',
    ]),
  },
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
    /**
     * get protected resource
     */
    async getProtectedResource() {
      const { data: res } = await post(`${this.$env.host}/filter`, {
        target: 'resource-server',
        payload: {
          accessToken: this.accessToken,
          userId: this.userId,
        },
      });

      console.log(res);
    },
    // vuex
    ...mapActions([
      'clearToken',
    ]),
  },
};
</script>

<style lang="scss" scoped>
button.logout-btn {
  position: absolute;
  right: 2em;
  top: 2em;
}
</style>
