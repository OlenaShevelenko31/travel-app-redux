import React, { useEffect } from 'react';

const Logout = () => {
    useEffect(() => {
        localStorage.removeItem('userId'); 
        window.location.href = 'http://localhost:5173//'; 
    }, []);

    return (
        <div>
            <h2>Logging out...</h2>
        </div>
    );
}

export default Logout;
