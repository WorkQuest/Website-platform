<template>
  <!--  TODO: исправить редактирование квеста-->
  <div
    v-if="questData"
    class="main"
    data-selector="PAGE-MY-QUESTS"
    :class="{'main-white': step === $options.EditQuestState.EDITING}"
  >
    <div class="main__body page">
      <validation-observer
        v-slot="{handleSubmit, validated, passed, invalid}"
        tag="div"
      >
        <div
          v-if="step === 1"
          data-selector="PAGE-MY-QUESTS-STEP-1"
          class="page"
        >
          <h2 class="page__title">
            {{ $t('quests.editAQuest') }}
          </h2>
          <div class="page__category">
            <div class="page runtime">
              <div class="runtime__container">
                <div class="runtime page__dd">
                  <base-dd
                    v-model="runtimeValue"
                    :items="runtime"
                    type="gray"
                    :label="$t('quests.runtime')"
                    :placeholder="runtime[0]"
                    data-selector="RUNTIME"
                    :name="$t('quests.runtime')"
                    rules="required"
                  />
                </div>
              </div>
            </div>
            <div class="page__input">
              <base-field
                v-model="price"
                type="number"
                :label="$t('meta.price')"
                data-selector="PRICE-FIELD"
                placeholder="0 WUSD"
                rules="required|decimal|decimalPlaces:16|min_value:1"
                :name="$t('meta.price')"
              />
            </div>
            <div class="page__dd">
              <base-dd
                v-model="priorityIndex"
                :label="$t('quests.employment.employment')"
                type="gray"
                :items="employment"
                rules="required"
                :name="$t('quests.employment.employment')"
                data-selector="EMPLOYMENT"
              />
            </div>
            <div class="page__dd">
              <base-dd
                v-model="categoryIndex"
                :label="$t('quests.distantWork.distantWork')"
                type="gray"
                :items="distantWork"
                rules="required"
                :name="$t('quests.distantWork.distantWork')"
                data-selector="DISTANT"
              />
            </div>
          </div>
          <specializations-selector
            :skills="questData.questSpecializations"
            @changeSkills="updateSelectedSkills"
          />
          <div class="page__address">
            <base-field
              v-model="address"
              :label="$t('quests.address')"
              data-selector="ADDRESS-FIELD"
              :placeholder="$t('quests.address')"
              mode="icon"
              :selector="true"
              rules="required"
              :name="$t('quests.address')"
              @selector="getAddressInfo(address)"
            >
              <template v-slot:left>
                <span class="icon-map" />
              </template>
              <template v-slot:selector>
                <div
                  v-if="addresses.length"
                  data-selector="ADDRESS-SELECTOR"
                  class="selector"
                >
                  <div class="selector__items">
                    <div
                      v-for="(item, i) in addresses"
                      :key="i"
                      :data-selector="`ACTION-BTN-ADDRESS-${i}`"
                      class="selector__item"
                      @click="selectAddress(item)"
                    >
                      {{ item.formatted }}
                    </div>
                  </div>
                </div>
              </template>
            </base-field>
          </div>
          <div class="page__input">
            <base-field
              v-model="questTitle"
              data-selector="QUEST-TITLE-FIELD"
              rules="required"
              :name="$t('quests.questTitle')"
              :placeholder="$t('quests.questTitle')"
            />
          </div>
          <div class="page__input">
            <textarea
              id="textarea"
              v-model="textarea"
              disabled
              data-selector="QUEST-DESC-TEXTAREA"
              class="page__textarea"
              :placeholder="$t('quests.questDesc')"
            />
          </div>
          <div class="page upload__container">
            <div class="upload__title">
              {{ $t('quests.uploadMaterials') }}
            </div>
            <files-uploader
              :multiple="true"
              :limit="10"
              :limit-bytes="10485760"
              :limit-bytes-video="10485760"
              :accept="'image/png, image/jpg, image/jpeg, video/mp4'"
              :preloaded-files="questData.medias"
              @change="updateFiles"
            />
          </div>
          <div class="upload btn btn__container btn__container_right">
            <div class="btn__create">
              <base-btn
                data-selector="TO-RAISED-VIEWS"
                :disabled="!(invalid === false && !(selectedSpecAndSkills.length === 0))"
                @click="handleSubmit(setCurrentStepEditQuest($options.EditQuestState.RAISE_VIEWS))"
              >
                {{ $t('quests.editAQuest') }}
              </base-btn>
            </div>
          </div>
        </div>
        <div
          v-if="step === $options.EditQuestState.RAISE_VIEWS"
          data-selector="PAGE-MY-QUESTS-STEP-2"
          class="page"
        >
          <div class="page btn-container btn-container__left">
            <div class="btn-container__btn_back">
              <base-btn
                data-selector="PREVIOUS-STEP"
                mode="back"
                @click="clickBackBtnHandler"
              >
                {{ $t('meta.btns.back') }}
                <template v-slot:left>
                  <span class="icon-chevron_big_left btn-container__icon" />
                </template>
              </base-btn>
            </div>
          </div>
          <div class="page page__raising">
            {{ $t('raising-views.raisingViews') }}
          </div>
          <div class="page period">
            <h3 class="period__choose">
              {{ $t('raising-views.choosePeriod') }}
            </h3>
            <div class="period__container">
              <div
                v-for="(item, i) in periodTabs"
                :key="i"
                class="period__period"
                :class="{'period__period_active': period === item.number}"
                @click="switchPeriod(item, i)"
              >
                <h2
                  class="period__title"
                  :class="{'period__title_active': period === item.number}"
                >
                  {{ item.title }}
                </h2>
              </div>
            </div>

            <div class="period level">
              <div class="level__title">
                {{ $t('raising-views.chooseLevel') }}
              </div>
              <div
                v-if="period"
                class="level__container"
              >
                <div
                  v-for="(item, i) in periods(period)"
                  :key="i"
                  class="level__card"
                  @click="selectRadio(i)"
                >
                  <div class="level__option">
                    <input
                      :ref="`radio${i}`"
                      name="higherLevel"
                      type="radio"
                      class="radio__input"
                      :value="item.cost"
                      @input="selectRadio(i)"
                    >
                  </div>
                  <div class="level card">
                    <div
                      class="card__level"
                      :class="cardStatus(item)"
                    >
                      {{ item.level }}
                    </div>
                    <div class="card__desc">
                      {{ item.desc }}
                    </div>
                  </div>
                  <div class="cost__container">
                    <div class="card__cost">
                      {{ item.cost }}$
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-container">
              <div class="btn-container__btn">
                <base-btn
                  data-selector="EDIT-QUEST"
                  mode="outline"
                  @click="toEditQuest"
                >
                  {{ $t('meta.skipAndEnd') }}
                </base-btn>
              </div>
              <div class="btn-container__btn">
                <base-btn
                  data-selector="SHOW-PAYMENT-MODAl"
                  :disabled="ads.currentAdPrice === ''"
                  @click="showPaymentModal"
                >
                  {{ $t('meta.pay') }}
                </base-btn>
              </div>
            </div>
          </div>
        </div>
      </validation-observer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import BigNumber from 'bignumber.js';
