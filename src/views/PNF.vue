<template>
  <v-container class="flex-column fill-height justify-center">
    <span class="display-4">404</span>
    <span class="display-1"><router-link to="/">돌아가기</router-link></span>
  </v-container>
</template>

<script>
export default {
  name: 'pnf',
};
</script>

<style lang="scss" scoped>
div.container > span {
  font-family: bm-jua !important;
}
</style>
