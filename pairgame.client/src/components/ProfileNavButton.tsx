import { useContext } from "react";
import { AuthContext } from "../contexts";
import { Dropdown } from "react-bootstrap";
import { logout } from "../util/auth";
import { useNavigate } from "react-router";
import { LOGIN_PATH, REGISTER_PATH } from "../constants";

function ProfileNavButton() {
    const { user,setUser } = useContext(AuthContext);
    const navigate = useNavigate()

    if (user == null) {
        return (
            <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    Guest
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={()=>navigate(LOGIN_PATH) }>Login</Dropdown.Item>
                    <Dropdown.Item onClick={() => navigate(REGISTER_PATH)}>Register</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        );
    }

    

    return (
        <div className="d-flex align-items-center gap-2">
        <Dropdown>
            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                {user?.username }
            </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => navigate(`/profile?userid=${user.id}`)}>Profile</Dropdown.Item>
                <Dropdown.Item onClick={() => logout(setUser,navigate)}>logout</Dropdown.Item>
            </Dropdown.Menu>
            </Dropdown>
            <p className="btn btn-secondary ms-2 mb-0" style={{ pointerEvents: 'none' }}>
                {user.coins + " 🪙"}
            </p>
            </div >
    );
}

export default ProfileNavButton