import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Custom Hook لاستخدام الـ Context بسهولة
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // حالة المستخدم

    // دالة تسجيل الدخول (أنت هتعدلها بناءً على الـ API)
    const login = (userData) => {
        setUser(userData); // حفظ بيانات المستخدم
    };

    // دالة تسجيل الخروج
    const logout = () => {
        setUser(null); // حذف بيانات المستخدم
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
