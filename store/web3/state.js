import { ConnectionTypes } from '~/utils/enums';

export default () => ({
  isConnected: false,
  isHandlingMetamaskStatus: false,
  account: {},

  connectionType: ConnectionTypes.WEB3,
});