import modals from '~/store/modals/modals';
import { Path, tokenMap, TokenSymbols } from '~/utils/enums';
import {
  QuestMethods, EditQuestState, InfoModeEmployer, QuestStatuses, CommissionForCreatingAQuest,
} from '~/utils/сonstants/quests';
import { hashText } from '~/utils/wallet';
import { ERC20 } from '~/abi';

const { GeoCode } = require('geo-coder');

export default {
  name: 'EditQuest',
  EditQuestState,
  data() {
    return {
      ads: {
        currentAdPrice: '',
      },
      period: 1,
      selectedSpecAndSkills: [],
      priorityIndex: 1,
      employmentIndex: 0,
      categoryIndex: 0,
      runtimeValue: '',
      questTitle: '',
      address: '',
      textarea: '',
      price: '',
      coordinates: {},
      addresses: [],
      files: [],
      mode: this.$route.query?.mode || '',
      geoCode: null,
      prevPrice: null,
    };
  },
  computed: {
    ...mapGetters({
      isWalletConnected: 'wallet/getIsWalletConnected',
      userWalletAddress: 'user/getUserWalletAddress',
      balanceData: 'wallet/getBalanceData',
      questData: 'quests/getQuest',
      step: 'quests/getCurrentStepEditQuest',
    }),
    days() {
      const days = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i < 5; i++) {
        const title = `quests.levels.${i}.`;
        days.push({
          level: this.$t(`${title}title`),
          code: i,
          desc: this.$t(`${title}desc`),
          cost: '10',
        });
      }
      return days;
    },
    weeks() {
      const weeks = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i < 5; i++) {
        const title = `quests.levels.${i}.`;
        weeks.push({
          level: this.$t(`${title}title`),
          code: i,
          desc: this.$t(`${title}desc`),
          cost: i === 2 ? '10' : '40',
        });
      }
      return weeks;
    },
    months() {
      const months = [];
      // eslint-disable-next-line no-plusplus
      for (let i = 1; i < 5; i++) {
        const title = `quests.levels.${i}.`;
        months.push({
          level: this.$t(`${title}title`),
          code: i,
          desc: this.$t(`${title}desc`),
          cost: i === 2 ? '10' : '70',
        });
      }
      return months;
    },
    periodTabs() {
      return [
        { number: 1, title: this.$t('raising-views.forOneDay') },
        { number: 2, title: this.$t('raising-views.forOneWeek') },
        { number: 3, title: this.$t('raising-views.forOneMonth') },
      ];
    },
    runtime() {
      return [
        this.$t('meta.priority.urgent'),
        this.$t('meta.priority.shortTerm'),
        this.$t('meta.priority.fixedDelivery'),
      ];
    },
    employment() {
      return [
        this.$t('quests.employment.fullTime'),
        this.$t('quests.employment.partTime'),
        this.$t('quests.employment.fixedTerm'),
      ];
    },
    distantWork() {
      return [
        this.$t('quests.distantWork.distantWork'),
        this.$t('quests.distantWork.workInOffice'),
        this.$t('quests.distantWork.bothVariant'),
      ];
    },
  },
  beforeCreate() {
    this.$store.dispatch('wallet/checkWalletConnected', { nuxt: this.$nuxt });
  },
  async mounted() {
    if (!this.isWalletConnected) return;
    this.SetLoader(true);
    await this.$store.dispatch('quests/getQuest', this.$route.params.id);
    this.geoCode = new GeoCode('google', {
      key: process.env.GMAPKEY,
      lang: this.$i18n?.localeProperties?.code || 'en-US',
    });
    const {
      title, locationPlaceName, price, description, location, employment, id, status,
    } = this.questData;

    if ([QuestStatuses.Pending, InfoModeEmployer.Dispute, InfoModeEmployer.Done, InfoModeEmployer.Closed].includes(status)) {
      await this.$router.push(`${Path.QUESTS}/${id}`);
    }

    this.runtimeValue = 1;
    this.employmentIndex = this.parseEmployment(employment);
    this.questTitle = title;
    this.address = locationPlaceName;
    this.price = new BigNumber(price).shiftedBy(-18).toString();
    this.textarea = description;
    this.coordinates.lng = location.longitude;
    this.coordinates.lat = location.latitude;

    this.prevPrice = this.price;
    this.SetLoader(false);
  },
  methods: {
    updateFiles(files) {
      this.files = files;
    },
    updateSelectedSkills(specAndSkills) {
      this.selectedSpecAndSkills = specAndSkills;
    },
    cardStatus({ code }) {
      if (code === 1) return 'level__card_gold';
      if (code === 3) return 'card__level_reliable';
      if (code === 4) return 'card__level_checked';
      return '';
    },
    periods(period) {
      if (period === 1) return this.days;
      if (period === 2) return this.weeks;
      if (period === 3) return this.months;
      return '';
    },
    selectRadio(idx) {
      const radio = this.$refs[`radio${idx}`];
      for (let i = 0; i < Object.keys(this.$refs[`radio${i}`]).length; i += 1) {
        if (radio[i].checked) {
          radio[i].checked = false;
          this.ads.currentAdPrice = '';
        } else if (!radio[i].checked) {
          radio[i].checked = true;
          this.ads.currentAdPrice = radio[i].value;
        }
      }
    },
    switchPeriod(item) {
      for (let idx = 0; idx < Object.keys(this.$refs).length - 1; idx += 1) {
        const radio = this.$refs[`radio${idx}`];
        for (let i = 0; i < Object.keys(radio).length; i += 1) {
          radio[0].checked = false;
        }
        this.period = item.number;
        this.ads.currentAdPrice = '';
      }
    },
    setCurrentStepEditQuest(step) {
      this.$store.commit('quests/setCurrentStepEditQuest', step);
    },
    showPaymentModal() {
      this.ShowModal({
        key: modals.paymentOptions,
        step: 1,
      });
    },
    clickBackBtnHandler() {
      if (this.mode === 'raise') {
        this.goBack();
      } else {
        this.setCurrentStepEditQuest(EditQuestState.EDITING);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    selectAddress(address) {
      this.addresses = [];
      this.address = address.formatted;
    },
    convertEmployment(employmentId) {
      const employments = [
        'fullTime',
        'partTime',
        'fixedTerm',
      ];
      return employments[employmentId];
    },
    parseEmployment(employment) {
      const employments = {
        fullTime: 0,
        partTime: 1,
        fixedTerm: 2,
      };
      return employments[employment];
    },
    async getAddressInfo(address) {
      try {
        if (address.length) {
          this.addresses = await this.geoCode.geolookup(address);
          this.coordinates = {
            lng: this.addresses[0].lng,
            lat: this.addresses[0].lat,
          };
        } else this.addresses = [];
      } catch (e) {
        this.addresses = [];
        console.error('Geo look up is failed', e);
      }
    },
    async toEditQuest() {
      // Edit only quest info w/o sending tx
      if (this.prevPrice === this.price) {
        await this.editQuest();
        return;
      }

      let feeRes;
      let depositAmount;
      const { contractAddress } = this.questData;
      const wusdAddress = tokenMap[TokenSymbols.WUSD];

      // Quest Cost Increased
      if (new BigNumber(this.price).isGreaterThan(this.prevPrice)) {
        const deposit = new BigNumber(this.price).minus(this.prevPrice).toString();
        depositAmount = new BigNumber(deposit).multipliedBy(1 + CommissionForCreatingAQuest).toString();

        this.SetLoader(true);
        await this.$store.dispatch('wallet/fetchWalletData', {
          method: 'balanceOf',
          address: this.userWalletAddress,
          abi: ERC20,
          token: wusdAddress,
          symbol: TokenSymbols.WUSD,
        });
        if (new BigNumber(this.balanceData.WUSD.fullBalance).isLessThan(depositAmount)) {
          this.ShowToast(`${this.$t('errors.transaction.notEnoughFunds')} (${TokenSymbols.WUSD})`);
          this.SetLoader(false);
          return;
        }

        const allowance = await this.$store.dispatch('wallet/getAllowance', {
          tokenAddress: wusdAddress,
          spenderAddress: contractAddress,
        });
        if (new BigNumber(allowance).isLessThan(depositAmount)) {
          const [approveFee] = await Promise.all([
            this.$store.dispatch('wallet/getContractFeeData', {
              method: 'approve',
              abi: ERC20,
              contractAddress: wusdAddress,
              data: [contractAddress, new BigNumber(depositAmount).shiftedBy(18).toString()],
            }),
            this.$store.dispatch('wallet/getBalance'),
          ]);
          this.SetLoader(false);
          if (!approveFee.ok) {
            this.ShowToast(approveFee.msg);
            return;
          }
          this.ShowModal({
            key: modals.transactionReceipt,
            title: 'Approve',
            fields: {
              from: { name: this.$t('meta.fromBig'), value: this.userWalletAddress },
              to: { name: this.$t('meta.toBig'), value: contractAddress },
              amount: { name: this.$t('modals.amount'), value: depositAmount, symbol: TokenSymbols.WUSD },
              fee: { name: this.$t('wallet.table.trxFee'), value: approveFee.result.fee, symbol: TokenSymbols.WQT },
            },
            submitMethod: async () => {
              this.ShowToast('Approving...', 'Approve');
              const approveOk = await this.$store.dispatch('wallet/approve', {
                tokenAddress: wusdAddress,
                spenderAddress: contractAddress,
                amount: depositAmount,
              });
              if (!approveOk) {
                this.ShowToast('Approve error');
                this.SetLoader(false);
                return;
              }
              this.ShowToast('Approving done', 'Approve');
              [feeRes] = await Promise.all([
                this.$store.dispatch('quests/getEditQuestFeeData', {
                  contractAddress,
                  cost: deposit,
                }),
                this.$store.dispatch('wallet/getBalance'),
              ]);
              await this.editWithCostChange(contractAddress, feeRes, this.price, deposit);
            },
          });
        } else { // Approve not needed
          [feeRes] = await Promise.all([
            this.$store.dispatch('quests/getEditQuestFeeData', {
              contractAddress,
              cost: deposit,
            }),
            this.$store.dispatch('wallet/getBalance'),
          ]);
          await this.editWithCostChange(contractAddress, feeRes, this.price, deposit);
        }
      } else { // Quest cost decrease
        [feeRes] = await Promise.all([
          this.$store.dispatch('quests/getFeeDataJobMethod', {
            contractAddress,
            method: QuestMethods.EditJob,
            data: [new BigNumber(this.price).shiftedBy(18).toString()],
          }),
          this.$store.dispatch('wallet/getBalance'),
        ]);
        await this.editWithCostChange(contractAddress, feeRes, this.price);
      }
    },
    // to change price on blockchain
    async editQuest() {
      if (this.mode === 'raise') {
        this.goBack();
        return;
      }

      this.SetLoader(true);
      const medias = await this.uploadFiles(this.files);
      const payload = {
        workplace: 'distant',
        priority: this.priorityIndex,
        employment: this.convertEmployment(this.employmentIndex),
        title: this.questTitle,
        medias,
        specializationKeys: this.selectedSpecAndSkills,
        locationFull: {
          location: {
            longitude: this.coordinates.lng,
            latitude: this.coordinates.lat,
          },
          locationPlaceName: this.address,
        },
      };
      const questId = await this.questData.id;
      const response = await this.$store.dispatch('quests/editQuest', { payload, questId });
      this.SetLoader(false);
      if (response.ok) {
        this.showModalEditQuest();
        this.showToastEdited();
        await this.$router.push(`/quests/${questId}`);
        this.setCurrentStepEditQuest(EditQuestState.EDITING);
      }
    },
    /**
     * Send new data to backend
     * @param contractAddress
     * @param feeRes
     * @param cost - new quest reward
     * @param depositAmount - if increasing cost
     */
    async editWithCostChange(contractAddress, feeRes, cost, depositAmount) {
      if (!feeRes.ok) {
        this.ShowToast(this.$t('errors.transaction.notEnoughFunds'));
        return;
      }
      const fields = {
        from: { name: this.$t('meta.fromBig'), value: this.userWalletAddress },
        to: { name: this.$t('meta.toBig'), value: contractAddress },
        fee: { name: this.$t('wallet.table.trxFee'), value: feeRes.result.fee, symbol: TokenSymbols.WQT },
      };
      if (depositAmount) {
        fields.amount = { name: this.$t('modals.amount'), value: depositAmount, symbol: TokenSymbols.WUSD };
      }
      await this.$store.dispatch('wallet/getBalance');
      this.ShowModal({
        key: modals.transactionReceipt,
        fields,
        submitMethod: async () => {
          const res = await this.$store.dispatch('quests/editQuestOnContract', {
            contractAddress,
            cost,
          });
          if (res.ok) await this.editQuest();
        },
      });
    },
    showModalEditQuest() {
      this.ShowModal({
        key: modals.status,
        img: require('assets/img/ui/questCreated.svg'),
        title: this.$t('modals.questUpdated'),
      });
    },
    showToastEdited() {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.questEdited'),
        variant: 'success',
        text: this.$t('toasts.questEdited'),
      });
    },
    showToastError(e) {
      return this.$store.dispatch('main/showToast', {
        title: this.$t('toasts.error'),
        variant: 'warning',
        text: e.response?.data?.msg,
      });
    },
  },
};
</script>

