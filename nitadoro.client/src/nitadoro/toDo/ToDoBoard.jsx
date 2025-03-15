import { useEffect, useState } from 'react';
import ToDoBlock from "./ToDoBlock"

function toDoBoard() {
    const [toDos, setToDos] = useState(() => {
        const prevToDos = localStorage.getItem("toDoBoard");
        return prevToDos ? JSON.parse(prevToDos) : [];
        
    });
    const [input, setInput] = useState("");

    useEffect(() => {
        localStorage.setItem("toDoBoard", JSON.stringify(toDos));
    }, [toDos]);

    useEffect(() => {
        const prevToDos = localStorage.getItem("toDoBoard");
        if (prevToDos) {
            setToDos(JSON.parse(prevToDos));
        }
    }, []);

    function addNewToDo() {
        if (input !== "") {
            const toDo = {
                id: crypto.randomUUID(),
                text: input
            };
            setInput("");
            setToDos([...toDos, toDo])
        } else {
            console.log("Unable to add new to do. Input field is empty.")
        }
    }

    function removeToDo(toDo) {
        const newToDos = [];
        for (let i = 0; i < toDos.length; i++) {
            if (toDos[i] !== toDo) {
                newToDos.push(toDos[i]);
            }
        }
        setToDos(newToDos);
    }

    const handleChange = (e) => {
        const text = e.target.value;
        setInput(text);
    }

    return (
        <div className="toDoBoard">
            <input
                type="text"
                id="toDo"
                value={input}
                onChange={handleChange}
                required
            />
            <button onClick={addNewToDo}>Add to do</button>
            {toDos.map(toDo => (
                <ToDoBlock
                    key={toDo.id}
                    toDo={toDo}
                    remove={removeToDo}
                />
            ))}
        </div>
    )
}

export default toDoBoard;