<template>
  <v-app>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>

export default {
  name: 'app',
};
</script>

<style lang="scss">
/* global */

html {
  overflow-y: hidden !important;
}

// fonts
@font-face { // 배민 주아체
  font-family: bm-jua;
  src: url('./assets/fonts/BMJUA_ttf.ttf');
}

@font-face {
  font-family: bm-hanna;
  src: url('./assets/fonts/BMHANNA_11yrs_ttf.ttf');
}
</style>
