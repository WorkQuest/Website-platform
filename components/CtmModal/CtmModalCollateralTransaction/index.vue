<template>
  <ctm-modal-box
    class="collateral"
    :title="$t('modals.collateral.add')"
  >
    <div class="collateral__content content">
      <div>
        Информация об eth или другом кошельке. Сколько это в %
      </div>
      <base-field placeholder="10 ETH" />
      <base-field placeholder="10 WUSD" />
    </div>
  </ctm-modal-box>
</template>

<script>
export default {
  name: 'CollateralTransaction',
};
</script>

<style lang="scss" scoped>

</style>
