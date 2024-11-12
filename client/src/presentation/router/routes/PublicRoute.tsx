import React, { useContext, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../providers/AuthProvider';


interface PublicRouteProps {
    children?: React.ReactNode;
}

export const PublicRoute = ({ children }: PublicRouteProps) => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();


    useEffect(() => {
        if (auth.status === 'authenticated' && location.key === 'default') {
            navigate('/chats');
        }
        else if (auth.status === 'authenticated' && !(location.key === 'default')) {
            navigate(-1);
        }
    }, [auth.status, location.key]);

    return children ? <>{children}</> : <Outlet />;
};
