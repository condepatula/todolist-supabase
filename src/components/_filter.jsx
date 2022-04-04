import { Box, Divider, RadioGroup, Radio } from "@mantine/core";
import { useTodolist } from "../context/todolist-context";

export const Filter = () => {
  const { filter, setFilter, todosFiltered } = useTodolist();

  return (
    <Box pb={20} pt={20}>
      <RadioGroup
        label="Select to-do list status"
        description={`${todosFiltered.length} To do list found`}
        value={filter}
        onChange={setFilter}
        size="sm"
        color="gray"
      >
        <Radio value="ALL" label="All" mr={10} />
        <Radio value="PENDING" label="Pending" mr={10} />
        <Radio value="DONE" label="Done" mr={10} />
      </RadioGroup>
      <Divider mt={10} />
    </Box>
  );
};
