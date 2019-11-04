<template>
  <v-app>
    <v-content>
      <!-- main contents -->
      <router-view/>

      <!-- testing tool panel -->
      <div class="tool-panel text-right">
        <!-- shuffle button -->
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-btn class="mb-2" text icon color="error"
              v-on="on" @click="shuffleToken"><v-icon>mdi-cached</v-icon></v-btn>
          </template>
          <span><i>주의: 문자열 섞음</i></span>
        </v-tooltip>

        <!-- tools -->
        <v-sheet class="pa-3 subtitle-2" elevation="2">
          <p @click="showChangeModal = true">Access Token: {{ accessToken | limitTexts }}</p>
          <p @click="showChangeModal = true">Refresh Token: {{ refreshToken | limitTexts }}</p>
          <p @click="showChangeModal = true">User ID: {{ userId }}</p>
          <v-checkbox class="mt-0" label="Expired Access Token" dense hide-details
            :value="isExpiredAccessToken" @change="switchIsExpiredAccessToken" />
          <v-checkbox class="mt-0" label="Expired Refresh Token" dense hide-details
            :value="isExpiredRefreshToken" @change="switchIsExpiredRefreshToken" />
        </v-sheet>
      </div>
    </v-content>

    <!-- message -->
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
      'shuffleToken',
    ]),
  },
  filters: {
    /**
     * limit text filter
     */
    limitTexts: v => (v.length > 20 ? `${v.slice(0, 5)}...${v.slice(-5)}` : v),
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
div.tool-panel {
  position: fixed;
  bottom: 1em;
  right: 0.7em;

  & > div.v-sheet > p {
    margin-bottom: 0;
    cursor: pointer;
  }
}
</style>
