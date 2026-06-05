import {setError, setLoading, setUser} from '../state/auth.slice.js';
import {register, login} from '../service/auth.api';
import {useDispatch} from 'react-redux';


export const useAuth = ()=>{

    const dispatch = useDispatch()

    async function handleRegister({email, contact, password, fullname, isSeller=false}){
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await register({email, contact, password, fullname, isSeller});
            dispatch(setUser(data.user));
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 
                            error.response?.data?.errors?.[0]?.msg || 
                            "Registration failed. Please try again.";
            dispatch(setError(message));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }
    async function handleLogin({email, password}){
        try {
            dispatch(setLoading(true));
            dispatch(setError(null));
            const data = await login({email, password});
            dispatch(setUser(data.user));
            return true;
        } catch (error) {
            const message = error.response?.data?.message || 
                            error.response?.data?.errors?.[0]?.msg || 
                            "Login failed. Please check your credentials.";
            dispatch(setError(message));
            return false;
        } finally {
            dispatch(setLoading(false));
        }
    }


    return {
        handleRegister,
        handleLogin
    }

}
