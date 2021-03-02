import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function LoginPage(props) {
    const dispatch = useDispatch();

    // 데이터를 변화시키려면
    // state를 변화시켜야 됨
    // state 만들기 (email state, password state)
    // useState 를 통해 state 를 생성
    // useState 는 react lib를 통해 import 할 수 있음
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        // 서버에 보낼 email, password 값을
        // state 가 가지고 있음
        // 이를 server 에 보낼 때는 axios 를 써서 post라는 http 메소드를 이용

        let body = {
            email: Email,
            password: Password
        }

        dispatch(loginUser(body))
            .then(response => {
                if(response.payload.loginSuccess) {
                    props.history.push('/')
                } else {
                    alert('Error');
                }
            })
    }

    // 타이핑을 할 때 onchange 이벤트를 통해 state 값을 바꿔주고
    // state 값이 바꿔지면 value 가 변화함
    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center',
        width:'100%', height:'100vh'}}>
            <form style={{display:'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />
                <br />
                <button>
                    login
                </button>
            </form>
        </div>
    )
}

export default withRouter(LoginPage)
