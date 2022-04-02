import { Box, Divider, RadioGroup, Radio } from "@mantine/core";
import { useTodolist } from "../context/todolist-context";

export const Filter = () => {
  const { filter, setFilter, todosFiltered } = useTodolist();

  return (
    <Box pt={20}>
      <RadioGroup
        label="Select to-do list status"
        description={`${todosFiltered.length} To do list found`}
        value={filter}
        onChange={setFilter}
        size="sm"
        spacing={10}
        color="gray"
      >
        <Radio value="ALL" label="All" />
        <Radio value="PENDING" label="Pending" />
        <Radio value="DONE" label="Done" />
      </RadioGroup>
      <Divider mt={10} />
    </Box>
  );
};
