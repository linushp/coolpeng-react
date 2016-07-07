import Api from './api';

const api = new Api({
  baseURI: '/coolpeng', //TODO
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json;charset=UTF-8'
  }
});

export default api
