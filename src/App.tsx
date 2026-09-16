import { getDisplayGroupedTasks } from "./data/tasks";
import TaskItem from "./components/taskItem";

function App() {
  const groupedTasks = getDisplayGroupedTasks();

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
              items.map(({ date, tasks }) => (
                <div key={date}>
                  <p>{date}</p>
                  {tasks.map((task) => (
                    <TaskItem key={task.id} task={task} />
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
              <TaskItem key={task.id} task={task} />
            ))
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
