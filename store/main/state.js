import loaderModes from '~/store/main/loaderModes';

export default () => ({
  isLoading: false,
  loaderStatusText: 'Loading',
  loaderMode: loaderModes.default,
  isLoaderBackgroundHider: true,
  loaderProgress: 0,
  connections: {
    notifsConnection: false,
    chatActionsConnection: false,
  },
});
