import {setError, setLoading, setUser} from '../state/auth.slice.js';
import {register, login, getMe} from '../service/auth.api';
import {useDispatch} from 'react-redux';


export const useAuth = ()=>{

    const dispatch = useDispatch()

    async function handleRegister({email, contact, password, fullname, isSeller=false}){
        const data = await register({email, contact, password, fullname, isSeller});
        dispatch(setUser(data.user));
        return data.user;
    }
    async function handleLogin({email, password}){
       const data = await login({email, password});
       dispatch(setUser(data.user));
       return data.user;
    }

    async function handleGetMe(){
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await getMe();
            dispatch(setUser(data.user));
            return true;
        } catch (error) {
            // 401 = user simply isn't logged in — not a user-facing error, fail silently
            const status = error.response?.status;
            if (status !== 401) {
                const message = error.response?.data?.message || 
                                "Something went wrong. Please try again.";
                dispatch(setError(message));
            }
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }


    return {
        handleRegister,
        handleLogin,
        handleGetMe
    }

}
