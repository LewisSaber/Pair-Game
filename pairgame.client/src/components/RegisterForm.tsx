import React, { useState } from 'react';

export type RegisterData = {
    username: string;
    password: string;
};

type RegisterFormProps = {
    onSubmit?: (data: RegisterData) => void;
};

function RegisterForm({ onSubmit }: RegisterFormProps) {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (onSubmit) onSubmit(formData);
    }

    return (
        <form onSubmit={handleSubmit} className="mx-auto p-4 border rounded" style={{ maxWidth: 400 }}>
            <div className="mb-3">
                <label htmlFor="username" className="form-label">
                    Username:
                </label>
                <input
                    id="username"
                    name="username"
                    type="text"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    placeholder="Enter username"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="password" className="form-label">
                    Password:
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter password"
                />
            </div>

            <button type="submit" className="btn btn-primary w-100">
                Register
            </button>
        </form>
    );
}

export default RegisterForm;
