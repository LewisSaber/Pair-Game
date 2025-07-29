import { useContext, useEffect, useState } from "react";
import IconSetLine from "./IconSetLine";
import { AuthContext } from "../../contexts";
import type { IconSet } from "../../models/IconSet";
import { authFetch } from "../../util/auth";
import { useNavigate } from "react-router";
import { SERVER_PATH } from "../../constants";

function IconSetsTab() {
    const { user } = useContext(AuthContext);
    const [iconSets, setIconSets] = useState<IconSet[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.id) {
            authFetch(`${SERVER_PATH}/api/icon/allUser`)
                .then(res => res.json())
                .then(data => setIconSets(data));
        }
    }, [user]);

    const createNewSet = async () => {
        const res = await authFetch(`${SERVER_PATH}/api/icon/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify("unnamed")
        });
        const newSet = await res.json();
        setIconSets(prev => [...prev, newSet]);
    };

    const handleRename = async (id: number, newName: string) => {
        await authFetch(`${SERVER_PATH}/api/icon/rename`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, newName }),
        });
        setIconSets(prev =>
            prev.map(set => (set.id === id ? { ...set, name: newName } : set))
        );
    };

    const handleEdit = (id: number) => {
        navigate(`/editIconSet?id=${id}`);
    };

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0">Your Icon Sets</h3>
                <button className="btn btn-primary" onClick={createNewSet}>
                    + New Icon Set
                </button>
            </div>

            <div className="list-group shadow-sm">
                {iconSets.map(set => (
                    <div key={set.id} className="list-group-item">
                        <IconSetLine
                            id={set.id}
                            name={set.name}
                            onRename={handleRename}
                            onEdit={handleEdit}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default IconSetsTab;
