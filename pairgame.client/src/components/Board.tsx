import {  useRef, useState } from "react";
import { randomizeValues } from "../util/math";
import ItemCard, { type ItemCardInfo } from "./ItemCard";
import { Button, Modal } from "react-bootstrap";
import { formatTime } from "../util/util";

type BoardProps = {
    width: number;
    height: number;
    values: string[];
    src: string[] | null;
    onFinish: ( i : gameFinishInfo) => void
};
type cardInfo = {
    value: string ;
    src: string | null;

};


export type gameFinishInfo = {
    timeSpent: number
}
function Board({ width, height, values, onFinish, src }: BoardProps) {
  
    const [showModal, setShowModal] = useState(false);
    const [resetCounter, setResetCounter] = useState(0);
    const startTime = useRef(Date.now())
    const timeSpent = useRef(0)
  
    const [randomizedValues, setRandomizedValues] = useState(() => randomizeGame()
    
    );

   
    const board: cardInfo[][] = [];
    for (let i = 0; i < height; i++) {
        const row: cardInfo[] = [];
        for (let j = 0; j < width; j++) {
            row.push({
                ...randomizedValues[i * width + j]
               
            });
        }
        board.push(row);
    }
    console.log({board})
    const openedCard1 = useRef<ItemCardInfo | null>(null);
    const openedCard2 = useRef<ItemCardInfo | null>(null);
    const guessedCount = useRef<number>(0);

    function randomizeGame() {
        const mapped = values.map((v, i) => { return { value: v, src: (src ? src[i] : null) } })
        console.log(mapped,values)
        return randomizeValues(mapped) as cardInfo[]
    }
    function resetGame() {
        setShowModal(false);
        guessedCount.current = 0;
        setResetCounter(resetCounter+1)
        setRandomizedValues(randomizeGame())
        
    }

   

    function endGame() {
        timeSpent.current = Date.now() - startTime.current 
        onFinish({ timeSpent:timeSpent.current })
        setShowModal(true);
    }

    function handleClick(card: ItemCardInfo) {
        console.log(card.value);
        if (card.isGuessed || card.isOpen) return;

        if (openedCard1.current && openedCard2.current) {
            console.log("cleaning");
            openedCard1.current.setIsOpen(false);
            openedCard2.current.setIsOpen(false);
            openedCard1.current.setBgColor("white");
            openedCard2.current.setBgColor("white");
            openedCard1.current = null;
            openedCard2.current = null;
        }

        if (!openedCard1.current) {
            openedCard1.current = card;
            card.setIsOpen(true);
            return;
        }

        openedCard2.current = card;
        card.setIsOpen(true);

        if (openedCard1.current.value === card.value) {
            openedCard1.current.setIsGuessed(true);
            card.setIsGuessed(true);
            openedCard1.current.setBgColor("lime");
            card.setBgColor("lime");
            openedCard1.current = null;
            openedCard2.current = null;
            console.log("match");
            guessedCount.current += 2;
            if (guessedCount.current === width * height) {
                endGame();
            }
            return;
        }

        openedCard1.current.setBgColor("red");
        card.setBgColor("red");
        console.log("mismatch");
    }

    return (
        <>
            <div className="container py-4">
                {board.map((row, i) => (
                    <div key={i} className="d-flex justify-content-center mb-2 gap-2">
                        {row.map((card, j) => (
                            <ItemCard
                                key={`${i}-${j}-${resetCounter}`}
                                value={card.value}
                                onClick={handleClick}
                                id={`${i}-${j}`}
                                src={card.src }
                            />
                        ))}
                    </div>
                ))}
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Game Over</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Congratulations! You finished the game!</p>
                    <p>Time spent: {formatTime(timeSpent.current)}</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={resetGame}>
                        Play Again
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default Board;
