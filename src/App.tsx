import { getTasks } from "./data/tasks";
import TaskItem from "./components/taskItem";

function App() {
  const displayItem = getTasks()
  return (
    <main>
      {displayItem.map((x)=>TaskItem(x))}
    </main>
  );
}

export default App;
