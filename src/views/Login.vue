<template>
  <!-- subroot for background -->
  <div class="subroot fill-height">
    <!-- background overlay -->
    <div class="background-overlay" />

    <!-- contents -->
    <v-container class="contents fill-height pa-5">
      <!-- register -->
      <v-col class="text-center" v-if="registerMode" key="register">
        <!-- title -->
        <span class="content-title white--text display-3">가 입</span>

        <!-- input fields -->

        <!--
          id field (mask: id)
          rules: required, length6, needA, needD, failToRegister
          -->
        <v-text-field class="mt-9" single-line dark
          hint="숫자, 영문자를 섞어 6자리 이상 입력해주세요" label="아이디"
          v-model="idField" v-mask="mask.id" counter maxlength="32"
          :rules="[rules.required, rules.length6, rules.needA, rules.needD, failToRegister]"
          :disabled="isLoading"
          @input="isRegisterFail = false" />

        <!--
          password field (mask: password)
          rules: required, length12, specialChar2, combineANS
          -->
        <v-text-field class="mt-0 pt-0" single-line dark
          :append-icon="showPasswordFieldIcon"
          :type="passwordShow ? 'text' : 'password'"
          hint="특수문자, 숫자, 영문자를 섞어 12자리 이상 입력해주세요" label="비밀번호"
          v-model="passwordField" v-mask="mask.password" counter maxlength="32"
          :rules="[rules.required, rules.length12, rules.specialChar2, rules.combineANS]"
          :disabled="isLoading"
          @click:append="passwordShow = !passwordShow"
          @input="isRegisterFail = false" />

        <!--
          confirm password field (mask:password)
          rules: required, checkConfirmPasswordEqual
          -->
        <v-text-field class="mt-0 pt-0" single-line dark
          label="비밀번호 확인" type="password"
          v-model="confirmPasswordField" v-mask="mask.password"
          :rules="[rules.required, checkConfirmPasswordEqual]" :disabled="isLoading"
          @input="isRegisterFail = false" />

        <!-- buttons -->

        <v-btn class="mt-8" color="primary" tile block x-large
          @click="doRegister" :disabled="isLoading">가입고고</v-btn>

        <v-btn class="mt-4 blue--text text--accent-1" tile block x-large text
          @mouseup="registerMode = false" :disabled="isLoading">로그인 페이지</v-btn>
      </v-col>

      <!-- login -->
      <v-col class="text-center" v-else key="login">
        <!-- title -->
        <span class="display-4">⚡️🔐</span>

        <!-- input fields -->

        <!--
          id field (mask: id)
          rules: required, failToLogin
          -->
        <v-text-field class="mt-9"
          label="아이디" single-line dark :disabled="isLoading"
          v-model="idField" v-mask="mask.id" :rules="[rules.required, failToLogin]"
          @input="isLoginFail = false" />

        <!--
          password field (mask: password)
          rules: required
          -->
        <v-text-field class="mt-0 pt-0"
          label="비밀번호" single-line dark :disabled="isLoading"
          :append-icon="showPasswordFieldIcon"
          :type="passwordShow ? 'text' : 'password'"
          v-model="passwordField" v-mask="mask.password"
          :rules="[rules.required]"
          @click:append="passwordShow = !passwordShow"
          @input="isLoginFail = false" />

        <!-- register message -->
        <p class="grey--text text--lighten-5 float-right mb-8">
          아이디가 없으신가요?
          <span class="pl-2 blue--text text--accent-1"
            style="cursor: pointer"
            @click="registerMode = true">회원가입</span>
        </p>

        <!-- login button -->
        <v-btn color="primary" tile block x-large :disabled="isLoading"
          @click="doLogin">
          <template v-if="isLoading"><v-progress-circular indeterminate color="amber" /></template>
          <template v-else>로그인</template>
        </v-btn>
      </v-col>
    </v-container>
  </div>
</template>

<script>
import * as VueTheMask from 'vue-the-mask';
import _ from 'lodash';
import { post } from 'axios';
import { mapGetters, mapActions, mapMutations } from 'vuex';

/**
 * check a staring using regular expression and length
 * @param {String} str target
 * @param {RegExp} regex regular expression
 * @param {number} len minima length
 * @return {Boolean} validation result
 */