<style lang="scss" scoped>

.btn-container {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin: 20px 0 0 0;
  &__icon {
    color: $black700;
  }
  &__left {
    justify-content: flex-start;
    margin: 30px 0 0 0;
  }
  &__btn {
    width: 200px;
    margin: 0 10px 0 0;
    &_back {
      display: flex;
      justify-content: left;
      align-items: center;

      & .icon-chevron_big_left {
        font-weight: 800;
        font-size: 24px;
      }
    }
    &:last-child {
      margin: 0;
    }
  }
}

.cost__container {
  display: flex;
  align-self: center;
}

.card {
  border: none;
  &__level {
    @include text-simple;
    font-weight: 500;
    font-size: 12px;
    color: $white;
    background: #F7CF00;
    border-radius: 3px;
    width: 120px;
    padding: 2px 5px;
    text-align: center;
    &_reliable {
      background: $grey200;
    }
    &_checked {
      background: $brown;
    }
  }
  &__desc {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black500;
    margin-top: 12px;
  }
  &__cost {
    @include text-simple;
    color: $black800;
    font-weight: 500;
    font-size: 20px;
    display: flex;
    justify-content: center;
  }
}

.level {
  &__title {
    @extend .period__title;
  }
  &__card {
    background: $white;
    border-radius: 6px;
    padding: 20px 0;
    display: grid;
    grid-template-columns: 1fr 15fr 1fr;
    margin: 20px 0 0 0;
    transition: 0.5s;
    &:hover {
      cursor: pointer;
      box-shadow: 0 0 10px 2px rgba(34, 60, 80, 0.09);
    }
    &_gold {
      border: 1px solid #F7CF00;
    }
  }
  &__option {
    display: flex;
    justify-content: center;
    align-items: center;
  }
}

