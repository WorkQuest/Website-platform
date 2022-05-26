import Connection from '~/plugins/connection';
import ENV from '~/utils/adresses/index';

export default async ({ store, $axios }, inject) => {
  const connectionManager = {
    availableConnections: [],
    // privateConnections: [],
    connections: [
      {
        name: 'wsNotifs', url: ENV.WS_NOTIFS_URL, verboseName: 'notifsConnection',
      },
      {
        name: 'wsChatActions', url: ENV.WS_CHAT_ACTIONS_URL, verboseName: 'chatActionsConnection',
      },
    ],
    async initConnection(_connection) {
      const connection = new Connection(_connection.url, _connection.name);
      connection.onConnect = () => {
        store.commit('main/updateConnectionsStatus', { name: _connection.verboseName, value: true });
      };
      connection.onDisconnect = () => {
        store.commit('main/updateConnectionsStatus', { name: _connection.verboseName, value: false });
      };
      connection.onError = () => {
        store.commit('main/updateConnectionsStatus', { name: _connection.verboseName, value: false });
      };
      this.availableConnections.push(connection);
      inject(_connection.name, connection);
    },
    async start() {
      return Promise.all(this.connections.map((item) => this.initConnection(item)));
    },
    async connect(token) {
      return Promise.all(this.availableConnections.map((item) => item.connect(token)));
    },
    async disconnect() {
      return Promise.all(this.connections.map((item) => item.disconnect()));
    },
  };
  await connectionManager.start();
  inject('connectionManager', connectionManager);
};
