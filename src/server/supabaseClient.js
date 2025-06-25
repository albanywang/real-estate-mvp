import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oyuaaeeavuldmjoplvnu.supabase.co'; // From dashboard
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95dWFhZWVhdnVsZG1qb3Bsdm51Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3Nzg3NjEsImV4cCI6MjA2NjM1NDc2MX0.MiZcqTZLOOmC1tKbFC8nYs4yOf7ZwwB7sdZoHQe-bnk'; // From dashboard
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;