.radio {
  &__input {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    border-radius: 50%;
    width: 25px;
    height: 25px;
    border: 1px solid $blue;
    cursor: pointer;
    &:checked {
      background: radial-gradient($blue 50%, rgba(255, 0, 0, 0) 55%);
    }
  }
}

.period {
  &__choose {
    @extend .period__title;
    margin: 20px 0 0 0;
  }
  &__title {
    @include text-simple;
    font-weight: 400;
    font-size: 16px;
    color: $black800;
    &_active {
      color: $white;
    }
  }
  &__container {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    max-width: 1180px;
    width: 100%;
    margin: 10px 0 20px 0;
  }
  &__period {
    color: $black800;
    background: $white;
    padding: 12px 88px;
    border-radius: 6px;
    transition: .5s;
    text-align: center;
    width: inherit;
    margin: 0 20px 0 0;
    &:last-child {
      margin: 0;
    }
    &:hover {
      cursor: pointer;
      box-shadow: 0 0 10px 2px rgba(34, 60, 80, 0.09);
    }
    &_active {
      background: $blue;
      color: $white;
      &:hover {
        cursor: pointer;
        box-shadow: 0 0 10px 2px rgba(34, 60, 80, 0.09);
      }
    }
    &:last-child {
      margin: 0;
    }
    &__title {
      color: $black800;
      font-weight: 500;
      font-size: 16px;
    }
  }
}

