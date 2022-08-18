<template>
  <div class="error">
    <h1 class="error__title">
      {{ $t('errorLayout.title') }}
    </h1>
    <div class="error__desc">
      {{ $t('errorLayout.desc') }}
    </div>
    <base-btn
      class="error__btn"
      :nuxt-link="$options.Path.MY_QUESTS"
    >
      {{ $t('errorLayout.btn') }}
    </base-btn>
  </div>
</template>

<script>
import { Path } from '~/utils/enums';

export default {
  name: 'ErrorLayout',
  Path,
};
</script>

<style scoped lang="scss">
.error {
  display: flex;
  flex-direction: column;
  margin: 60px auto 100px auto;
  max-width: 400px;

  &__title {
    font-size: 32px;
    font-weight: 700;
  }

  &__desc {
    margin-top: 10px;
  }

  &__btn {
    margin-top: 20px;
  }
}
</style>
