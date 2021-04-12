<template>
  <div class="my">
    <div class="quests">
      My quests
    </div>
    <div class="content">
      <base-btn
        mode="light"
        class="content_btn"
      >
        All quests
      </base-btn>
      <base-btn
        mode="light"
        class="content_btn"
      >
        Favorites
      </base-btn>
      <base-btn
        mode="light"
        class="content_btn"
      >
        Responded quests
      </base-btn>
      <base-btn
        mode="light"
        class="content_btn"
      >
        Performed quests
      </base-btn>
      <base-btn
        mode="light"
        class="content_btn"
      >
        Active quests
      </base-btn>
      <base-btn
        mode="light"
        class="content_btn"
      >
        Invited quests
      </base-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'My',
  async mounted() {
    this.SetLoader(true);
    this.SetLoader(false);
  },
};
</script>

<style lang="scss" scoped>
.my{
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 130%;
  color: #8D96A2;
  text-decoration: none;
  }
.quests{
  position: static;
  width: 1170px;
  height: 32px;
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 130%;
  color: #1D2127;
  flex: none;
  order: 0;
  flex-grow: 0;
  margin: 15px;
  padding: 20px 370px;
}
.content {
  display: grid;
  align-items: center;
  grid-template-columns: 114px 110px 181px 176px 143px 147px;
  grid-gap: 10px;
  padding: 20px 370px;
  &_btn {
    padding: 10px 20px;
    width: max-content;
    height: 41px;
  }
}
</style>
