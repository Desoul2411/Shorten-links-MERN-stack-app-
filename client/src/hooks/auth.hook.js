import {useState, useCallback, useEffect} from 'react';

const storageName = 'userData';

export const useAuth = () => {
    const [token,setToken] = useState(null);
    const [ready, setReady] = useState(false); // to tell that authorization module finished work or not
    const [userId, setUserId] = useState(null);

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken);
        setUserId(id);

        localStorage.setItem(storageName, JSON.stringify({
            userId: id, token: jwtToken
        }));
    },[]);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        localStorage.removeItem(storageName);

    },[]);

    useEffect(() => {
        const data = JSON.parse(localStorage.getItem(storageName));  // call JSON.parse to transform string to object

        if (data && data.token) {    // if user name already in local storage - login user automatically
            login(data.token, data.userId);
        }
        setReady(true); // to tell that authorization module finished work
    },[]);

    return {login, logout, token, userId, ready}; 

}