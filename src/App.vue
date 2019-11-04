<template>
  <v-app>
    <v-content>
      <!-- main contents -->
      <router-view/>

      <!-- testing tool panel -->
      <v-sheet class="pa-3 text-right subtitle-2" elevation="2">
        <p>Access Token: {{ accessToken }}</p>
        <p>Refresh Token: {{ refreshToken }}</p>
        <p>User ID: {{ userId }}</p>
        <v-checkbox class="mt-0" label="expired access token" dense hide-details
          :value="isExpiredAccessToken" @change="switchIsExpiredAccessToken" />
        <v-checkbox class="mt-0" label="expired refresh token" dense hide-details
          :value="isExpiredRefreshToken" @change="switchIsExpiredRefreshToken" />
      </v-sheet>

      <!-- message -->
    </v-content>
  </v-app>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'app',
  computed: {
    // vuex
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
     * switch is-expired access token value
     */
    switchIsExpiredAccessToken() {
      this.switchIsExpired('AccessToken');
    },
    /**
     * switch is-expired refresh token value
     */
    switchIsExpiredRefreshToken() {
      this.switchIsExpired('RefreshToken');
    },
    // vuex
    ...mapActions([
      'switchIsExpired',
    ]),
  },
};
</script>

<style lang="scss">
/* WARN: global style */

// fonts
@font-face { // 배민 주아체
  font-family: bm-jua;
  src: url('./assets/fonts/BMJUA_ttf.ttf');
}

@font-face { // 배민 한나체
  font-family: bm-hanna;
  src: url('./assets/fonts/BMHANNA_11yrs_ttf.ttf');
}
</style>

<style lang="scss" scoped>
div.v-sheet {
  position: fixed;
  bottom: 1em;
  right: 0.7em;

  & > p {
    margin-bottom: 0;
  }
}
</style>
