import { useEffect, useState } from "react";
import Board, { type gameFinishInfo } from "../components/Board";
import { ValueProvider } from "../valueProvider";
import { SERVER_PATH } from "../constants";
import { generateUniqueRandomNumbers } from "../util/math";

const DEFAULT_HEIGHT = 4;
const DEFAULT_WIDTH = 4;
const DEFAULT_VTYPE = "v";
const DEFAULT_ICON_SET_ID = 0;

function Game() {
    const height = +new URLSearchParams(window.location.search).get("height")! || DEFAULT_HEIGHT;
    const width = +new URLSearchParams(window.location.search).get("width")! || DEFAULT_WIDTH;
    const vtype = new URLSearchParams(window.location.search).get("vt") || DEFAULT_VTYPE;
    const iconSetid = +new URLSearchParams(window.location.search).get("icid")! || DEFAULT_ICON_SET_ID;

    const [src, setSrc] = useState<string[] | null>(null);
    const [values, setValues] = useState<string[]>(["a"]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (vtype === "v") {
            let val = ValueProvider[iconSetid];
            if (val == null) val = ValueProvider[DEFAULT_ICON_SET_ID];
            setValues(val.split("").slice(0, (height * width) / 2 >> 0));
           
            setSrc(null);
            setLoading(false);
        } else if (vtype === "i") {
            setLoading(true);
            fetch(`${SERVER_PATH}/api/icon/${iconSetid}`)
                .then((res) => {
                    if (!res.ok) throw new Error("Failed to fetch icon set");
                    return res.json();
                })
                .then((data) => {
                    const paths = data.images
                        .map((img: { filePath: string }) => SERVER_PATH + img.filePath)
                        .slice(0, (height * width) / 2 >> 0);
                    setSrc(paths);
                    const len = paths.length;
                    setValues(generateUniqueRandomNumbers(len).map((a) => a.toString()));
                    setLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setSrc(null);
                    setLoading(false);
                });
        }
    }, [vtype, iconSetid, height, width]);

    function handleFinish(i: gameFinishInfo) {
        console.log(i);
    }

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Board onFinish={handleFinish} height={height} width={width} values={values} src={src} />
    );
}

export default Game;
