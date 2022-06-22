import Vue from 'vue';

import {
  ValidationProvider,
  ValidationObserver,
  extend,
  configure,
  setInteractionMode,
} from 'vee-validate';

import * as rules from 'vee-validate/dist/rules';
import { validateMnemonic } from 'bip39';
import BigNumber from 'bignumber.js';
import { utils } from 'web3';

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
    const americanExpress = /(?:3[47][0-9]{13})/;
    const dinersClub = /(?:3(?:0[0-5]|[68][0-9])[0-9]{11})/;
    const discover = /(?:6(?:011|5[0-9]{2})(?:[0-9]{12}))/;
    const jcb = /(?:(?:2131|1800|35\\d{3})\\d{11})/;
    const maestro = /(?:(?:5[0678]\\d\\d|6304|6390|67\\d\\d)\\d{8,15})/;
    const mastercard = /(?:(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12})/;
    const visa = /(?:4[0-9]{12})(?:[0-9]{3})?/;
    const cardNumber = value.replaceAll(/[^0-9]/g, '');
    const maxNumberLength = 19;
    const checkCardNumber = (number) => (americanExpress.test(number)
        || dinersClub.test(number) || discover.test(number) || jcb.test(number)
        || maestro.test(number) || mastercard.test(number) || visa.test(number))
      && number.length <= maxNumberLength;
    return {
      required: true,
      valid: checkCardNumber(cardNumber),
    };
  },
});

extend('cvv', {
  validate(value) {
    const regex = /^([0-9]{3,4})$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
});

extend('date', {
  validate(value) {
    const regex = /(?:0[1-9]|1[0-2])\/[0-9]{2}/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
});

extend('between-date', {
  params: ['from', 'to'],
  validate(value, { from, to }) {
    if (
      from === 'null'
      || to === 'null'
      || from === ''
      || to === '') {
      return {
        required: true,
        valid: true,
      };
    }
    const f = new Date(from);
    const t = new Date(to);
    return {
      required: true,
      valid: f <= t,
    };
  },
});

extend('from-to', {
  params: ['from', 'to'],
  validate(value, { from, to }) {
    if (
      from === 'null'
      || to === 'null'
      || from === ''
      || to === '') {
      return {
        required: true,
        valid: true,
      };
    }
    const f = new Date(from);
    const t = new Date(to);
    return {
      required: true,
      valid: f <= t,
    };
  },
});

extend('decimal', {
  validate(value) {
    const regex = /^[0-9]*[.,]?[0-9]+$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
});

extend('numeric', {
  validate(value) {
    const regex = /^\d+$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
});

extend('decimalPlaces', {
  validate(value, { places }) {
    const regex = new RegExp(`^\\d+\\.\\d{0,${places}}$`);
    return {
      required: true,
      valid: !value.toString().includes('.') || regex.test(value),
    };
  },
  params: ['places'],
});

extend('mnemonic', {
  validate(value) {
    return {
      required: true,
      valid: validateMnemonic(value),
    };
  },
});

extend('max_value', {
  validate(value, { max }) {
    return {
      required: true,
      valid: new BigNumber(value).isLessThanOrEqualTo(max),
    };
  },
  params: ['max'],
});

extend('min_value', {
  validate(value, { min }) {
    return {
      required: true,
      valid: new BigNumber(value).isGreaterThanOrEqualTo(min),
    };
  },
  params: ['min'],
});

extend('address', {
  validate(value) {
    return {
      required: true,
      valid: utils.isAddress(value),
    };
  },
});
extend('addressBech32', {
  validate(value) {
    const regex = /wq1[a-z-0-9]{3,41}$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
});

extend('text-title', {
  validate(value) {
    const regex = /\d{0,280}$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
});
extend('text-desc', {
  validate(value) {
    const regex = /\d{0,1000}$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
});

extend('percent', {
  validate(value) {
    const regex = /^100%?$|^\s*(\d{0,2})((\.|,)(\d*))?\s*%?\s*$/;
    return {
      required: true,
      valid: regex.test(value),
    };
  },
});

extend('greaterThanZero', {
  validate(value) {
    return (value > 0);
  },
});

extend('zeroFail', {
  validate(value) {
    const regex = /^[0][0-9]/;
    return {
      valid: !regex.test(value),
    };
  },
});

extend('notMoreDecimalPlaces', {
  validate(value) {
    return (((value.toString().includes('.')) ? (value.toString().split('.').pop().length) : (0)) < 4);
  },
});

extend('min_percent', {
  validate(value, { min }) {
    return +value.replace(/%/g, '') >= +min;
  },
  params: ['min'],
});

extend('max_percent', {
  validate(value, { max }) {
    return +value.replace(/%/g, '') <= +max;
  },
  params: ['max'],
});

extend('alpha_spaces_dash', {
  validate(value) {
    const regex = /^[\p{L}\-_\s]+$/u;
    return {
      valid: regex.test(value),
    };
  },
});

extend('notEmptyArray', {
  validate(value) {
    return (value.length > 0);
  },
});

extend('not_enough_funds', {
  validate(value, { balance }) {
    return {
      valid: new BigNumber(balance).isGreaterThan(0),
    };
  },
  params: ['balance'],
});

export default ({ app }) => {
  configure({
    defaultMessage: (_field_, values) => app.i18n.t(`messages.${values._rule_}`, values),
  });
};
