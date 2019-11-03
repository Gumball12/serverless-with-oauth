<template>
  <!-- subroot for background -->
  <div class="subroot fill-height">
    <!-- background overlay -->
    <div class="background-overlay" />

    <!-- contents -->
    <v-container class="contents fill-height pa-5">
      <!-- login -->
      <v-col class="text-center">
        <!-- title -->
        <span class="display-4">⚡️🔐</span>

        <!-- input fields -->

        <!--
          id field (mask: id)
          rules: required
        -->
        <v-text-field class="mt-9"
          label="아이디" single-line dark
          v-model="idField" v-mask="mask.id" :rules="[rules.required]" />

        <!--
          password field (mask: password)
          rules: required
        -->
        <v-text-field class="mt-0 pt-0"
          label="비밀번호" single-line dark
          :append-icon="showPasswordFieldIcon"
          :type="passwordShow ? 'text' : 'password'"
          v-model="passwordField" v-mask="mask.password"
          :rules="[rules.required]"
          @click:append="passwordShow = !passwordShow" />

        <!-- register message -->
        <p class="grey--text text--lighten-5 float-right mb-8">
          아이디가 없으신가요?
          <span class="pl-2 blue--text text--accent-4"
            style="cursor: pointer"
            @click="registerMode = true">회원가입</span>
        </p>

        <!-- login button -->
        <v-btn color="primary" tile block x-large
          @click="doLogin">로그인</v-btn>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import * as VueTheMask from 'vue-the-mask';
import { repeat, reduce } from 'lodash';
import { post } from 'axios';

/**
 * check a staring using regular expression and length
 * @param {String} str target
 * @param {RegExp} regex regular expression
 * @param {number} len minima length
 * @return {Boolean} validation result
 */
// eslint-disable-next-line max-len
const checkRegexWithCount = (str, regex, len) => reduce(str, (r, c) => (regex.test(c) ? r + 1 : r), 0) >= len;

export default {
  name: 'login',
  data: () => ({
    // input field models
    idField: '',
    passwordField: '',
    confirmPasswordField: '',

    // input field env
    passwordShow: false,

    // page mode
    registerMode: false,

    // input field masks
    mask: {
      id: repeat('X', 32), // X: number + alphabet
      password: repeat('P', 32), // P: custom rule
    },

    // input field rules
    rules: {
      required: v => Boolean(v) || '이 칸은 비워둘 수 없습니다',
      length6: v => v.length >= 6 || '6글자 이상을 입력해주세요',
      length12: v => v.length >= 12 || '12글자 이상을 입력해주세요',
      specialChar2: v => checkRegexWithCount(v, /[!@#$%^&*()\-_]/, 2)
        || '특수문자를 두 개 이상 사용해주세요',
      combineANS: v => (
        checkRegexWithCount(v, /[0-9]/, 1)
        && checkRegexWithCount(v, /[a-zA-Z]/, 1)
        && checkRegexWithCount(v, /[!@#$%^&*()\-_]/, 1) // it is difference with 'specialChar2' rule
      ) || '숫자, 영문자, 그리고 특수문자를 섞어서 사용해주세요',
      needA: v => checkRegexWithCount(v, /[a-zA-Z]/, 1)
        || '영문자를 하나 이상 사용해주세요',
    },
  }),
  directives: { // for input field mask
    mask: VueTheMask.mask, // using vue-the-mask
  },
  computed: {
    /**
     * show password field icon
     * @return {String} icon name or empty string
     */
    showPasswordFieldIcon() {
      if (this.passwordField.length >= 1) {
        return this.passwordField ? 'mdi-eye' : 'mdi-eye-off';
      }

      return '';
    },
    /**
     * check confirm-password has equal value with password field
     * @return {Boolean} validation result
     */
    checkConfirmPasswordEqual: () => (this.passwordField === this.confirmPasswordField) || '입력한 비밀번호와 동일하게 입력해주세요',
  },
  methods: {
    /**
     * login action
     */
    async doLogin() {
      // send user data
      const { data } = await post(`${this.$env.host}/filter`, {
        target: 'resource-owner',
        payload: {
          id: 'darwin',
          password: 'pass',
        },
      });

      console.log(data);
    },
  },
  created() {
    // append custom token rule 'P'
    // (allows alphabet, special char, number)
    VueTheMask.tokens.P = { pattern: /[a-zA-Z0-9!@#$%^&*()\-_]/ };
  },
};
</script>

<style lang="scss" scoped>
div.subroot { // subroot for background
  // actually, i can't choose this background image
  background: url('../assets/images/crossline-dots.png');

  // background-overlay
  & > div.background-overlay {
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }

  // contents
  & > div.contents {
    position: relative;
    max-width: 385px;
  }
}
</style>
