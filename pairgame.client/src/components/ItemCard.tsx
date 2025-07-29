import { useState } from "react";

export type ItemCardInfo = {
    id: string;
    value: string;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isGuessed: boolean;
    setIsGuessed: React.Dispatch<React.SetStateAction<boolean>>;
    setBgColor: React.Dispatch<React.SetStateAction<string>>;
};

type ItemCardProps = {
    id: string;
    value: string;
    src: string | null;
    onClick?: (info: ItemCardInfo) => void;
    initialOpen?: boolean;
    initialGuessed?: boolean;
    initialBgColor?: string;
    disabled?: boolean;
};

function ItemCard({
    id,
    value,
    src,
    onClick,
    initialOpen = false,
    initialGuessed = false,
    initialBgColor = "white",
    disabled = false,
}: ItemCardProps) {
    const [isOpen, setIsOpen] = useState(initialOpen);
    const [isGuessed, setIsGuessed] = useState(initialGuessed);
    const [bgColor, setBgColor] = useState(initialBgColor);

    function handleClick() {
        if (disabled) return;
        onClick?.({ id, value, isOpen, setIsOpen, isGuessed, setIsGuessed, setBgColor });
    }

    return (
        <div
            className="card text-center shadow-sm overflow-hidden"
            style={{
                width: "80px",
                height: "80px",
                cursor: disabled ? "not-allowed" : "pointer",
                backgroundColor: bgColor,
            }}
            onClick={handleClick}
        >
            <div className="card-body d-flex align-items-center justify-content-center p-0 overflow-hidden" style={{ width: "100%", height: "100%" }}>
                {isOpen || isGuessed ? (
                    src ? (
                        <img
                            src={src}
                            alt={value}
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                display: "block",
                            }}
                        />
                    ) : (
                        <span className="fw-bold" style={{ fontSize: "24px" }}>
                            {value}
                        </span>
                    )
                ) : (
                    <span className="fw-bold" style={{ fontSize: "24px" }}>
                        ?
                    </span>
                )}
            </div>
        </div>
    );
}

export default ItemCard;