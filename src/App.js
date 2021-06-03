import { useState, useRef, useEffect } from "react";
import BtnComponent from "./BtnComponent";
import "./App.css";

function App() {
    const [time, setTime] = useState({ ms: 0, s: 0, m: 0, h: 0 });
    const [interv, setInterv] = useState();
    const [status, setStatus] = useState(0);
    const [list, setList] = useState([]);
    const [checkboxlist, setCheckboxlist] = useState([]);
    const [isShiftDown, setIsShiftDown] = useState(false);
    const [lastSelectedItem, setLastSelectItem] = useState(null);
    const [selectedItems, setSelectedItems] = useState([]);
    const listRef = useRef(null);

    useEffect(() => {
        const onKeyDown = ({ key }) => {
            if (key === "Shift") {
                setIsShiftDown(true);
                console.log("Shift down");
            }
        };

        const onKeyUp = ({ key }) => {
            if (key === "Shift") {
                setIsShiftDown(false);
                console.log("Shift up");
            }
        };

        document.addEventListener("keydown", onKeyDown);
        document.addEventListener("keyup", onKeyUp);

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.removeEventListener("keyup", onKeyUp);
        };
    }, []);
    useEffect(() => {
        if (list.length !== 0) {
            listRef.current.addEventListener(
                "selectstart",
                handleSelectStart,
                false
            );

             return () => {
                listRef?.current?.removeEventListener(
                    "selectstart",
                    handleSelectStart,
                    false
                );
        };
        }
       
    }, [list]);
    const handleSelectItem = (e) => {
        const { value } = e.target;
        const nextValue = getNextValue(value);
        setSelectedItems(nextValue);
        setLastSelectItem(value);
    };

    const getNextValue = (value) => {
        const hasBeenSelected = !selectedItems.includes(value);

        if (isShiftDown) {
            const newSelectedItems = getNewSelectedItems(value);

            const selections = [
                ...new Set([...selectedItems, ...newSelectedItems]),
            ];

            if (!hasBeenSelected) {
                return selections.filter(
                    (item) => !newSelectedItems.includes(item)
                );
            }

            return selections;
        }

        return selectedItems.includes(value)
            ? selectedItems.filter((item) => item !== value)
            : [...selectedItems, value];
    };
    const getNewSelectedItems = (value) => {
        const currentSelectedIndex = checkboxlist.findIndex(
            (item) => item.id === value
        );
        const lastSelectedIndex = checkboxlist.findIndex(
            (item) => item.id === lastSelectedItem
        );

        return checkboxlist
            .slice(
                Math.min(lastSelectedIndex, currentSelectedIndex),
                Math.max(lastSelectedIndex, currentSelectedIndex) + 1
            )
            .map((item) => item.id);
    };
    const handleSelectStart = (e) => {
        if (isShiftDown) {
            e.preventDefault();
        }
    };

    const start = () => {
        run();
        setStatus(1);
        setInterv(setInterval(run, 10));
    };

    var updatedMs = time.ms,
        updatedS = time.s,
        updatedM = time.m,
        updatedH = time.h;

    const run = () => {
        if (updatedM === 60) {
            updatedH++;
            updatedM = 0;
        }
        if (updatedS === 60) {
            updatedM++;
            updatedS = 0;
        }
        if (updatedMs === 100) {
            updatedS++;
            updatedMs = 0;
        }
        updatedMs++;
        return setTime({
            ms: updatedMs,
            s: updatedS,
            m: updatedM,
            h: updatedH,
        });
    };

    const stop = () => {
        clearInterval(interv);
        setStatus(2);
        setList((a) => [...a, { ...time }]);
        setCheckboxlist((a) => [
            ...a,
            {
                label: `Item ${list.length + 1}`,
                id: `value-${list.length + 1}`,
            },
        ]);
    };

    const reset = () => {
        clearInterval(interv);
        setStatus(0);
        setTime({ ms: 0, s: 0, m: 0, h: 0 });
        setList([]);
    };

    const resume = () => start();

    const h = () => {
        if (time.h === 0) {
            return "";
        } else {
            return <span>{time.h >= 10 ? time.h : "0" + time.h}</span>;
        }
    };

    return (
        <div>
            <div className="main-section">
                <div className="clock-holder">
                    <div className="stopwatch">
                        <div>
                            {h()}&nbsp;&nbsp;
                            <span>{time.m >= 10 ? time.m : "0" + time.m}</span>
                            &nbsp;:&nbsp;
                            <span>{time.s >= 10 ? time.s : "0" + time.s}</span>
                            &nbsp;:&nbsp;
                            <span>
                                {time.ms >= 10 ? time.ms : "0" + time.ms}
                            </span>
                        </div>
                        <BtnComponent
                            status={status}
                            resume={resume}
                            reset={reset}
                            stop={stop}
                            start={start}
                        />
                    </div>

                    {list.length !== 0 ? (
                        <table
                            style={{ padding: 15, margin: "auto" }}
                            ref={listRef}
                        >
                            <tr>
                                <th>No.</th>
                                <th>Hour</th>
                                <th>Minute</th>
                                <th>Second</th>
                                <th>ms</th>
                                <th></th>
                            </tr>
                            {list.map((item, index) => {
                                const { id } = checkboxlist[index];
                                return (
                                    <tr>
                                        <td>{index + 1}</td>
                                        <td>{item.h} </td>
                                        <td>{item.m} </td>
                                        <td>{item.s} </td>
                                        <td>{item.ms} </td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                value={id}
                                                id={`Item-${id}`}
                                                onChange={handleSelectItem}
                                                checked={selectedItems.includes(
                                                    id
                                                )}
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </table>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default App;
