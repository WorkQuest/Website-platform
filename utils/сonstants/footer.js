import { DaoUrl, WikiUrl } from '~/utils/enums';

export const URLS = Object.freeze({
  SOCIALS: {
    TWITTER: 'https://twitter.com/workquest_co',
    YOUTUBE: 'https://www.youtube.com/channel/UCpQTdOMynXejrRTVf4ksKPA',
    REDDIT: 'https://www.reddit.com/user/WorkQuest_co',
    FACEBOOK: 'https://facebook.com/WorkQuestOfficial/',
    LINKEDIN: 'https://www.linkedin.com/company/workquestofficial',
    INSTAGRAM: 'https://www.instagram.com/workquestofficial/',
    TELEGRAM: 'https://t.me/WorkQuest',
  },
  STORES: {
    APP_STORE: 'https://apps.apple.com/ru/app/workquest/id1571442820',
    PLAY_MARKET: 'https://play.google.com/store/apps/details?id=com.company.workquestapp&hl=ru&gl=US',
  },
  DAO: DaoUrl,
  WIKI: WikiUrl,
});

export const LEGAL_INFO = Object.freeze({
  RISKS: 'https://workquest.co/risks_disclaimer.html',
  PRIVACY_POLICY: 'https://workquest.co/privacy_policy.html',
  TERM_CONDITIONS: 'https://workquest.co/terms_conditions.html',
  AML_POLICY: 'https://workquest.co/aml_ctf_policy.html',
  COOKIE_POLICY: 'https://workquest.co/aml_ctf_policy.html',
});

export const COMPANY = Object.freeze({
  ABOUT_US: 'https://workquest.co/',
  LEADERSHIP: 'https://workquest.co/#Team',
});
