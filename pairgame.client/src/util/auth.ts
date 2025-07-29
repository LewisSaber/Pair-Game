import type { NavigateFunction } from "react-router";
import { LOGIN_PATH, TOKEN_PATH } from "../constants";
import type { User } from "../models/user";



export function logout(setUser: (user: null) => void, navigate: NavigateFunction) {
    setUser(null)
    localStorage.removeItem(TOKEN_PATH)
    navigate(LOGIN_PATH)
}

export function login() {

}

export function authFetch(url: string, init: RequestInit = {}) {
    const token = localStorage.getItem(TOKEN_PATH)
    init.headers = { ...init.headers, Authorization: `Bearer ${token}` }

    return fetch(url,init)
}