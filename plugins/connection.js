/* eslint-disable class-methods-use-this */
// /* eslint-disable consistent-return */
import { Client } from '@hapi/nes/lib/client';

export default class extends Client {
  constructor(url, name, options = {}) {
    super(url);
    this.name = name;
    this.isPrivate = options.isPrivate;
  }

  onAuthError = () => {
  }

  onRequestError = () => {
  }

  async connect(token) {
    try {
      return await super.connect(this.formConfigObject(token));
    } catch (e) {
      console.log(e);
      return e;
    }
  }

  request(options) {
    return new Promise((resolve, reject) => {
      super.request(options).then((resp) => {
        if (resp.payload.ok === false) {
          const error = {
            data: resp.payload,
          };
          reject(error);
        }
        resolve(resp);
      }).catch((err) => {
        reject(err);
      });
    });
  }

  reauthenticate(token) {
    let options = null;
    if (token) {
      options = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
    }
    return super.reauthenticate(options)
      .catch((err) => {
        this.onAuthError(err);
      });
  }

  async subscribe(path, handler) {
    if (this.subscriptions().includes(path)) {
      await this.unsubscribe(path, null);
    }
    return super.subscribe(path, handler);
  }

  async unsubscribe(path, handler = null) {
    await super.unsubscribe(path, handler);
  }

  formConfigObject(_token) {
    const token = _token ? `Bearer ${_token}` : null;
    return {
      auth: {
        headers: {
          Authorization: token,
        },
      },
    };
  }

  createQuery(params) {
    return `?${Object.keys(params).map((key) => `${key}=${params[key]}`).join('&')}`;
  }

  async $get(path, queries = null) {
    if (queries) path += this.createQuery(queries);

    try {
      const response = await this.request({ method: 'GET', path });
      return response;
    } catch (e) {
      console.dir(e);
      throw e;
    }
  }

  async $post(path, payload = null) {
    try {
      const response = await this.request({ method: 'POST', path, payload });
      return response;
    } catch (e) {
      console.dir(e);
      throw e;
    }
  }
}
