import { createContext } from "react";
import type { User } from "./models/user";



export const AuthContext = createContext<{
    user: User | null;
    setUser: (user: User | null) => void;
}>({
    user: null,
    setUser: () => { },
});