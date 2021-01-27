import React, {useState, useEffect, useCallback, useContext} from 'react';
import {useHttp} from '../hooks/http.hook'; 
import {useMessage} from '../hooks/message.hook'; 
import {AuthContext} from '../context/AuthContext';

export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const message = useMessage();
    const {loading, error, request, clearError}= useHttp();
    const [form, setForm] = useState({
        email:'', password: ''
    });

    useEffect(() => {
        message(error);
        clearError();
    },[error, message, clearError]);

    useEffect( () => {
        window.M.updateTextFields(); // Materialize method to do form inputs active
    },[]);

    //update form date
    const changeHandler = event => {
        setForm({...form, [event.target.name]: event.target.value}); // [event.target.name] - dynamic key. Automatically recognize which parameter has been changed (name or password)
    };

    const registerHandler = async () => {
        try {
            const data = await request('/api/auth/register', 'POST', {...form}); // pass parameters to useHttp hook
            console.log('Data', data);
            message(data.message);
        } catch (e) {
            //leave empty because error was handled in useHttp hook
        }
    }

    const loginHandler = async () => {
        try {
            const data = await request('/api/auth/login', 'POST', {...form}); // pass parameters to useHttp hook
            auth.login(data.token, data.userId); // pass parameters to auth.hook -> const login = useCallback((jwtToken, id) =>
            console.log('Data', data);
            message(data.message);
        } catch (e) {
            //leave empty because error was handled in useHttp hook
        }
    }

    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Shorten link</h1>
                <div className="card blue darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">Авторизация</span>
                        <div>
                            <div className="input-field">
                                <input 
                                    placeholder="Введите email" 
                                    id="email"
                                    type="text"
                                    name="email"
                                    className="yellow-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="email">First Name</label>
                            </div>
                            <div className="input-field">
                                <input 
                                    placeholder="Введите пароль" 
                                    id="password" 
                                    type="password"
                                    name="password"
                                    className="yellow-input"
                                    onChange={changeHandler}
                                />
                                <label htmlFor="email">First Name</label>
                            </div>
                        </div>
                    </div>
                    <div className="card-action">
                        <button 
                            className="btn yellow darken-4" 
                            style={{marginRight: 10}} 
                            disabled={loading}
                            onClick={loginHandler}
                        >
                            Войти
                        </button>
                        <button 
                            className="btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}
                        >
                            Регистрация
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}