import { Button } from "../Button/Button"

interface CounterRowProps {
    setTimesFinished: React.Dispatch<React.SetStateAction<number>>;
    timesFinished: number;
}

export const CounterRow = ({ setTimesFinished, timesFinished }: CounterRowProps) => {

    return (
        <div style={{display: "flex", alignItems: "center", gap: "10px"}}>
            <Button
            variant="secondary"
            onClick={() => setTimesFinished((v) => Math.max(0, v - 1))}
            >
            -
            </Button>
            <span>Zerei {timesFinished} vezes</span>
            <Button
            variant="secondary"
            onClick={() => setTimesFinished((v) => v + 1)}
            >
            +
            </Button>
        </div>
    )
}