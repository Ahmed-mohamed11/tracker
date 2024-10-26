import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Custom Hook لاستخدام الـ Context بسهولة
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // حالة المستخدم

    // دالة تسجيل الدخول (أنت هتعدلها بناءً على الـ API)
    const login = (userData) => {
        setUser(userData); // حفظ بيانات المستخدم
        localStorage.setItem('user', JSON.stringify(userData)); // حفظ بيانات المستخدم في اللوكل استوردج

    };

    // دالة تسجيل الخروج
    const logout = () => {
        setUser(null); // حذف بيانات المستخدم
        localStorage.removeItem('user'); // حذف بيانات المستخدم من اللوكل استوردج
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
