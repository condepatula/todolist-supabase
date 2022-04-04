import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.REACT_APP_URL_SUPABASE,
  process.env.REACT_APP_API_KEY_SUPABASE
);
