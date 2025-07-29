import { Routes, Route } from 'react-router';
import AppRoutes from './AppRoutes';
import { useEffect, useState } from 'react';
import { AuthContext } from './contexts';
import type { User } from './models/user';
import AppHeader from './components/AppHeader';
import "./App.css"

function App() {
    const [user, setUser] = useState < null | User>(null)
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            fetch("https://localhost:7084/api/account/userinfo", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then(res => res.json())
                .then(data => {
                    setUser({
                        id:data.id,
                        username: data.username,
                        coins: data.coins,
                        token: token,
                    });
                })
                .catch(() => {
                    console.log("invalid token")
                  //  localStorage.removeItem("token"); // Invalid token
                    //setUser(null);
                });
        }
    }, []);

    return (
        <AuthContext value={{ user, setUser }} >
            <div className="">
        <AppHeader/>
            <Routes>
                {AppRoutes.map((route, index) => {
                    const { element, ...rest } = route;
                    return <Route key={index} {...rest} element={element} />;
                })}
                </Routes>
            </div>
        </AuthContext>
      
    );
}

export default App;