// eslint-disable-next-line max-len
const checkRegexWithCount = (str, regex, len) => _.reduce(str, (r, c) => (regex.test(c) ? r + 1 : r), 0) >= len;

export default {
  name: 'login',
  data: () => ({
    // input field models
    idField: '',
    passwordField: '',
    confirmPasswordField: '',

    // input field env
    passwordShow: false,
    isLoading: false, // for loading progress circle
    isLoginFail: false, // for messaging
    isRegisterFail: false,

    // page mode
    registerMode: false,

    // input field masks
    mask: {
      id: _.repeat('X', 32), // X: number + alphabet
      password: _.repeat('P', 32), // P: custom rule
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
      needD: v => checkRegexWithCount(v, /[0-9]/, 1)
        || '숫자를 하나 이상 사용해주세요',
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
    checkConfirmPasswordEqual() {
      return (this.passwordField === this.confirmPasswordField) || '입력한 비밀번호와 동일하게 입력해주세요';
    },
    /**
     * check user authorization is fail
     * @return {Boolean} validation result
     */
    failToLogin() {
      return !this.isLoginFail || '사용자 인증에 실패하였습니다';
    },
    /**
     * check registration is fail
     * @return {Boolean} validation result
     */
    failToRegister() {
      return !this.isRegisterFail || '계정 생성에 실패하였습니다';
    },
    // vuex
    ...mapGetters([
      'isTokenEmpty',
    ]),
  },
  methods: {
    /**
     * login action
     * 1. Request Auth Grant
     * 2. Request Tokens
     * @return {Boolean} validation result
     */
    async doLogin() {
      // check token is empty
      if (!this.isTokenEmpty) { // token is not empty => wrong state
        // clear all tokens
        this.clearToken();

        // validation failed
        this.isLoginFail = true;

        return false;
      }

      // start loading
      this.isLoading = true;

      // 1. Request Auth Grant
      const { data: respResOwner } = await post(`${this.$env.host}/filter`, {
        target: 'resource-owner',
        payload: {
          userId: this.idField,
          password: this.passwordField,
        },
      });

      // check status code
      if (respResOwner.statusCode !== 200) {
        // validation failed
        this.isLoginFail = true;

        // stop loading
        this.isLoading = false;
        return false;
      }

      // get Auth Grant ID
      const { body: grant } = respResOwner;

      // 2. Request Tokens
      const { data: respAuthServer } = await post(`${this.$env.host}/filter`, {
        target: 'authorization-server',
        payload: {
          grant,
          userId: this.idField,
        },
      });

      // end loading
      this.isLoading = false;

      // check status code (wrong pattern => duplicated code)
      if (respResOwner.statusCode !== 200) {
        // validation failed
        this.isLoginFail = true;
        return false;
      }

      // set token
      this.setToken(_.flowRight(
        ([accessToken, refreshToken]) => ({ accessToken, refreshToken }),
        _.partial(_.get, _, 'body'),
      )(respAuthServer));

      // set user id
      this.updateUserId(this.idField);

      // move to home page
      this.$router.push('/');

      return true;
    },
    /**
     * register action
     * @return {Boolean} validation result
     */
    async doRegister() {
      // start loading
      this.isLoading = true;

      // id, password validation
      const { data: resp } = await post(`${this.$env.host}/filter`, {
        target: 'resource-owner',
        payload: {
          userId: this.idField,
          password: this.passwordField,
          isRegister: true,
        },
      });

      // check status code
      if (resp.statusCode !== 201) {
        // validation failed
        this.isRegisterFail = true;
        this.isLoading = false;

        return false;
      }

      // end loading
      this.isLoading = false;

      // go to the login page
      this.registerMode = false;

      return true;
    },
    // vuex
    ...mapActions([
      'setToken',
      'clearToken',
    ]),
    ...mapMutations([
      'updateUserId',
    ]),
  },
  watch: {
    /**
     * init fields when registration mode changed
     */
    registerMode() {
      this.idField = '';
      this.passwordField = '';
      this.confirmPasswordField = '';
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

  // register title
  & span.content-title {
    font-family: bm-jua !important;
  }
}
</style>
