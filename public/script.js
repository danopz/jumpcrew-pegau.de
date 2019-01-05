var fb = document.querySelector('.fb'),
    insta = document.querySelector('.inst'),
    yt = document.querySelector('.yt'),
    fbName = fb.querySelector('.name'),
    fbFollowers = fb.querySelector('.followers'),
    instaName = insta.querySelector('.name'),
    instaFollowers = insta.querySelector('.followers'),
    instaPosts = insta.querySelector('.posts'),
    ytName = yt.querySelector('.name'),
    ytFollowers = yt.querySelector('.followers'),
    ytPosts = yt.querySelector('.posts');

fetch('api/data.json').then(function (res) {
    return res.json();
}).then(function (data) {
    fbName.textContent = data.facebook.name;
    fbFollowers.textContent = data.facebook.followers;
    instaName.textContent = data.instagram.name;
    instaFollowers.textContent = data.instagram.followers;
    instaPosts.textContent = data.instagram.posts;
    ytName.textContent = data.youtube.name;
    ytFollowers.textContent = data.youtube.followers;
    ytPosts.textContent = data.youtube.posts;
});