.main {
  @include main;
  &-white {
    @include main;
    background: $white;
    background: #FFFFFF;
    margin: 0 0 20px 0;
    border-radius: 6px;
    justify-content: center;
  }
  &__body {
    max-width: 1180px;
    width: 100%;
    height: 100%;
  }
}

.runtime {
  &__container {
    display: grid;
    grid-gap: 10px;
    align-items: flex-start;
  }
  &__dd {
    display: flex;
    align-items: flex-start;
  }
}

.icon {
  &-close_small:before {
    content: "\e949";
    color: $red;
    font-size: 20px;
    cursor: pointer;
  }
  &-check_big:before {
    content: "\ea02";
    color: $white;
    font-size: 20px;
  }
  &-off_outline_close::before {
    content: "\ea2a";
    color: $red;
    font-size: 20px;
  }
  &-map::before {
    content: "\ea28";
    color: $blue;
    font-size: 20px;
  }
}
.selector {
  @include box;
  width: 100%;
  z-index: 140;
  &__items {
    background: #FFFFFF;
    display: grid;
    grid-template-columns: 1fr;
    width: 100%;
  }
  &__item {
    @include text-simple;
    padding: 15px 20px;
    background: #FFFFFF;
    font-weight: 500;
    font-size: 16px;
    color: $black800;
    cursor: pointer;
    transition: .3s;
    &:hover {
      background: $black0;
    }
  }
}

