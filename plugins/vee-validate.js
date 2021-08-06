import Vue from 'vue';

import {
  ValidationProvider,
  ValidationObserver,
  extend,
  configure,
  setInteractionMode,
} from 'vee-validate';

import * as rules from 'vee-validate/dist/rules';

Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
setInteractionMode('eager');

Object.keys(rules).forEach((rule) => {
  extend(rule, {
    ...rules[rule],
  });
});

extend('numberOfCard', {
  validate(value) {
    const regex = /(^4[0-9]{12}(?:[0-9]{3})?$)|(^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$)|(3[47][0-9]{13})|(^3(?:0[0-5]|[68][0-9])[0-9]{11}$)|(^6(?:011|5[0-9]{2})[0-9]{12}$)|(^(?:2131|1800|35\d{3})\d{11}$)/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});

extend('cvv', {
  validate(value) {
    const regex = /^([0-9]{3,4})$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
  message: 'Please enter correct {_field_}',
});

export default ({ app }) => {
  configure({
    defaultMessage: (_field_, values) => app.i18n.t(`messages.${values._rule_}`, values),
  });
};
