const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://rugwfkovnisyrjtvjzjb.supabase.com',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1Z3dma292bmlzeXJqdHZqempiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NDc0MDMsImV4cCI6MjEwNDAyMzQwM30.AMGbJDy-HERt3lVRsitKVNf--C3Z3acRz_gvYmp7iSk'
);

async function test() {
  console.log("1. Signing up test user...");
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email: 'test_agent@carpath.fr',
    password: 'TestPassword123!',
  });
  
  if (signUpError) {
    console.log("SignUp Error:", signUpError.message);
  } else {
    console.log("SignUp Success!");
  }

  console.log("2. Signing in test user...");
  const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
    email: 'test_agent@carpath.fr',
    password: 'TestPassword123!',
  });

  if (signInError) {
    console.log("SignIn Error:", signInError.message);
  } else {
    console.log("SignIn Success! Token received.");
  }
}

test();
