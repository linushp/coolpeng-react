import RebixFlux from 'react-rebixflux';

import LoginStore from './LoginStore';
import MessageStore from './MessageStore';
import SessionStore from './SessionStore';


export default RebixFlux.createMergedStore({
    LoginStore: LoginStore,
    SessionStore: SessionStore,
    MessageStore: MessageStore
});