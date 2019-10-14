/**
 * testing for issue-12 / 아이디와 패스워드를 입력할 수 있는 폼 제공 <https://github.com/Gumball12/serverless-with-oauth/issues/12>
 * @author shj
 * @since 2019-10-10
 */

// import tetsing modules
import { expect } from 'chai';
import { shallowMount, createLocalVue } from '@vue/test-utils';

import { mask } from 'vue-the-mask';

// import target
import Login from '@/views/Login.vue';

// create test
describe('Login.vue', () => {
  /**
   * binding test
   */
  it('data <=> DOM binding test', () => {
    const localVue = createLocalVue();
    localVue.directive('mask', mask);

    // get wrapper
    const wrapper = shallowMount(Login, {
      localVue,
    });

    // get target instance
    const target = wrapper.find({ ref: 'id-input-field' });

    // define test text
    const text = 'test_id';

    // update data value
    wrapper.setData({ text });

    // check target value
    expect(target.text()).toBe(text);
  });
});
