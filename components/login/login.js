//Comment 1 : The below code is used to get the social icons in the footer
const socialIcons = [
    {
        name: "Facebook",
        src: "/Pratical Assesment/assets/Icon-Facebook.svg"
    },
    {
        name: "Twitter",
        src: "/Pratical Assesment/assets/Icon-Twitter.svg"
    },
    {
        name: "Instagram",
        src: "/Pratical Assesment/assets/icon-instagram.svg"
    },
    {
        name: "LinkedIn",
        src: "/Pratical Assesment/assets/Icon-Linkedin.svg"
    }
];
let social_icon = document.getElementsByClassName("social-icons")[0];
socialIcons.forEach((icon) => {
    social_icon.innerHTML += `<img src="${icon.src}" alt=${icon.name}>`
})



//Comment 2 : The below code is used for Login Authentication from dummyJSON
document.getElementById('loginForm').addEventListener('submit', async e => {
    e.preventDefault();
    const input = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    try {
        const { users } = await fetch('https://dummyjson.com/users').then(r => r.json());
        const u = users.find(({ username }) => username === input);
        if (!u) throw new Error('User not found');

        const res = await fetch('https://dummyjson.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u.username, password })
        });
        if (!res.ok) throw new Error('Invalid password');

        const data = await res.json();
        localStorage.setItem('user', JSON.stringify(data));
        location.href = '../dashboard/dashboard.html';
    } catch (err) {
        alert(err.message);
    }
});
