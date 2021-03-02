import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../../_actions/user_action';
import { withRouter } from 'react-router-dom';

function RegisterPage(props) {
    const dispatch = useDispatch();

    // 데이터를 변화시키려면
    // state를 변화시켜야 됨
    // state 만들기 (email state, password state)
    // useState 를 통해 state 를 생성
    // useState 는 react lib를 통해 import 할 수 있음
    const [Email, setEmail] = useState("")
    const [Name, setName] = useState("")
    const [Password, setPassword] = useState("")
    const [ConfirmPassword, setConfirmPassword] = useState("")

    const onEmailHandler = (event) => {
        setEmail(event.currentTarget.value);
    }

    const onNameHandler = (event) => {
        setName(event.currentTarget.value);
    }

    const onPasswordHandler = (event) => {
        setPassword(event.currentTarget.value);
    }

    const onConfirmPasswordHandler = (event) => {
        setConfirmPassword(event.currentTarget.value);
    }

    const onSubmitHandler = (event) => {
        event.preventDefault();

        // 패스워드와 confirm Password 가 같은지 확인
        if(Password !== ConfirmPassword) {
            return alert("비밀번호가 일치하지 않습니다.");
        }

        // 서버에 보낼 email, password 값을
        // state 가 가지고 있음
        // 이를 server 에 보낼 때는 axios 를 써서 post라는 http 메소드를 이용

        let body = {
            email: Email,
            name: Name,
            password: Password
        }

        // dispatch 를 통해서 action 을 reducer 에 날려준다.
        dispatch(registerUser(body))
            .then(response => {
                if(response.payload.success) {
                    props.history.push("/login")
                } else {
                    alert("Failded to Sign up.");
                }
            })
    }
    
    return (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center',
        width:'100%', height:'100vh'}}>
            <form style={{display:'flex', flexDirection:'column'}}
                onSubmit={onSubmitHandler}>
                <label>Email</label>
                <input type="email" value={Email} onChange={onEmailHandler} />
                
                <label>Name</label>
                <input type="text" value={Name} onChange={onNameHandler} />

                <label>Password</label>
                <input type="password" value={Password} onChange={onPasswordHandler} />

                <label>Confirm Password</label>
                <input type="password" value={ConfirmPassword} onChange={onConfirmPasswordHandler} />
                
                <br />
                
                <button type="submit">
                    회원가입
                </button>
            </form>
        </div>
    )
}

export default withRouter(RegisterPage)