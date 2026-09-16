import { getGroupedTasks } from "./data/tasks";
import TaskItem from "./components/taskItem";

function App() {
  const groupedTasks = getGroupedTasks();

  return (
    <main>
      <section>
        <h2>過去</h2>
        <div>
          {groupedTasks.past.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </section>

      <section>
        <h2>今日</h2>
        <div>
          {groupedTasks.today.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </section>

      <section>
        <h2>明日</h2>
        <div>
          {groupedTasks.tomorrow.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </section>

      <section>
        <h2>未来</h2>
        <div>
          {groupedTasks.future.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </section>

      <section>
        <h2>いつか</h2>
        <div>
          {groupedTasks.undated.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