.payment {
  &__container {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
  }
  &__title {
    @include text-simple;
    color: $black500;
    font-weight:400;
    font-size: 16px;
  }
  &__cost {
    @include text-simple;
    color: $blue;
    font-weight: 500;
    font-size: 16px;
    padding: 0 0 0 5px;
  }
}

.base-btn {
  @include text-simple;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 43px;
  color: #ffffff;
  font-size: 16px;
  line-height: 130%;
  text-align: center;
  transition: .3s;
  background: #0083C7;
  border-radius: 6px;
  &:hover {
    background: #103D7C;
  }
  &__passive {
    border: 1px solid rgba(0, 131, 199, 0.1);
    background: #FFFFFF;
    color: $blue;
    &:hover {
      background: $black0;
      color: $blue;
    }
  }
}

.upload {
  &__container {
    margin: 20px 0 0 0;
    width: 100%;
  }
  &__title {
    @include text-simple;
    font-weight: 500;
    color: $black800;
    font-size: 18px;
    padding: 0 0 20px 0;
  }
}

.btn {
  padding: 0;
  &__delete {
    height: 20px;
    width: 20px;
    border-radius: 50%;
  }
  &__create {
    width: 220px;
  }
  &__spec {
    width: 100%;
    padding: 6px 4px 6px 12px;
  }
  &__add {
    width: 100%;
    margin: 12px 0 0 0;
    padding: 6px 5px;
  }
  &__container {
    width: 100%;
    align-items: center;
    display: flex;
    &_left {
      margin: 20px 0 0 0;
      justify-content: flex-start;
      width: 100%;
    }
    &_right {
      justify-content: flex-end;
      width: 100%;
      margin: 20px 0 20px 0;
    }
  }
}

