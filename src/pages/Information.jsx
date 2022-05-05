import { Box, Image, Text, Center } from "@mantine/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../api/client";
import logo from "../assets/img/email-send.svg";

export const Information = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          navigate("/");
        }
      }
    );
    return () => {
      authListener.unsubscribe();
    };
  }, [navigate]);

  return (
    <Center mt={20}>
      <Box sx={{ textAlign: "center" }} mt={50}>
        <Image src={logo} width={200} />
        <Text size="sm" mt={20}>
          Check your email for the confirmation link.
        </Text>
      </Box>
    </Center>
  );
};
