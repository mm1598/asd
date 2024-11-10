import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import StockInput from './StockInput'; // Assuming StockInput is your main component

const MainPage = () => {
    const { isAuthenticated, loginWithRedirect } = useAuth0();

    React.useEffect(() => {
        if (!isAuthenticated) {
            // Redirect to login if not authenticated
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