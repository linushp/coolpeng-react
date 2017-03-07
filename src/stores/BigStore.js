import RebixFlux from 'react-rebixflux';

import LoginStore from './LoginStore';
import MessageStore from './MessageStore';
import SessionStore from './SessionStore';
import UserAccountStore from './UserAccountStore';


export default RebixFlux.createMergedStore({
    loginState: LoginStore,
    sessionState: SessionStore,
    messageState: MessageStore,
    userAccountState : UserAccountStore
});