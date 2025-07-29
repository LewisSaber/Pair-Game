import { useNavigate } from "react-router";
import RegisterForm, { type RegisterData } from "../components/RegisterForm";
import { AuthContext } from "../contexts";
import { useContext } from "react";

function Registration() {
    const navigate = useNavigate()

    const user = useContext(AuthContext)
    if (user != null) {
        navigate("/")
    }
    async function handleRegister(data: RegisterData) {
        try {
            const response = await fetch('https://localhost:7084/api/account/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const error = await response.text();
                throw new Error(`Registration failed: ${error}`);
            }

            const result = await response.json();
            console.log('Registration successful:', result);
            navigate("/")
        } catch (err) {
            console.error('Error:', err);
        }
    }

    return (
        <div>
            <h2>Register</h2>
            <RegisterForm onSubmit={handleRegister} />
        </div>
    );
}

export default Registration;