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
import { useFocusTrap, useOs } from "@mantine/hooks";
import { supabase } from "../api/client";
import Resizer from "react-image-file-resizer";
import { Camera, X } from "tabler-icons-react";
import profileLogo from "../assets/img/profile.png";

export const Profile = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  const focusTrapRef = useFocusTrap();
  const navigate = useNavigate();
  const os = useOs();

  const [avatarUrl, setAvatarUrl] = useState();
  const [publicURL, setPublicURL] = useState("");
  const [loading, setLoading] = useState(true);
  const [isImageUploadLoading, setIsImageUploadLoading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const user = supabase.auth.user();

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
    if (user) {
      setLoading(true);
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .then((response) => {
          setAvatarUrl(response.data[0].avatar_url);
          form.setFieldValue("username", response.data[0].username);
          form.setFieldValue("email", user.email);
          if (response.data[0].avatar_url) {
            const { data } = supabase.storage
              .from("avatars")
              .getPublicUrl(response.data[0].avatar_url);
            if (data.publicURL) {
              setPublicURL(data.publicURL);
            }
          }
          setLoading(false);
        });
    }
  }, [user]);
  /* eslint-enable */

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        500,
        500,
        file.type.split("/")[1],
        100,
        os === "ios" ? 90 : 0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });

  const handleUploadImage = async (e) => {
    setIsImageUploadLoading(true);
    let file = await resizeFile(e.target.files[0]);
    let format = file.type.split("/")[1];
    let fileName = `${Date.now()}.${format}`;
    const userId = user.id;
    if (avatarUrl && file) {
      const { errorRemoveFile } = await supabase.storage
        .from("avatars")
        .remove([avatarUrl]);
      if (errorRemoveFile) {
        console.log("errorRemoveFile", errorRemoveFile);
        setIsImageUploadLoading(false);
        return;
      }
      const { errorUploadFile } = await supabase.storage
        .from("avatars")
        .upload(`public/${fileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (errorUploadFile) {
        setIsImageUploadLoading(false);
        console.log("errorUploadFile", errorUploadFile);
        return;
      }
      await supabase
        .from("profiles")
        .update({ avatar_url: `public/${fileName}`, updated_at: new Date() })
        .eq("id", userId);
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(`public/${fileName}`);
      if (data.publicURL) {
        setPublicURL(data.publicURL);
      }
      setAvatarUrl(`public/${fileName}`);
      setIsImageUploadLoading(false);
    } else {
      const { error } = await supabase.storage
        .from("avatars")
        .upload(`public/${fileName}`, file, {
          cacheControl: "3600",
          upsert: false,
        });
      if (error) {
        setIsImageUploadLoading(false);
        console.log("Error", error);
        return;
      }
      await supabase
        .from("profiles")
        .update({ avatar_url: `public/${fileName}` })
        .eq("id", userId);
      setAvatarUrl(`public/${fileName}`);
      setIsImageUploadLoading(false);
    }
  };

  const handleUpdate = async (update) => {
    setIsUpdatingProfile(true);
    const userId = user.id;
    const { error: errorUpdateProfile } = await supabase
      .from("profiles")
      .update({ username: update.username })
      .eq("id", userId);
    if (errorUpdateProfile) {
      console.log("errorUpdateProfile", errorUpdateProfile);
      setIsUpdatingProfile(false);
      return;
    }
    setIsUpdatingProfile(false);
  };

  if (loading) {
    return (
      <Box sx={{ height: "100vh" }}>
        <Text size="sm">Loading Profile...</Text>
      </Box>
    );
  }

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
        <ActionIcon onClick={() => navigate("/")}>
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
