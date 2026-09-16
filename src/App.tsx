import { getDisplayGroupedTasks } from "./data/tasks";
import TaskItem from "./components/timelineItems/tasks/taskItem";
import { loadTasks } from "./data/loadData";
import { saveTasks } from "./data/saveData";
import { useTasksStore } from "./stores/useTasksStore";
function App() {
  const tasks = useTasksStore((state) => state.tasks);
  const setTasks = useTasksStore((state) => state.setTasks);
  setTasks(loadTasks())

  const groupedTasks = getDisplayGroupedTasks(tasks);

  const sections = [
    { title: "過去", items: groupedTasks.past },
    { title: "今日", items: groupedTasks.today },
    { title: "明日", items: groupedTasks.tomorrow },
    { title: "未来", items: groupedTasks.future },
  ];

  return (
    <main>
      {sections.map(({ title, items }) => (
        <section key={title}>
          <h2>{title}</h2>
          <div>
            {items.length === 0 ? (
              <p>なし</p>
            ) : (
              items.map(({ date, tasks: tasksForDate }) => (
                <div key={date}>
                  <p>{date}</p>
                  {tasksForDate.map((task) => (
                    <TaskItem
                      key={task.id}
                      task={task}
                    />
                  ))}
                </div>
              ))
            )}
          </div>
        </section>
      ))}

      <section>
        <h2>日付なし</h2>
        <div>
          {groupedTasks.undated.length === 0 ? (
            <p>なし</p>
          ) : (
            groupedTasks.undated.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
              />
            ))
          )}
        </div>
      </section>
      <button onClick={() => saveTasks(tasks)}>保存する</button>
    </main>
  );
}

export default App;
