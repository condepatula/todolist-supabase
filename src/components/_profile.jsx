import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Text,
  Box,
  Group,
  Divider,
  Image,
  TextInput,
  useMantineTheme,
  useMantineColorScheme,
  Avatar,
  ActionIcon,
  Input,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useFocusTrap } from "@mantine/hooks";
import { Camera, X } from "tabler-icons-react";
import profileLogo from "../assets/img/profile.png";
import { useUser } from "../context/user-context";

export const Profile = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const focusTrapRef = useFocusTrap();
  const navigate = useNavigate();
  const [publicURL, setPublicURL] = useState();
  const {
    user,
    account,
    isUpdatingProfile,
    isImageUploadLoading,
    handleUpdate,
    handleUploadImage,
    setProfileOpen,
  } = useUser();

  const form = useForm({
    initialValues: {
      username: "",
      email: "",
    },
    validate: {
      username: (value) =>
        value.length < 10 ? "Must be 10 or more characters" : null,
    },
  });

  useEffect(() => {
    if (!user) {
      navigate("/sigin");
    }
  }, [user, navigate]);

  /* eslint-disable */
  useEffect(() => {
    if (account) {
      setPublicURL(account.publicURL);
      form.setFieldValue("username", account.username);
      form.setFieldValue("email", account.email);
    }
  }, [account]);
  /* eslint-enable */

  return (
    <Box sx={{ height: "100vh" }}>
      <Group
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Group sx={{ display: "flex", alignItems: "center" }} spacing={5}>
          <Image src={profileLogo} width={40} />
          <Text weight={500} size="xl">
            Profile
          </Text>
        </Group>
        <ActionIcon
          onClick={() => {
            navigate("/");
            setProfileOpen(false);
          }}
        >
          <X />
        </ActionIcon>
      </Group>
      <Divider
        mb="xl"
        mt="sm"
        sx={{ borderColor: colorScheme === "dark" ? "" : theme.colors.gray[2] }}
      />
      <Box sx={{ maxWidth: "500px", margin: "auto" }} pl={10} pr={10}>
        <form
          ref={focusTrapRef}
          onSubmit={form.onSubmit((values) => handleUpdate(values))}
        >
          <Group position="center" mb="xl" sx={{ position: "relative" }}>
            <Avatar
              src={publicURL}
              alt="Avatar"
              sx={{
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                opacity: isImageUploadLoading ? "0.5" : "",
              }}
            />
            {isImageUploadLoading && (
              <Text
                size="xs"
                sx={{
                  position: "absolute",
                }}
              >
                Uploading...
              </Text>
            )}
            {!isImageUploadLoading && (
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
                  onChange={(e) => handleUploadImage(e)}
                />
              </ActionIcon>
            )}
          </Group>
          <TextInput
            data-autofocus
            required
            description="Username must be 10 or more characters"
            label="User Name"
            placeholder="Your User Name"
            {...form.getInputProps("username")}
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
            loading={isUpdatingProfile}
          >
            {isUpdatingProfile ? "Updating Profile" : "Save"}
          </Button>
        </form>
      </Box>
    </Box>
  );
};
