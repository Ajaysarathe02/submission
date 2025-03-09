import { createClient } from "@supabase/supabase-js"; 

const supabaseUrl = "https://elddddnwhmcmzmwlaoob.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsZGRkZG53aG1jbXptd2xhb29iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0MzgzNjAsImV4cCI6MjA1NzAxNDM2MH0.MZK1i-P6l95QHNsk2aDiVECE4KNElwhtaQnnd_qhF1o";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

