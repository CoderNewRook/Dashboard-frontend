import { useEffect, useState } from "react";
import { ITaskData } from "./App";
import plus from "./Assets/Plus_button_small.png";

const Tasks = (props: {username: string, tasks: ITaskData[], setTasks: React.Dispatch<React.SetStateAction<ITaskData[]>>, back: JSX.Element}) => {
    // const [tasks, setTasks] = useState<ITaskData[]>([]);

    useEffect(() => {
        // props.setTasks(props.tasks);
        // window.setInterval(saveTasks, 2500);
        return () => {
            console.log("Saving tasks");
            saveTasks();
        }
    }, [])

    const addTask = () => {
        const task = {task: "", completed: false};
        props.setTasks([...props.tasks, task])
        fetch(`http://localhost:3000/task/${props.username}`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({...task, id: props.tasks.length})
        })
        .then(res => {
            console.log(res);
        })
        .catch(error => console.log("there was an error " + error))
    }

    // const updateTaskDescription = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    //     const nextTasks = [...tasks];
    //     nextTasks[index].task = 
    // }

    const saveTasks = () => {
        // const task = {task: "", completed: false};
        // setTasks([...tasks, task])
        fetch(`http://localhost:3000/tasks/${props.username}`, {
            method: "PUT",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({tasks : props.tasks.map((task, i) => ({task: task.task, completed: task.completed, id: i}))})
        })
        .then(res => {
            console.log(res);
        })
        .catch(error => console.log("there was an error " + error))
    }

    const tasksDisplay = props.tasks.map((task, i) => 
    <div className="task" key={`task${i}`}>
        <input type="text" value={task.task} onChange={e => {
            const nextTasks = [...props.tasks];
            nextTasks[i].task = e.target.value;
            props.setTasks([...nextTasks]);
        }}/>
        <input type="checkbox" className="taskCheckbox" checked={task.completed} onClick={() => {
            const nextTasks = [...props.tasks];
            nextTasks[i].completed = !task.completed;
            props.setTasks([...nextTasks]);
        }}/>
    </div>
    )

    return (
    <div className="module">
        <div className="tasksModule">
            <h1 className="topLeftTitle">Tasks</h1>
            <div className="tasks">
                {tasksDisplay}
                <img className="smallPlus" onClick={addTask} src={plus} alt="Add task" />
            </div>
        </div>
        {/* <div className="back" onClick={props.back}>Back</div> */}
        {props.back}
    </div>
    );
};

export default Tasks;
