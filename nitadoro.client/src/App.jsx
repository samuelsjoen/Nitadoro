import './App.css';
import NitadoroTimer from './nitadoro/nitadoroTimer/NitadoroTimer';
import ToDoBoard from './nitadoro/toDo/ToDoBoard';

function App() {
    return (
        <div className="app">
            <NitadoroTimer />
            <ToDoBoard />
        </div>
    )
}

export default App;