.half {
  width: 100%;
  max-width: 49%;
}

.skills {
  &__category {
    display: grid;
    margin: 20px 0 0 0;
    grid-template-columns: 7fr 1fr;
    grid-gap: 10px;
    align-items: center;
    @extend .half;
  }
  &__badges {
    margin: 16px 0 16px 0;
    display: flex;
  }
  &__badge {
    @include text-simple;
    display: flex;
    flex-direction: row;
    margin-right: 10px;
    background-color: rgba(0, 131, 199, 0.1);
    padding: 6px 10px;
    color: $blue;
    font-weight: 400;
    font-size: 14px;
    border: none;
    border-radius: 44px;
    align-items: center;
  }
  &__alert {
    @include text-simple;
    margin: 5px 0 0 0;
    font-weight: 400;
    font-size: 16px;
    color: $red;
    @extend .half;
  }
}

.spec {
  &__category {
    display: grid;
    grid-template-columns: 7fr 1fr;
    grid-gap: 10px;
    margin: 20px 0 0 0;
    align-items: center;
    @extend .half;
  }
  &__subcategory {
    margin: 20px 0 0 0;
    @extend .half;
  }
}

.page {
  &__skills {
    width: 100%;
    .block {
      display: flex;
      grid-gap: 20px;
      justify-content: space-between;
      margin-top: 20px;
      &__skill-spec {
        width: 100%;
      }
      &__specialization {
        display: flex;
        align-items: flex-start;
        flex-direction: row;
        grid-gap: 20px;
      }
      &__skill {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        grid-gap: 10px;
        .skill {
          &__badge {
            background: rgba(0, 131, 199, 0.1);
            border-radius: 44px;
            color: $blue;
            white-space: nowrap;
            grid-gap: 8px;
            padding: 5px 10px 5px 10px;
            display: flex;
            text-align: center;
            &-skills {
              padding: 15px;
            }
          }
        }
      }
    }
  }
  &__spec {
    flex-direction: row;
    flex-wrap: wrap;
    display: flex;
    max-width: 1180px;
    width: 100%;
    justify-content: flex-start;
    //padding: 0 20px 0 0;
  }
  &__title {
    @include text-simple;
    margin: 30px 0 0 0;
  }
  &__raising {
    @include text-simple;
    font-weight: 500;
    font-size: 20px;
    color: $black800;
    margin: 0 0 20px 0;
  }
  &__page {
    font-weight: 500;
    font-size: 25px;
    color: $black800;
  }
  &__dd {
    min-width: 160px;
  }
  &__category {
    align-items: flex-start;
    margin: 20px 0 0 0;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-gap: 20px;
  }
  &__address {
    margin: 20px 0 0 0;
    display: grid;
    grid-gap: 20px;
  }
  &__textarea {
    @include text-simple;
    border-radius: 6px;
    padding: 11px 20px 11px 15px;
    height: 214px;
    width: 100%;
    border: 0;
    background-color: $black0;
    resize: none;
    &::placeholder {
      color: $black300;
    }
  }
}
.specialization {
  &__dd {
    margin-bottom: 15px;
    width: 100%;
  }
  &__skills {
    width: 100%;
  }
  &__btn {
    text-align: center;
    &_remove {
      margin-top: 37px;
      width: 50%;
      background: #ffffff;
      color: #d73838;
      border: 1px solid #e79a9a;
    }
    &_remove:hover {
      background: #e79a9a;
    }
  }
}
.skills {
  &__add-info {
    display: flex;
    flex-wrap: nowrap;
    grid-gap: 20px;
    margin-top: 20px;
  }
  &__btn {
    &-add {
      text-align: center;
      margin-top: 20px;
      width: 250px;
      background: #FFFFFF;
      color: #0083C7;
      border: 1px solid #bce8ff;
      &_disabled {
        color: #aaaaaa !important;
        border: 0.5px solid #aaaaaa;
      }
    }
    &-add:hover {
      background: #bce8ff;
    }
  }
  &__error {
    color: #f36262;
    margin-bottom: 10px;
  }
}
.main {
  @include main;
  &-white {
    border: 1px solid $black0;
    @include main-white;
  }
}

