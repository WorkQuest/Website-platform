import Vue from 'vue';
import moment from 'moment';
import VueTippy, { TippyComponent } from 'vue-tippy';
import converter from 'bech32-converting';
import BigNumber from 'bignumber.js';
import heic2any from 'heic2any';
import modals from '~/store/modals/modals';
import { TokenSymbols } from '~/utils/enums';
import { images } from '~/utils/images';
import ENV, { IS_PROD } from '~/utils/addresses/index';

Vue.use(VueTippy);
Vue.component('tippy', TippyComponent);

Vue.mixin({
  data() {
    return {
      ENV,
    };
  },
  methods: {
    async HEICConvertTo(file, toType = 'images/jpeg') {
      try {
        return await heic2any({
          blob: file,
          toType,
        });
      } catch (e) {
        console.error('main/heicConvert', e);
        return null;
      }
    },
    ComingSoon() {
      this.ShowModal({
        key: modals.status,
        title: this.$t('modals.stillUnderConstruction'),
        text: this.$t('modals.coming'),
      });
    },
    EqualsArrays(a, b) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) return false;
      return true;
    },
    convertToBech32(prefix, address) {
      try {
        return converter(prefix).toBech32(address);
      } catch (e) {
        return address;
      }
    },
    convertToHex(prefix, address) {
      try {
        if (address.startsWith(prefix)) return converter(prefix).toHex(address);
        return address;
      } catch (e) {
        return address;
      }
    },
    async uploadFiles(files) {
      if (!files.length) return [];
      const fetchData = [];
      const fetchUrlsData = [];
      const medias = [];
      for (let i = 0; i < files.length; i += 1) {
        let { file } = files[i];
        if (file?.type === 'images/heic') {
          // eslint-disable-next-line no-await-in-loop
          file = await this.HEICConvertTo(file);
          files[i] = file;
        }
        if (files[i].mediaId) medias.push(files[i].mediaId);
        else fetchData.push(this.$store.dispatch('user/getUploadFileLink', { contentType: file?.type }));
      }
      if (!fetchData.length) return medias;
      const urls = await Promise.all(fetchData);
      for (let i = 0; i < files.length; i += 1) {
        const { file } = files[i];
        const { mediaId, url } = urls[i];
        medias.push(mediaId);
        if (file) {
          fetchUrlsData.push(this.$store.dispatch('user/uploadFile', {
            url,
            data: file,
            contentType: file.type,
          }));
        }
      }
      await Promise.all(fetchUrlsData);
      return medias;
    },
    ShowModal(payload) {
      this.$store.dispatch('modals/show', {
        key: modals.default,
        ...payload,
      });
    },
    /**
     * Set loader params
     * @param payload - boolean || { isLoading, statusText, loaderMode, loaderProgress, isHiderBackground }
     * @constructor
     */
    SetLoader(payload) {
      this.$store.dispatch('main/setLoading', payload);
    },
    CloseModal() {
      this.$store.dispatch('modals/hide');
    },
    ClipboardSuccessHandler(value) {
      this.$store.dispatch('main/showToast', {
        title: 'Copied successfully',
        text: value,
      });
    },
    ClipboardErrorHandler(value) {
      this.$store.dispatch('main/showToast', {
        title: 'Copy error',
        text: value,
      });
    },
    getDistanceFromLatLonInKm(lat1 = 0, lon1 = 0, lat2 = 0, lon2 = 0) {
      const R = 6371; // Radius of the earth in km
      const dLat = this.deg2rad(lat2 - lat1); // deg2rad below
      const dLon = this.deg2rad(lon2 - lon1);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
        + Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2))
        * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      let d = (R * c) * 1000; // Distance in km
      if (d >= 1000) {
        d = '+1000';
      } else if (d >= 500) {
        d = '+500';
      } else {
        d = '< 500';
      }
      return d;
    },
    deg2rad(deg) {
      return deg * (Math.PI / 180);
    },
    ShowToast(text, title = null) {
      this.$bvToast.toast(text, {
        title: title || this.$t('modals.errors.error'),
        variant: 'warning',
        solid: true,
        toaster: 'b-toaster-bottom-right',
        appendToast: true,
        toastClass: 'custom-toast-width',
        bodyClass: 'custom-toast-width',
      });
    },
    Floor: (value, precision = 4) => {
      const form = 10 ** precision;
      return Math.floor(value * form) / form || 0;
    },
    Ceil: (value, precision = 4) => {
      const form = 10 ** precision;
      return Math.ceil(value * form) / form || 0;
    },
    GetFormTimestamp(timestamp, format = 'DD.MM.YY H:mm') {
      if (timestamp !== 0 && timestamp !== '-' && timestamp !== '' && timestamp !== undefined) {
        // timestamp = +timestamp * 1000;
        timestamp = +timestamp;
        return moment(new Date(timestamp)).format(format);
      }
      return '-';
    },
    GetLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(this.FormatPosition);
      }
    },
    CropTxt(str, maxLength) {
      if (str.length > maxLength) str = `${str.slice(0, maxLength)}...`;
      return str;
    },
    CutTxn(txn, first = 10, second = 10) {
      if (txn?.length > first + second) return `${txn.slice(0, first)}...${txn.slice(-second)}`;
      return txn;
    },
    FormatPosition(position) {
      const payload = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
      this.$store.dispatch('user/setCurrentPosition', payload);
    },
    UserName(firstName, lastName) {
      if (firstName || lastName) return `${firstName || ''} ${lastName || ''}`;
      return this.$t('profile.defaultName');
    },
    NumberWithSpaces(value) {
      if (!value) return '';
      const parts = value.toString().split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      return parts.join('.');
    },
    SetDelay(func, timeout, delayId) {
      clearTimeout(delayId);
      return setTimeout(func, timeout);
    },
    CalcPercent(preValue, value) {
      const valueWithoutWords = preValue.replace(/[^0-9,.]/g, '');
      const isEmpty = valueWithoutWords.length === 0;
      const isDotFirst = valueWithoutWords[0] === '.' || valueWithoutWords[0] === ',';
      if (isEmpty) {
        value = '';
      } else if (isDotFirst) {
        const memo = valueWithoutWords.split('');
        memo.unshift('0');
        if (memo[memo.length - 1] !== '%') {
          memo.push('%');
        }
        value = memo.join('');
      } else {
        value = `${valueWithoutWords}%`;
      }
      value = value.replace(/,/g, '.');
      if (value.includes('.')) {
        const withoutDotsArray = value.split('.');
        if (withoutDotsArray.length > 2) {
          withoutDotsArray.splice(1, 0, '.');
          value = withoutDotsArray.join('');
        }
      }
      return value;
    },
    ChangeCaretPosition(ref) {
      const input = ref?.$refs.input;
      this.$nextTick(() => {
        const { length } = input.value;
        if (input.value[length - 1] === '%' && input.selectionStart === length) {
          input.selectionStart = length - 1;
          input.selectionEnd = length - 1;
        }
      });
    },
    DeclOfNum(n) {
      n = Math.abs(n) % 100;
      const n1 = n % 10;
      if (n > 10 && n < 20) {
        return 2;
      }
      if (n1 > 1 && n1 < 5) {
        return 1;
      }
      if (n1 === 1 && this.$i18n.locale === 'ru') {
        return 0;
      }
      return 2;
    },
    ScrollToTop: () => window.scrollTo(0, 0),
    IsProd: () => IS_PROD,
    ShowModalSuccess({
      title, subtitle, img, path, link,
    }) {
      this.ShowModal({
        key: modals.status,
        img: img || images.SUCCESS,
        title: title || this.$t('meta.success'),
        subtitle,
        link,
        path,
      });
    },
    ShowModalFail({
      title, subtitle, img, path,
    }) {
      this.ShowModal({
        key: modals.status,
        img: img || images.WARNING,
        title: title || this.$t('meta.fail'),
        subtitle,
        path,
      });
    },
    checkIfMobile() {
      const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
        /Opera Mini/i,
      ];

      return toMatch.some((toMatchItem) => navigator.userAgent.match(toMatchItem));
    },
    async ShowTxReceipt({
      from, to, amount, currency, fee, title,
    }) {
      return new Promise(async (resolve, reject) => {
        this.ShowModal({
          key: modals.transactionReceipt,
          title: title || this.$t('modals.takeWUSD'),
          fields: {
            from: { name: this.$t('meta.fromBig'), value: from },
            to: { name: this.$t('meta.toBig'), value: to },
            amount: {
              name: this.$t('modals.amount'),
              value: amount,
              symbol: currency,
            },
            fee: {
              name: this.$t('wallet.table.trxFee'),
              value: new BigNumber(fee.gasPrice).multipliedBy(fee.gas).shiftedBy(-18).toFixed(),
              symbol: TokenSymbols.WQT,
            },
          },
          isDontOffLoader: true,
          submitMethod: async () => await resolve(),
          cancelMethod: async () => await reject(new Error('Cancel')),
        });
      });
    },
  },
});
