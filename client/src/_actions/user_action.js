import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER
} from './types';

export function loginUser(dataTosubmit) {

    // 서버에서 받은 data (로그인 단의 email, password 를 포함한 body)
    // 를 request 에 저장한다.
    const request =  axios.post('/api/users/login', dataTosubmit)
        .then(response => response.data)
    
    // return 을 해서 request 를 reducer 에 넘겨주기
    // reducer 에서 이전 state 와 현재의 action 을 조합하여 다음 state 을 만든다.
    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function registerUser(dataTosubmit) {
    const request = axios.post('/api/users/register', dataTosubmit)
        .then(response => response.data)

    return {
        type: REGISTER_USER,
        payload: request
    }
}