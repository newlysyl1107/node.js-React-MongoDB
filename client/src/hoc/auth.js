/* eslint-disable import/no-anonymous-default-export */
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function (SpecificComponent, option, adminRoute = null ) {
    
    /*
        option
    
    null : 아무나 출입가능한 페이지
    true : 로그인한 유저만 출입가능한 페이지
    false : 로그인한 유저는 출입불가능한 페이지
    
    */

    function AuthenticationCheck(props) {
        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                // response 안에 backend 에서 가져온 userData 가 들어있음
                console.log(response);

                // 로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option === true) {
                        props.history.push('/login');
                    }
                } else {
                    // 로그인한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        props.history.push('/');
                    } else {
                        if(option === false) {
                            props.history.push('/');
                        }
                    }
                }
            })
        }, [])

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}