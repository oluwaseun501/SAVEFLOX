import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://vrcwqbszxmylcyfgbdkf.supabase.co";
const SUPABASE_KEY = "sb_publishable_0wiIa7CG57JdKSSyYDcggw_btjVeX7e";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);