import { createContext, Dispatch, PropsWithChildren, SetStateAction, useState } from "react";
import inTouchIoApi from "../config/api/inTouchIoApi";
import { UserMapper } from "../../infrastructure/mappers/user.mapper";
import { User } from "../../domain/entities/user.entity";

interface AuthContextProps {
    auth: typeof initialState;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    checkAuthToken: () => Promise<void>;
    logout: () => void;
    setAuth: Dispatch<SetStateAction<AuthProps>>;
    clearErrorMessage: () => void;
}

interface AuthProps {
    status: string;
    user: User;
    errorMessage: string;
}

const userInitialState: User = {
    email: '',
    id: '',
    name: '',
    pictureId: '',
    pictureUrl: ''
}

const initialState = {
    status: 'checking',
    user: userInitialState,
    errorMessage: ''
}

export const AuthContext = createContext<AuthContextProps>({
    auth: initialState,
    login: async () => { throw new Error('login not implemented') },
    register: async () => { throw new Error('register not implemented') },
    checkAuthToken: async () => { throw new Error('checkAuthToken not implemented') },
    logout: () => { throw new Error('logout not implemented') },
    setAuth: () => { throw new Error('setAuth not implemented') },
    clearErrorMessage: () => { throw new Error('clearErrorMessage not implemented') },
});

export const AuthProvider = ({ children }: PropsWithChildren) => {

    const [auth, setAuth] = useState(initialState);

    const login = async (email: string, password: string) => {
        try {
            const { data } = await inTouchIoApi.post('/auth/login', { email, password });

            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime().toString());

            setAuth({
                status: 'authenticated',
                user: UserMapper.toEntity(data),
                errorMessage: ''
            });
        } catch (error: any) {
            if (error instanceof TypeError) {
                setAuth({
                    status: 'unauthenticated',
                    user: userInitialState,
                    errorMessage: error.message
                });
            }
            setAuth({
                status: 'unauthenticated',
                user: userInitialState,
                errorMessage: error.response.data?.message || 'Wrong credentials'
            });
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            const { data } = await inTouchIoApi.post('/auth/register', { email, password, name });
            localStorage.setItem('token', data.token);
            localStorage.setItem('token-init-date', new Date().getTime().toString());
            setAuth({
                status: 'authenticated',
                user: data.user,
                errorMessage: ''
            })
        } catch (error: any) {
            setAuth({
                status: 'unauthenticated',
                user: userInitialState,
                errorMessage: error.response.data?.error || 'Register message missing AuthProvider'
            });
        }
    };

    const checkAuthToken = async () => {
        try {
            const { data } = await inTouchIoApi.get('/auth');
            
            if (data.user == null) {
                setAuth({
                  status: "unauthenticated",
                  user: userInitialState,
                  errorMessage: '',
                });

                return;
            } 

            setAuth({
                status: 'authenticated',
                user: data.user,
                errorMessage: ''
            })
        } catch (error: any) {
            if (error instanceof TypeError) {
                setAuth({
                    status: 'unauthenticated',
                    user: userInitialState,
                    errorMessage: error.message
                });
            } else {
                setAuth({
                    status: 'unauthenticated',
                    user: userInitialState,
                    errorMessage: error.response.data?.error || 'Wrong credentials'
                });
            }

        }
    }

    const logout = () => {
        localStorage.removeItem('token');
        setAuth({
            status: 'unauthenticated',
            user: userInitialState,
            errorMessage: ''
        })
    }

    const clearErrorMessage = () => {
        setAuth(prev => ({ ...prev, errorMessage: '' }))
    }

    return (
        <AuthContext.Provider value={{
            auth,
            login,
            register,
            checkAuthToken,
            logout,
            setAuth,
            clearErrorMessage
        }}>
            {children}
        </AuthContext.Provider>
    )
}