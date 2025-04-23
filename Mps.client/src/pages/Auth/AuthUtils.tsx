export const isUserLoggedIn = () => {
    const authToken = localStorage.getItem('authToken');
    return authToken !== null;
};

export const isUserAdmin = () => {  
    return localStorage.getItem('isAdmin') === 'true';
};