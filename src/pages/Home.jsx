import { Filter } from "../components/_filter";
import { FormTodo } from "../components/_formTodo";
import { TodoList } from "../components/_todoList";

export const Home = () => {
  return (
    <>
      <FormTodo />
      <Filter />
      <TodoList />
    </>
  );
};
