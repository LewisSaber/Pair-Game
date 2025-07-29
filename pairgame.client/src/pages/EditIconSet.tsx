import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../contexts";
import { useNavigate } from "react-router";
import type { IconSet } from "../models/IconSet";
import { SERVER_PATH } from "../constants";
import { authFetch } from "../util/auth";
import ItemCard from "../components/ItemCard";

function EditIconSet() {
    const iconSetID = +new URLSearchParams(window.location.search).get("id")!;
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [iconSet, setIconSet] = useState<IconSet | null>(null);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch(`${SERVER_PATH}/api/icon/${iconSetID}`)
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch icon set");
                return res.json();
            })
            .then((data) => setIconSet(data));
    }, [iconSetID, navigate, user]);

    if (!iconSet) return <p>Loading...</p>;

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;
        const file = e.target.files[0];

        setUploading(true);
        const formData = new FormData();
        formData.append("image", file);
        formData.append("iconSetId", iconSetID.toString());

        try {
            const res = await authFetch(`${SERVER_PATH}/api/icon/addImage`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Upload failed");

            const newImage = await res.json();

            setIconSet((prev) =>
                prev ? { ...prev, images: [...prev.images, newImage] } : prev
            );
        } catch (err) {
            console.error(err);
            alert("Failed to upload image");
        }

        setUploading(false);
    };

    const handleUploadClick = () => {
        if (!uploading) fileInputRef.current?.click();
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-semibold">Editing {iconSet.name}</h1>

            <div className="row g-3 mt-4">
                {iconSet.images.map((img) => (
                    <div className="col-auto" key={img.id}>
                        <ItemCard
                            id={img.id.toString()}
                            value={img.filePath}
                            src={SERVER_PATH + img.filePath}
                            initialOpen={true}
                            disabled={true}
                        />
                    </div>
                ))}

                <div className="col-auto" onClick={handleUploadClick}>
                    <ItemCard
                        id="upload"
                        value="+"
                        src={null}
                        initialOpen={true}
                        disabled={uploading}
                    />
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="d-none"
                    disabled={uploading}
                    onChange={handleFileChange}
                />
            </div>
        </div>
    );
}

export default EditIconSet;
