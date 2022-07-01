import { LoaderModes } from '~/utils/loader';

export default () => ({
  isLoading: false,
  loaderStatusText: null,
  loaderMode: LoaderModes.default,
  isLoaderBackgroundHider: false,
  loaderProgress: 0,
  connections: {
    notifsConnection: false,
    chatActionsConnection: false,
  },
});
