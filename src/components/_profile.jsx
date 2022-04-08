import { useEffect } from "react";
import {
  Button,
  Text,
  Box,
  Group,
  Divider,
  Image,
  TextInput,
  PasswordInput,
  useMantineTheme,
  useMantineColorScheme,
  Avatar,
  ActionIcon,
  Input,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useFocusTrap } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/client";
import { useTodolist } from "../context/todolist-context";
import { Camera } from "tabler-icons-react";
import profileLogo from "../assets/img/profile.png";

export const Profile = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const focusTrapRef = useFocusTrap();
  const [loading, setLoading] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);
  const { user, getUserProfile } = useTodolist();

  const form = useForm({
    initialValues: {
      username: " ",
      firstname: " ",
      email: " ",
    },
  });

  useEffect(() => {
    if (user) {
      form.setFieldValue("username", user.name);
      form.setFieldValue(
        "firstname",
        user.firstname === undefined ? " " : user.firstname
      );
      form.setFieldValue("email", user.email);
    }
  }, [user]);

  const updateProfile = async (payload) => {
    console.log("Payload", payload);
    try {
      const { error } = await supabase
        .from("profiles")
        .update(payload)
        .match({ id: user.id });

      if (error) throw error;
    } catch (error) {
      console.log("Update Profile", error);
    }
  };

  const uploadPhoto = async (e) => {
    try {
      let file = e.target.files[0];
      let format = file.type.split("/")[1];

      if (user.avatarUrl) {
        console.log("Updating avatar...", user.avatarUrl);
        const { data, error } = await supabase.storage
          .from("public")
          .update(`${user.avatarUrl}`, file, {
            cacheControl: "3600",
            upsert: false,
          });
        if (error) {
          console.log("Updating Error", error);
        }
        if (data) {
          console.log("Updating profile cleaning avatar_url...", data);
          updateProfile({ avatar_url: null });
        }
      } else {
        if (file) {
          console.log("Uploading photo...");
          const { data, error } = await supabase.storage
            .from("public")
            .upload(`${Date.now()}.${format}`, file, {
              cacheControl: "3600",
              upsert: false,
            });

          if (error) throw error;
          if (data) {
            updateProfile({ avatar_url: `${data.Key}` });
            getUserProfile(user);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ height: "100vh" }}>
      <Group sx={{ display: "flex", alignItems: "center" }} spacing={5}>
        <Image src={profileLogo} width={40} />
        <Text weight={500} size="xl">
          Profile
        </Text>
      </Group>
      <Divider
        mb="xl"
        mt="sm"
        sx={{ borderColor: colorScheme === "dark" ? "" : theme.colors.gray[2] }}
      />
      <Box sx={{ maxWidth: "500px", margin: "auto" }} pl={10} pr={10}>
        <form
          ref={focusTrapRef}
          onSubmit={form.onSubmit((values) => console.log(values))}
        >
          <Group position="center" mb="xl" sx={{ position: "relative" }}>
            <Avatar
              src={
                user &&
                `https://gyuabmfrblnjhdnvsdof.supabase.co/storage/v1/object/public/${user.avatarUrl}`
              }
              alt="Avatar"
              sx={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
              }}
            />
            <ActionIcon
              sx={{
                position: "absolute",
                bottom: "5px",
                borderRadius: "50%",
                backgroundColor: "white",
              }}
            >
              <Camera color="gray" />
              <Input
                type="file"
                accept="image/*"
                sx={{
                  position: "absolute",
                  opacity: "0",
                }}
                onChange={(e) => uploadPhoto(e)}
              />
            </ActionIcon>
          </Group>
          <TextInput
            disabled
            data-autofocus
            required
            description="Username must be 10 or more characters"
            label="Username"
            placeholder="Your username"
            {...form.getInputProps("username")}
          />
          <TextInput
            disabled
            data-autofocus
            required
            label="First name"
            placeholder="Your first name"
            {...form.getInputProps("firstname")}
          />
          <TextInput
            disabled
            mt="sm"
            required
            label="Email"
            placeholder="your@email.com"
            {...form.getInputProps("email")}
          />

          <Button
            fullWidth
            mt={30}
            color="teal"
            size="md"
            type="submit"
            loading={loading}
          >
            {loading ? "Updating..." : "Edit"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};
