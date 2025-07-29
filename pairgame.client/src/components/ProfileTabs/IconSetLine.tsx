import { useState } from "react";

type IconSetLineProps = {
    id: number;
    name: string;
    onRename: (id: number, newName: string) => void;
    onEdit: (id: number) => void;
};

export default function IconSetLine({ id, name, onRename, onEdit }: IconSetLineProps) {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(name);

    const handleRename = () => {
        if (newName.trim() && newName !== name) {
            onRename(id, newName);
        }
        setIsRenaming(false);
    };

    return (
        <div className="d-flex justify-content-between align-items-center border-bottom py-2 px-3">
            {isRenaming ? (
                <input
                    className="form-control me-3"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onBlur={handleRename}
                    onKeyDown={(e) => e.key === "Enter" && handleRename()}
                    autoFocus
                    style={{ maxWidth: "300px" }}
                />
            ) : (
                <span
                    className="me-3 flex-grow-1 text-truncate"
                    style={{ cursor: "pointer" }}
                    onDoubleClick={() => setIsRenaming(true)}
                >
                    {name}
                </span>
            )}
            <div className="btn-group">
                <button className="btn btn-sm btn-outline-primary" onClick={() => setIsRenaming(true)}>
                    Rename
                </button>
                <button className="btn btn-sm btn-outline-success" onClick={() => onEdit(id)}>
                    Edit
                </button>
            </div>
        </div>
    );
}