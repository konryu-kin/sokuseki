import type { Task } from "../types/task"

export default function TaskItem(task: Task){
    const {description} = task.content
    return(
    <div>
        <p>{task.id}</p>
        {description && <p>{description}</p>}
    </div>
    )
}