import { useContext } from "react";
import { AuthContext } from "../../contexts";

function ProfileTab() {
    const { user } = useContext(AuthContext);

    return (
        <div className="container mt-4">
            <h4>Welcome, {user?.username}!</h4>
        </div>
    );
}

export default ProfileTab;