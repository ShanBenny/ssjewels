import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yepjhvjjssjjrwbgltyo.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllcGpodmpqc3NqanJ3YmdsdHlvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjMzMzgsImV4cCI6MjA4ODU5OTMzOH0.PZs9Eq8I1REkwoC8bkgL96Fivf7hfLJYoVrM3BRMxVY';

export const supabase = createClient(supabaseUrl, supabaseKey);
