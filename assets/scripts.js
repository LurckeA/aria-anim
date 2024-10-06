console.log('scripts.js loaded');

const supabaseUrl = 'https://jrsygxnrmdnyylhovhjt.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impyc3lneG5ybWRueXlsaG92aGp0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjc2MDczNDUsImV4cCI6MjA0MzE4MzM0NX0.4klLl1hC9b9YhlUfW7XlKr4tHWGyI_TEGYPaztIDHs8';
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    checkSession();
});

function setupEventListeners() {
    const signUpForm = document.getElementById('signUpForm');
    const signInForm = document.getElementById('signInForm');

    if (signUpForm) {
        signUpForm.addEventListener('submit', handleSignUp);
    }

    if (signInForm) {
        signInForm.addEventListener('submit', handleSignIn);
    }
}

async function handleSignUp(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    await signUp(username, email, password);
}

async function handleSignIn(event) {
    event.preventDefault();
    const usernameEmail = document.getElementById('usernameEmail').value;
    const password = document.getElementById('password').value;
    await signIn(usernameEmail, password);
}

async function signUp(username, email, password) {
    try {
        console.log('Attempting to sign up with:', { username, email });
        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password,
            options: { data: { username: username } }
        });
        if (error) throw error;

        console.log('Signup response:', data);

        if (data.user) {
            console.log('User created successfully:', data.user);

            // Insert into users table
            const { error: insertError } = await supabaseClient
                .from('users')
                .insert({ id: data.user.id, username: username, email: email });

            if (insertError) {
                console.error('Error inserting into users table:', insertError);
                alert('Account created, but there was an error saving additional data.');
            } else {
                console.log('User data inserted successfully');
            }

            alert('Sign-up successful! Please check your email to confirm your account.');
            window.location.href = 'index.html';
        } else {
            console.log('User object not found in signup response');
            alert('Sign-up successful, but user object not returned. Please try logging in.');
        }
    } catch (error) {
        console.error('Signup error:', error);
        alert('Error: ' + error.message);
    }
}

async function signIn(usernameOrEmail, password) {
    console.log('Attempting to sign in with:', usernameOrEmail);

    try {
        let email = usernameOrEmail;
        
        if (!validateEmail(usernameOrEmail)) {
            console.log('Input is not an email, attempting to sign in with username');
            
            const { data: userData, error: userError } = await supabaseClient
                .from('users')
                .select('email')
                .eq('username', usernameOrEmail)
                .single();

            if (userError) throw userError;

            if (!userData) {
                throw new Error('Username not found');
            }

            email = userData.email;
            console.log('Found email for username:', email);
        }

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) throw error;

        console.log('Signin successful:', data);
        alert('Sign-in successful!');
        console.log('Attempting to redirect to index.html');
        window.location.href = 'index.html';
        
        // Add a delay and check if redirection occurred
        setTimeout(() => {
            if (window.location.pathname !== 'index.html') {
                console.error('Redirection failed');
                alert('Redirection failed. Please try going to index.html manually.');
            }
        }, 1000);
    } catch (error) {
        console.error('Signin error:', error);
        alert('Error: ' + error.message);
    }
}

function validateEmail(email) {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
}

async function checkSession() {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session) {
            console.log('User is signed in:', session.user);
            if (!window.location.pathname.endsWith('index.html')) {
                console.log('Redirecting to index.html');
                window.location.href = 'index.html';
                console.log('Redirection should have occurred');
            }
        } else {
            console.log('No active session');
            if (window.location.pathname.endsWith('index.html')) {
                console.log('Redirecting to signin.html');
                window.location.href = 'signin.html';
                console.log('Redirection should have occurred');
            }
        }
    } catch (error) {
        console.error('Error checking session:', error);
    }
}