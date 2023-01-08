<template>
  <ctm-modal-box
    class="report"
    :title="`${$t('report.complainAbout')} ${options.title}`"
  >
    <validation-observer
      v-slot="{handleSubmit, invalid}"
      class="report__content content"
      tag="div"
    >
      <div class="content__field">
        <div class="content__field_label">
          {{ $t('report.title') }}
        </div>
        <base-field
          v-model="title"
          :placeholder="$t('report.titlePlaceholder')"
          :name="$t('report.title').toLowerCase()"
          rules="required|max:255"
          data-selector="SUBJECT"
        />
      </div>
      <div class="content__field">
        <div class="content__field_label">
          {{ $t('report.message') }}
        </div>
        <base-textarea
          v-model="description"
          :placeholder="$t('report.messagePlaceholder')"
          rules="required|min_message:50|max:1000"
        />
      </div>
      <base-btn
        :disabled="invalid || isDisabledReportBtn"
        @click="handleSubmit(submit)"
      >
        {{ $t('report.btn.send') }}
      </base-btn>
    </validation-observer>
  </ctm-modal-box>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ModalReport',
  data() {
    return {
      title: '',
      description: '',
      isDisabledReportBtn: false,
    };
  },
  computed: {
    ...mapGetters({
      options: 'modals/getOptions',
    }),
  },
  methods: {
    ...mapActions({
      sendReport: 'user/sendReport',
    }),
    async submit() {
      this.isDisabledReportBtn = true;
      const resultOk = await this.sendReport({
        entityType: this.options.entityType,
        entityId: this.options.entityId,
        title: this.title,
        description: this.description,
        mediaIds: [],
      });
      if (resultOk) {
        await this.$store.dispatch('main/showToast', {
          title: this.$t('report.sent'),
          variant: 'success',
          text: this.$t('report.sent'),
        });
        this.CloseModal();
      } else {
        this.isDisabledReportBtn = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.report {
  &__content {
    padding: 20px 28px 30px 28px !important;
  }
}
.content {
  display: grid;
  grid-gap: 20px;
  &__change-network {
    color: $red;
  }
  &__field {
    display: grid;
    grid-gap: 10px;
    &_label {
      color: $black500;
    }
  }
  &__wqt {
    min-height: 24px;
  }
  &__balance {
    color: $black500;
  }
}
.max {
  &__text {
    padding: 0 10px;
  }
}
</style>
