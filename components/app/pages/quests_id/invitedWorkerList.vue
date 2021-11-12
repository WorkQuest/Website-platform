<template>
  <!--      TODO: Вывести список Invited!-->
  <div class="worker worker__card">
    <div class="worker__title worker__col_two">
      <div>{{ $t('quests.invited') }}</div>
      <div
        class="btns__wrapper"
      >
        <div class="btn__wrapper">
          <base-btn
            :disabled="Object.keys(currentWorker).length === 0"
            class="btn__start"
            @click="startQuest(currentWorker)"
          >
            {{ $t('quests.startQuest') }}
          </base-btn>
        </div>
      </div>
      <div style="margin: 15px 0 0 15px; padding: 0 0 15px 0; color: #7C838DFF; font-size: 16px;">
        Workers not invited!
      </div>
      <!--        <span v-if="filteredResponses.length">-->
      <!--          <span-->
      <!--            v-for="(response, i) in filteredResponses"-->
      <!--            :key="i"-->
      <!--          >-->
      <!--            <div-->
      <!--              v-if="response.worker.firstName && response.worker.lastName"-->
      <!--              class="worker__container"-->
      <!--            >-->
      <!--              <div class="worker worker__col_two">-->
      <!--                <div class="worker row">-->
      <!--                  <img-->
      <!--                    class="worker__avatar"-->
      <!--                    :src="response.worker.avatar ? response.worker.avatar.url: require('~/assets/img/app/avatar_empty.png')"-->
      <!--                    alt=""-->
      <!--                  >-->
      <!--                  <div-->
      <!--                    class="worker__name"-->
      <!--                  >-->
      <!--                    {{ response.worker.firstName }} {{ response.worker.lastName }}-->
      <!--                  </div>-->
      <!--                </div>-->
      <!--                <quest-id-dd-->
      <!--                  :i="i"-->
      <!--                  :response-id="response.id"-->
      <!--                />-->
      <!--              </div>-->
      <!--              <div class="worker__message">-->
      <!--                {{ response.message }}-->
      <!--              </div>-->
      <!--              <div>-->
      <!--              &lt;!&ndash;                      TODO: НАСТРОИТЬ ВЫВОД СТАТУСА нет бэка&ndash;&gt;-->
      <!--              &lt;!&ndash;                    <div&ndash;&gt;-->
      <!--              &lt;!&ndash;                      v-if="item.badge.code !== 0"&ndash;&gt;-->
      <!--              &lt;!&ndash;                      class="card__level_higher"&ndash;&gt;-->
      <!--              &lt;!&ndash;                      :class="[&ndash;&gt;-->
      <!--              &lt;!&ndash;                        {'card__level_higher': item.badge.code === 1},&ndash;&gt;-->
      <!--              &lt;!&ndash;                        {'card__level_reliable': item.badge.code === 2},&ndash;&gt;-->
      <!--              &lt;!&ndash;                        {'card__level_checked': item.badge.code === 3}&ndash;&gt;-->
      <!--              &lt;!&ndash;                      ]"&ndash;&gt;-->
      <!--              &lt;!&ndash;                    >&ndash;&gt;-->
      <!--              &lt;!&ndash;                      <span v-if="item.badge.code === 1">&ndash;&gt;-->
      <!--              &lt;!&ndash;                        {{ $t('levels.higher') }}&ndash;&gt;-->
      <!--              &lt;!&ndash;                      </span>&ndash;&gt;-->
      <!--              &lt;!&ndash;                      <span v-if="item.badge.code === 2">&ndash;&gt;-->
      <!--              &lt;!&ndash;                        {{ $t('levels.reliableEmp') }}&ndash;&gt;-->
      <!--              &lt;!&ndash;                      </span>&ndash;&gt;-->
      <!--              &lt;!&ndash;                      <span v-if="item.badge.code === 3">&ndash;&gt;-->
      <!--              &lt;!&ndash;                        {{ $t('levels.checkedByTime') }}&ndash;&gt;-->
      <!--              &lt;!&ndash;                      </span>&ndash;&gt;-->
      <!--              &lt;!&ndash;                    </div>&ndash;&gt;-->
      <!--              </div>-->
      <!--            </div>-->
      <!--          </span>-->
      <!--        </span>-->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'InvitedWorkerList',
  computed: {
    ...mapGetters({
      currentWorker: 'quests/getCurrentWorker',
      questData: 'quests/getQuest',
    }),
  },
  async created() {
    this.SetLoader(true);
    await this.initData();
    this.SetLoader(false);
  },
  methods: {
    async initData() {
      await this.$store.dispatch('quests/getQuest', this.$route.params.id);
    },
    async startQuest() {
      this.SetLoader(true);
      const payload = {
        assignedWorkerId: this.currentWorker.id,
      };
      const questId = this.questData.id;
      await this.$store.dispatch('quests/startQuest', { questId, payload });
      await this.$store.dispatch('quests/setInfoDataMode', 4);
      this.SetLoader(false);
    },
  },
};
</script>

<style lang="scss" scoped>
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0 0 10px 0;
}
.btn {
  &__wrapper {
    width: 220px;
    margin: 0 20px 0 0;
  }
  &__start {
    height: 43px;
  }
}
.btns {
  &__container {
    display: grid;
    margin-bottom: 20px;
  }
  &__wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
}
.worker {
  font-size: 16px;
  font-weight: 500;
  color: $black800;
   &__card {
    margin: 30px 0;
    background: $white;
    border-radius: 6px;
  }
 &__message {
   @include text-simple;
   margin: 0 0 10px 0;
   font-size: 16px;
   color: $black500;
 }
  &__col {
    &_two {
      width: 100%;
      display: grid;
      grid-template-columns: repeat(2, auto);
      justify-content: space-between;
      align-items: center;
    }
 }
  &__container_row {
    display: flex;
    flex-direction: row;
    justify-items: flex-start;
    align-items: center;
    margin: 20px 15px;
  }
  &__container {
    display: flex;
    flex-direction: column;
    justify-items: flex-start;
    align-items: flex-start;
    margin: 20px 15px;
  }
  &__avatar {
    border-radius: 50%;
    width: 40px;
    height: 40px;
 }
  &__name {
    @extend .worker;
    margin: 0 10px 0 10px;
  }
 &__title {
    @extend .worker;
    font-size: 18px;
    margin: 0 0 0 15px;
    padding: 15px 15px 0 0;
  }
}
</style>
