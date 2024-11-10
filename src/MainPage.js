import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import StockInput from './StockInput';

const MainPage = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    React.useEffect(() => {
        if (!isAuthenticated) {
            loginWithRedirect();
        }
    }, [isAuthenticated, loginWithRedirect]);

    return (
        <div>
            {isAuthenticated && <StockInput />}
        </div>
    );
};

export default MainPage;