<template>
  <v-container class="fill-height flex-column justify-center">
    <!-- tools -->
    <div class="tool-panel">
      <v-col>
        <v-row class="justify-end">
          <v-btn class="font-weight-black" color="error" text
            @click="doLogout">로그아웃</v-btn>
        </v-row>
        <v-row class="justify-end">
          <v-btn class="font-weight-black" text
            @click="getResource">보호된 자원 가져오기</v-btn>
        </v-row>
        <v-row class="justify-end">
          <v-btn class="font-weight-black" text
            @click="removeResource">모두 지우기</v-btn>
        </v-row>
      </v-col>
    </div>

    <!-- contents -->
    <v-sheet elevation="1" class="pa-3 px-12 mx-auto">
      <p v-for="data in renderData" class="mb-0 title" :key="data" v-text="data" />
    </v-sheet>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import { post } from 'axios';

export default {
  name: 'home',
  data: () => ({
    renderData: [],
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
     * @return {Boolean} result
     */
    async getResource() {
      const { data: res } = await post(`${this.$env.host}/filter`, {
        target: 'resource-server',
        payload: {
          accessToken: this.accessToken,
          userId: this.userId,
        },
      });

      // unauthorized (http 401)
      if (res.statusCode === 401) {
        // clear
        this.clearToken();
        this.$router.push('login');

        return false; // error
      }

      // forbidden (http 403, need re-issue token)
      if (res.statusCode === 403) {
        //

        return false;
      }

      // append data
      this.renderData.push(res.body);

      return true;
    },
    // vuex
    ...mapActions([
      'clearToken',
    ]),
    /**
     * remove all resources
     */
    removeResource() {
      this.renderData = [];
    },
  },
};
</script>

<style lang="scss" scoped>
div.tool-panel {
  position: absolute;
  right: 0.5em;
  top: 0;
}
</style>