@include _1199 {
  .main__body {
    padding: 10px;
  }
}

@include _991 {
  .page {
    &__category {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

@include _767 {
  .spec {
    &__category {
      max-width: 100%;
    }
  }
  .skills {
    &__category {
      max-width: 100%;
      grid-template-columns: 1fr;
    }
  }
  .page {
    &__skills {
      .block {
        &__skill-spec {
          width: 100%;
        }
        &__specialization {
          display: flex;
          flex-direction: row;
        }
      }
    }
  }
  .specialization {
    &__btn {
      &_remove {
        margin-top: 0;
        width: 100%;
      }
    }
  }
  .skills {
    &__btn-add {
      width: 100%;
      margin-top: 0;
    }
    &__block {
      display: flex;
      align-items: center;
      flex-direction: column;
      margin-bottom: 50px;
    }
    &__add-info {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
    }
  }
  .btn {
    margin-top: 20px;
    width: 100%;
    &__create {
      width: 100%;
    }
  }
}

@include _575 {
  .page {
    &__skill {
      padding: 40px 0;
    }
    &__skills {
      padding: 50px 0 20px 0;
      .block {
        margin-top: 0;
        grid-gap: 0;
        margin-bottom: 15px;
        &__specialization {
          grid-gap: 0;
          flex-direction: column;
        }
      }
    }
  }
  .page__category {
    grid-template-columns: auto;
  }
}
</style>
