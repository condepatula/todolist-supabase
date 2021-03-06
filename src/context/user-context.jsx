import { createContext, useContext, useState, useEffect } from "react";
import { showNotification } from "@mantine/notifications";
import { useOs } from "@mantine/hooks";
import { X, Check } from "tabler-icons-react";
import { supabase } from "../api/client";
import { resizeFile } from "../helpers/utils";
import { EMAIL_NOT_CONFIRMED } from "../helpers/messages";

const UserContext = createContext();

export function UserProvider(props) {
  const os = useOs();
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isImageUploadLoading, setIsImageUploadLoading] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const user = supabase.auth.user();
    if (user) {
      setUser(user);
      getProfile(user);
    }
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          getProfile(session.user);
        }
      }
    );
    return () => {
      authListener.unsubscribe();
    };
  }, []);

  const signUp = async (data, navigate) => {
    try {
      setLoading(true);
      const { user, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      if (error) {
        setLoading(false);
        console.log("signUp", error);
        return;
      }
      createProfile(user, data, navigate);
    } catch (error) {
      showNotification({
        message: error.message,
        icon: <X />,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const createProfile = async (user, data, navigate) => {
    try {
      const { error } = await supabase.from("profiles").insert({
        id: user.id,
        updated_at: new Date(),
        username: data.username,
      });
      if (error) {
        setLoading(false);
        console.log("createProfile", error);
        return;
      }
      showNotification({
        message: "Account has created!",
        icon: <Check />,
        color: "teal",
      });
      if (user?.hasOwnProperty("confirmation_sent_at")) {
        navigate("/information");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const logIn = async (data, navigate) => {
    try {
      setLoading(true);
      const { user, error } = await supabase.auth.signIn({
        email: data.email,
        password: data.password,
      });
      if (error) {
        showNotification({
          message: error.message,
          icon: <X />,
          color: "red",
        });
        setLoading(false);
        if (error.message === EMAIL_NOT_CONFIRMED) {
          navigate("/");
        }
        return;
      }
      setUser(user);
      getProfile(user);
      navigate("/");
    } catch (error) {
      showNotification({
        message: error.message,
        icon: <X />,
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const logOut = async (navigate) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setAccount(null);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const getProfile = (user) => {
    let atribute = {};
    supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .then((response) => {
        atribute.avatarURL = response.data[0].avatar_url;
        atribute.username = response.data[0].username;
        atribute.email = user.email;
        if (response.data[0].avatar_url) {
          const { data } = supabase.storage
            .from("avatars")
            .getPublicUrl(response.data[0].avatar_url);
          if (data.publicURL) {
            atribute.publicURL = data.publicURL;
          }
        }
        setAccount({
          username: atribute.username,
          email: atribute.email,
          avatarURL: atribute.avatarURL,
          publicURL: atribute.publicURL,
        });
      });
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
    setAccount((prev) => ({ ...prev, username: update.username }));
    setIsUpdatingProfile(false);
    showNotification({
      message: "Profile was updated!",
      icon: <Check />,
      color: "teal",
    });
  };

  const handleUploadImage = async (e) => {
    setIsImageUploadLoading(true);
    let file = await resizeFile(e.target.files[0], os);
    let format = file.type.split("/")[1];
    let fileName = `${Date.now()}.${format}`;
    let atribute = {};
    const userId = user.id;
    if (account.avatarURL && file) {
      const { errorRemoveFile } = await supabase.storage
        .from("avatars")
        .remove([account.avatarURL]);
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
        atribute.publicURL = data.publicURL;
      }
      atribute.avatarURL = `public/${fileName}`;
      setAccount((prev) => ({
        ...prev,
        publicURL: atribute.publicURL,
        avatarURL: atribute.avatarURL,
      }));
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
      const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(`public/${fileName}`);
      if (data.publicURL) {
        atribute.publicURL = data.publicURL;
      }
      atribute.avatarURL = `public/${fileName}`;
      setAccount((prev) => ({
        ...prev,
        publicURL: atribute.publicURL,
        avatarURL: atribute.avatarURL,
      }));
      setIsImageUploadLoading(false);
    }
  };

  const value = {
    user,
    loading,
    account,
    isUpdatingProfile,
    isImageUploadLoading,
    isProfileOpen,
    signUp,
    logIn,
    logOut,
    getProfile,
    handleUpdate,
    handleUploadImage,
    setUser,
    setProfileOpen,
  };

  return <UserContext.Provider value={value} {...props} />;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe estar dentro del proveedor UserContext");
  }
  return context;
}
