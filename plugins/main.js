import Vue from 'vue';
import moment from 'moment';
import VueTippy, { TippyComponent } from 'vue-tippy';
import converter from 'bech32-converting';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { TokenSymbols } from '~/utils/enums';
import { QuestMethods, QuestStatuses } from '~/utils/сonstants/quests';
import { images } from '~/utils/images';
import { ERC20, WorkQuest } from '~/abi';
import ENV, { IS_PROD } from '~/utils/adresses/index';

Vue.use(VueTippy);
Vue.component('tippy', TippyComponent);

Vue.mixin({
  data() {
    return {
      ENV,
    };
  },
  methods: {
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
      // eslint-disable-next-line no-restricted-syntax
      for (const item of files) {
        if (item.mediaId) medias.push(item.mediaId);
        else fetchData.push(this.$store.dispatch('user/getUploadFileLink', { contentType: item.file?.type }));
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
    SetLoader(value) {
      this.$store.dispatch('main/setLoading', value);
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
    async DeleteQuest(questData) {
      const { status, contractAddress } = questData;
      if (contractAddress && [QuestStatuses.Closed, QuestStatuses.Created].includes(status)) {
        this.SetLoader(true);
        const [feeRes] = await Promise.all([
          this.$store.dispatch('quests/getFeeDataJobMethod', {
            abi: WorkQuest,
            method: QuestMethods.CancelJob,
            contractAddress,
          }),
          this.$store.dispatch('wallet/getBalance'),
        ]);
        this.SetLoader(false);
        if (!feeRes.ok) {
          this.ShowToast(feeRes.msg);
          return;
        }
        this.ShowModal({
          key: modals.transactionReceipt,
          title: this.$t('quests.deleteQuest'),
          fields: {
            from: { name: this.$t('meta.fromBig'), value: this.$store.getters['user/getUserWalletAddress'] },
            to: { name: this.$t('meta.toBig'), value: contractAddress },
            fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee.toString(), symbol: TokenSymbols.WUSD },
          },
          submitMethod: async () => {
            this.SetLoader(true);
            const trxRes = await this.$store.dispatch('quests/cancelJob', contractAddress);
            this.SetLoader(false);
            if (!trxRes.ok) {
              this.ShowToast(trxRes.msg);
              return;
            }
            const routeName = this.$route.name;
            if (routeName === 'quests-id') {
              await this.$router.replace('/my');
            } else if (routeName === 'my' || routeName === 'profile-id') {
              const payload = JSON.parse(sessionStorage.getItem('questsListFilter'));
              await this.$store.dispatch('quests/getUserQuests', payload);
            }
            this.ShowToast(this.$t('toasts.questDeleted'), this.$t('toasts.questDeleted'));
          },
        });
      } else {
        await this.$store.dispatch('main/showToast', {
          title: this.$t('meta.questInfo'),
          variant: 'warning',
          text: this.$t('toasts.questCantDelete'),
        });
      }
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
      title, subtitle, img, path,
    }) {
      this.ShowModal({
        key: modals.status,
        img: img || images.SUCCESS,
        title: title || this.$t('meta.success'),
        subtitle,
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
    /**
     * Check allowance and making approve
     * @param tokenAddress - token
     * @param contractAddress - recipient
     * @param amount - token amount
     * @param approveTitle - title for modal
     * @returns {Promise<unknown>}
     * @constructor
     */
    async MakeApprove({
      tokenAddress, contractAddress, amount, approveTitle = this.$t('meta.approve'),
    }) {
      return new Promise(async (resolve, reject) => {
        const allowance = await this.$store.dispatch('wallet/getAllowance', {
          tokenAddress,
          spenderAddress: contractAddress,
        });
        if (new BigNumber(allowance).isLessThan(amount)) {
          const [approveFee] = await Promise.all([
            this.$store.dispatch('wallet/getContractFeeData', {
              method: 'approve',
              abi: ERC20,
              contractAddress: tokenAddress,
              data: [contractAddress, new BigNumber(amount).shiftedBy(18).toFixed(0).toString()],
            }),
            this.$store.dispatch('wallet/getBalance'),
          ]);

          this.SetLoader(false);
          if (!approveFee.ok) {
            this.ShowToast('Approve error');
            reject();
            return;
          }

          this.ShowModal({
            key: modals.transactionReceipt,
            title: approveTitle,
            fields: {
              from: { name: this.$t('meta.fromBig'), value: this.userWalletAddress },
              to: { name: this.$t('meta.toBig'), value: contractAddress },
              amount: { name: this.$t('modals.amount'), value: amount, symbol: TokenSymbols.WUSD },
              fee: { name: this.$t('wallet.table.trxFee'), value: approveFee.result.fee, symbol: TokenSymbols.WQT },
            },
            submitMethod: async () => {
              this.ShowToast('Approving...', 'Approve');
              const approveOk = await this.$store.dispatch('wallet/approve', {
                tokenAddress,
                spenderAddress: contractAddress,
                amount,
              });
              if (!approveOk) {
                this.ShowToast('Approve error');
                reject();
                return;
              }
              this.ShowToast('Approving done', 'Approve');
              await resolve(amount);
            },
            cancel: async () => await reject(new Error('Cancel')),
          });
        } else {
          await resolve(amount);
        }
      });
    },
    async ShowTxReceipt({
      from, to, amount, currency, fee, title,
    }) {
      return new Promise(async (resolve, reject) => {
        this.ShowModal({
          key: modals.transactionReceipt,
          title: title || this.$t('modals.takeWUSD'),
          fields: {
            from: { name: this.$t('modals.fromAddress'), value: from },
            to: { name: this.$t('modals.toAddress'), value: to },
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
          submitMethod: async () => await resolve(),
          cancel: async () => await reject(new Error('Cancel')),
        });
      });
    },
  },
});
