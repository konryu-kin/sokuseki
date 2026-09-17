import { useEffect } from "react";
import { getDisplayGroupedTasks } from "./data/tasks";
import TaskItem from "./components/timelineItems/tasks/taskItem";
import { loadContextTags, loadEvents, loadTasks } from "./data/loadData";
import { saveEvents, saveTasks } from "./data/saveData";
import { useTasksStore } from "./stores/useTasksStore";
import { useEventsStore } from "./stores/useEventsStore";
import { useContextTagsStore } from "./stores/useContextTagsStore";
import { getGroupedTimelineItems } from "./data/timelineItems";
import TimelineItem from "./components/timelineItems/timelineItem";

function App() {
  const tasks = useTasksStore((state) => state.tasks);
  const setTasks = useTasksStore((state) => state.setTasks);

  const events = useEventsStore((state) => state.events);
  const setEvents = useEventsStore((state) => state.setEvents);

  const setContextTags = useContextTagsStore((state) => state.setContextTags);

  useEffect(() => {
    setTasks(loadTasks());
    setEvents(loadEvents());
    setContextTags(loadContextTags());
  }, [setTasks, setEvents, setContextTags]);

  const groupedTimelineItems = getGroupedTimelineItems({ tasks, events });
  const groupedTasks = getDisplayGroupedTasks(tasks);

  const sections = [
    { title: "過去", dateGroups: groupedTimelineItems.past },
    { title: "今日", dateGroups: groupedTimelineItems.today },
    { title: "明日", dateGroups: groupedTimelineItems.tomorrow },
    { title: "未来", dateGroups: groupedTimelineItems.future },
  ];

  return (
    <main>
      {sections.map(({ title, dateGroups }) => (
        <section key={title}>
          <h2>{title}</h2>
          <div>
            {dateGroups.length === 0 ? (
              <p>なし</p>
            ) : (
              dateGroups.map(({ date, items }) => (
                <div key={date}>
                  <p>{date}</p>
                  {items.map((item) => (
                    <TimelineItem key={`${item.type}-${item.data.id}`} timelineItem={item} />
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
              //TODO: TimelineItemへの置き換え
              <TaskItem key={task.id} task={task} />
            ))
          )}
        </div>
      </section>
      <button
        onClick={() => {
          saveTasks(tasks);
          saveEvents(events);
        }}
      >
        保存する
      </button>
    </main>
  );
}

export default App;
