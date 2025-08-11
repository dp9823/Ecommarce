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