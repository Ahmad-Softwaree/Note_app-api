import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config();
const { SUPABASE_PROJECT_URL, SUPABASE_SECRET_KEY } = process.env;
const supabase = createClient(SUPABASE_PROJECT_URL, SUPABASE_SECRET_KEY);

export default supabase;
