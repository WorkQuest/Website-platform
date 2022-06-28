import { mapGetters } from 'vuex';
import { LocalNotificationAction } from '~/utils/notifications';
import { SumSubStatuses, TwoFAStatuses } from '~/utils/enums';

export default {
  data() {
    return {
      profileFilled: false,
    };
  },
  computed: {
    ...mapGetters({
      userRole: 'user/getUserRole',
      userData: 'user/getUserData',
      statusKYC: 'user/getStatusKYC',
      status2FA: 'user/getStatus2FA',
      notificationsList: 'notifications/getNotificationsList',
      notifsCount: 'notifications/getNotificationsCount',
      unreadNotifsCount: 'notifications/getUnreadNotifsCount',
    }),
  },
  mounted() {
    if (this.userData && this.userData.id) {
      const {
        avatar, firstName, lastName, locationPlaceName, additionalInfo: { description },
      } = this.userData;
      this.profileFilled = !!avatar && !!firstName && !!lastName && !!locationPlaceName && !!description;
    }
  },
  methods: {
    /**
     * The total number of local notifications
     * @returns {Promise<number>}
     */
    async getCountLocalNotifications() {
      let counterLocalNotifications = 2; // Starter counter notifications below without any condition
      if (this.statusKYC === SumSubStatuses.NOT_VERIFIED) counterLocalNotifications += 1;
      if (this.status2FA === TwoFAStatuses.DISABLED) counterLocalNotifications += 1;
      if (!this.profileFilled) counterLocalNotifications += 1;
      return counterLocalNotifications;
    },
    /**
     * Adding the notifications below to the notification list from backend
     * @returns {Promise<void>}
     */
    async setLocalNotifications(counterBackendNotifications = 0) {
      const { $cookies } = this;
      const counterLocalNotifications = await this.getCountLocalNotifications();
      await this.$store.dispatch('notifications/setCounterNotifications', counterBackendNotifications + counterLocalNotifications);
      await this.$store.dispatch('notifications/createLocalNotification', {
        id: '1',
        action: LocalNotificationAction.GET_REWARD,
        message: this.$t('localNotifications.messages.inviteFriends'),
        actionBtn: this.$t('localNotifications.btns.inviteFriends'),
      });
      await this.$store.dispatch('notifications/createLocalNotification', {
        id: '2',
        action: LocalNotificationAction.WIKI,
        message: this.$t('localNotifications.messages.wiki'),
        actionBtn: this.$t('localNotifications.btns.wiki'),
      });
      if (this.statusKYC === SumSubStatuses.NOT_VERIFIED) {
        const KYC = $cookies.get(LocalNotificationAction.TWOFA);
        if (!KYC) {
          this.$cookies.set(LocalNotificationAction.KYC, this.statusKYC !== 0, {
            maxAge: 60 * 60 * 24 * 7,
            enabled: true,
          });
        }
        await this.$store.dispatch('notifications/createLocalNotification', {
          id: '3',
          action: LocalNotificationAction.KYC,
          message: this.$t('localNotifications.messages.kyc'),
          actionBtn: this.$t('localNotifications.btns.kyc'),
        });
      }
      if (this.status2FA === TwoFAStatuses.DISABLED) {
        const TWOFA = $cookies.get(LocalNotificationAction.KYC);
        if (!TWOFA) {
          this.$cookies.set(LocalNotificationAction.TWOFA, this.status2FA !== 0, {
            maxAge: 60 * 60 * 24 * 7,
            enabled: true,
          });
        }
        await this.$store.dispatch('notifications/createLocalNotification', {
          id: '4',
          action: LocalNotificationAction.TWOFA,
          message: this.$t('localNotifications.messages.twoFA'),
          actionBtn: this.$t('localNotifications.btns.toSettings'),
        });
      }
      if (!this.profileFilled) {
        await this.$store.dispatch('notifications/createLocalNotification', {
          id: '5',
          action: LocalNotificationAction.PROFILE_FILLED,
          message: this.$t('localNotifications.messages.fillSettingsData'),
          actionBtn: this.$t('localNotifications.btns.toSettings'),
        });
      }
    },
  },
};
