import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import CustomGame from "../components/CustomGame";
import ErrorModal from "../components/ErrorModal";
import { SERVER_PATH } from "../constants";
import type { IconImage } from "../models/IconImage";

type IconSetOption = {
    name: string;
    count: number;
    vt: "v" | "i";
    icid: number;
};

const predefinedIconSets: IconSetOption[] = [
    { name: "Alphabet", count: 33, vt: "v", icid: 0 },
 
];
function Home() {
    const [iconSets, setIconSets] = useState<IconSetOption[]>(predefinedIconSets);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${SERVER_PATH}/api/icon/allIcons`)
            .then(res => res.json())
            .then((data: { id: number, name: string, images: IconImage[] }[]) => {
                const serverSets: IconSetOption[] = data.map(d => ({
                    name: d.name,
                    count: d.images.length,
                    vt: "i",
                    icid: d.id,
                }));
                setIconSets([...predefinedIconSets, ...serverSets]);
            })
            .catch(console.error);
    }, []);

    const startGame = (width: number, height: number) => {
        const iconSet = iconSets[selectedIndex];
        if ((width * height) % 2) {
            setError("Game size can't be odd!");
            return;
        }
        if ((width * height) >> 1 > iconSet.count) {
            setError("Icon set has not enough icons");
            return;
        }
        navigate(`/game?width=${width}&height=${height}&vt=${iconSet.vt}&icid=${iconSet.icid}`);
    };

    return (
        <>
            <div className="container py-4 text-center">
                <h2>Start new game!</h2>

                <div className="mb-4">
                    <label className="form-label fw-bold">Choose icon set:</label>
                    <select
                        className="form-select w-auto mx-auto"
                        value={selectedIndex}
                        onChange={(e) => setSelectedIndex(+e.target.value)}
                    >
                        {iconSets.map((set, idx) => (
                            <option key={idx} value={idx}>
                                {set.name} - {set.count} icons
                            </option>
                        ))}
                    </select>
                </div>

                <div className="d-flex flex-column align-items-center gap-3">
                    <button className="btn btn-primary w-50" onClick={() => startGame(2, 2)}>Small (2x2)</button>
                    <button className="btn btn-primary w-50" onClick={() => startGame(4, 3)}>Medium (4x3)</button>
                    <button className="btn btn-primary w-50" onClick={() => startGame(6, 4)}>Big (6x4)</button>
                    <CustomGame onStart={(w, h) => startGame(w, h)} />
                </div>
            </div>
            {error && <ErrorModal message={error} onClose={() => setError("")} />}
        </>
    );
}

export default Home;