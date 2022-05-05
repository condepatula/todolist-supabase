import { useState } from "react";
import {
  Box,
  Text,
  Group,
  UnstyledButton,
  useMantineColorScheme,
} from "@mantine/core";
import { Calendar as CalendarM } from "@mantine/dates";
import { Calendar as CalendarI, Plus, Minus } from "tabler-icons-react";
import moment from "moment";
import { useTodolist } from "../context/todolist-context";
import { useMediaQuery } from "@mantine/hooks";

export const Calendar = () => {
  const isMobile = useMediaQuery("(max-width: 755px)");
  const { setDateFilter, getColorDay } = useTodolist();
  const [value, setValue] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const { colorScheme } = useMantineColorScheme();

  return (
    <Box mb="sm">
      <UnstyledButton onClick={() => setVisible((prev) => !prev)}>
        <Group mb="sm" spacing={5}>
          <CalendarI size={18} />
          <Text size="md" weight={500} mr="xs">
            {moment(value).format("DD/MM/yyyy") ===
            moment(new Date()).format("DD/MM/yyyy")
              ? "Today"
              : moment(value).format("DD/MM/yyyy") ===
                moment(new Date()).add(1, "d").format("DD/MM/yyyy")
              ? "Morning"
              : moment(value).format("dddd MMM D")}
          </Text>
          {visible ? <Minus size={12} /> : <Plus size={12} />}
        </Group>
      </UnstyledButton>
      {visible && (
        <CalendarM
          value={value}
          onChange={(date) => {
            setValue(date);
            setVisible(false);
            setDateFilter(date);
          }}
          size="xs"
          fullWidth="true"
          styles={(theme) => ({
            weekday: {
              borderRadius: 0,
              width: "40px",
              height: "40px",
              marginLeft: !isMobile ? "50px" : null,
            },
            day: {
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              marginLeft: !isMobile ? "50px" : null,
              padding: 0,
            },
          })}
          dayStyle={(date) =>
            getColorDay(date) &&
            moment(date).format("DD/MM/yyyy") !==
              moment(value).format("DD/MM/yyyy")
              ? {
                  backgroundColor: `${getColorDay(date)}`,
                  color:
                    colorScheme === "dark"
                      ? moment(new Date()).format("DD/MM/yyyy") !==
                        moment(date).format("DD/MM/yyyy")
                        ? "black"
                        : "white"
                      : moment(new Date()).format("DD/MM/yyyy") ===
                        moment(date).format("DD/MM/yyyy")
                      ? "white"
                      : null,
                }
              : null
          }
        />
      )}
    </Box>
  );
};
