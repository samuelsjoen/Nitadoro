function toDoBlock({toDo, remove}) {
    function handleRemove() {
        remove(toDo);
    }
    return (
        <div className="toDoBlock">
            <p>{toDo.text}</p>
            <button onClick={handleRemove}>Remove to do</button>
        </div>
    )
}

export default toDoBlock;