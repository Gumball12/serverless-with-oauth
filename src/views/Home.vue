<template>
  <v-container class="fill-height flex-column justify-center">
    <!-- tools -->
    <div class="tool-panel">
      <v-col>
        <v-row class="justify-end">
          <v-btn class="font-weight-black" color="error" text tile
            @click="doLogout">로그아웃</v-btn>
        </v-row>
        <v-row class="justify-end">
          <v-btn class="font-weight-black" text tile
            @click="getResource">보호된 자원 가져오기</v-btn>
        </v-row>
        <v-row class="justify-end">
          <v-btn class="font-weight-black" text tile
            @click="removeResource">모두 지우기</v-btn>
        </v-row>
        <v-row class="justify-end">
          <v-btn class="font-weight-black grey--text" text tile
            @click="tutorial">설명</v-btn>
        </v-row>
      </v-col>
    </div>

    <!-- contents -->
    <v-sheet elevation="1" class="pa-3 px-12 mx-auto">
      <template v-for="(data, ind) in renderData">
        <!-- render data -->
        <p class="mb-0 title"
          v-if="!isImageData(data)" :key="`${data}-${ind}`" v-text="data" />
        <p class="mb-0" v-else :key="`${data}-${ind}`"><img :src="data" /></p>
      </template>
    </v-sheet>

    <!-- overlay -->
    <v-overlay class="tutorial-panel" opacity="0.86"
      :value="showOverlay" :z-index="0">
      <ol>
        <li>Access Token을 통해 보호된 자원을 가져올 수 있습니다.</li>
        <li>Access Token이 만료된 경우(<i>Access Token Expired</i>), Refresh Token을 통해 새로운 토큰을 가져옵니다.</li>
        <li>
          다음의 경우 사용자는 강제로 로그아웃됩니다.
          <ul>
            <li>모든 토큰(Access Token, Refresh Token)이 만료된 경우</li>
            <li>잘못된 토큰 값 또는 사용자 ID를 가지고 있는 경우</li>
          </ul>
        </li>
      </ol>
      <p class="caption font-italic mt-2 float-left">(화면이 작을 경우 UI가 겹쳐보일 수 있습니다)</p>
      <v-btn class="float-right indigo" tile
        @click="showOverlay = false" >닫기</v-btn>
      <v-btn class="float-right font-weight-black" color="green" text tile
        @click="goGitHub">깃허브</v-btn>
    </v-overlay>
  </v-container>
</template>

<script>
import { mapActions, mapState, mapMutations } from 'vuex';
import { post } from 'axios';

export default {
  name: 'home',
  data: () => ({
    renderData: [],

    // tutorial
    showOverlay: false,
  }),
  computed: {
    ...mapState([
      'accessToken',
      'refreshToken',
      'userId',
      'isExpiredAccessToken',
      'isExpiredRefreshToken',
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

      // messaging
      this.messaging('토큰 해제');
    },
    /**
     * get protected resource
     * @return {Boolean} validation result
     */
    async getResource() {
      const { data: res } = await post(`${this.$env.host}/filter`, {
        target: 'resource-server',
        payload: {
          accessToken: this.accessToken,
          userId: this.userId,
          isExpired: this.isExpiredAccessToken,
        },
      });

      // unauthorized (http 401)
      if (res.statusCode === 401) {
        // clear
        this.clearToken();
        this.$router.push('login');

        this.messaging('잘못된 토큰');

        return false; // error
      }

      // forbidden (http 403, need re-issue token)
      if (res.statusCode === 403) {
        this.getNewToken();

        return false;
      }

      // append data
      this.renderData.push(res.body);

      return true;
    },
    /**
     * get new token
     * @return {Boolean} validation result
     */
    async getNewToken() {
      const { data: res } = await post(`${this.$env.host}/filter`, {
        target: 'authorization-server',
        payload: {
          refreshToken: this.refreshToken,
          userId: this.userId,
          isExpired: this.isExpiredRefreshToken,
        },
      });

      // unauthorized (http 401 | http 403)
      if (res.statusCode !== 200) {
        // clear token
        this.clearToken();
        this.$router.push('login');

        this.messaging('모든 토큰 만료됨');

        return false;
      }

      // set new token
      this.setToken(res.body);

      this.messaging('토큰이 만료되어 새로운 토큰을 가져옴');

      return true;
    },
    /**
     * remove all resources
     */
    removeResource() {
      this.renderData = [];
    },
    /**
     * tutorial
     */
    tutorial() {
      this.showOverlay = true;
    },
    /**
     * check data is image
     * @return {Boolean} check result
     */
    isImageData(data) {
      return data.startsWith('data:image');
    },
    /**
     * go to the github page
     */
    goGitHub() {
      window.open('https://github.com/Gumball12/serverless-with-oauth', '_blank');
    },
    // vuex
    ...mapActions([
      'clearToken',
      'setToken',
    ]),
    ...mapMutations([
      'messaging',
    ]),
  },
};
</script>

<style lang="scss" scoped>
div.tool-panel {
  position: fixed;
  right: 0.5em;
  top: 0;
}

div.tutorial-panel {
  line-height: 2;
}
</style>
