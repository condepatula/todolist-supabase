import { createClient } from "@supabase/supabase-js";

const URL_SUPABASE = process.env.REACT_APP_URL_SUPABASE;
const API_KEY_SUPABASE = process.env.REACT_APP_API_KEY_SUPABASE;

export const supabase = createClient(
  URL_SUPABASE,
  API_KEY_SUPABASE
);
