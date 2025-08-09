import { useNavigate } from "react-router";
import LoginForm, { type LoginData } from "../components/LoginForm";
import { SERVER_PATH } from "../constants";
import { useContext } from "react";
import { AuthContext } from "../contexts";





function Login() {
    const navigate = useNavigate()
    const user = useContext(AuthContext)
    if (user != null) {
        navigate("/")
    }

    async function handleLogin(data: LoginData) {

        try {
            const response = await fetch(`${SERVER_PATH}/api/account/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Login failed: ${error}`);
            }

            const result = await response.json();
            localStorage.setItem('token', result.token);
            console.log('Logged in successfully:', result);
            navigate("/")

        } catch (error) {
            console.error('Login error:', error);
        }
    }

    return (
        <div>
            <h2>Login</h2>
            <LoginForm onSubmit={handleLogin} />
        </div>
    );
}

export default Login;
