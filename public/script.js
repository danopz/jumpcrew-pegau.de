var countup = function (from, to, time, cb) {
    var steps = time / 50;
    var incr = Math.ceil((to - from) / Math.floor(steps));

    var inter = setInterval(function () {
        from += incr;

        if (from >= to) {
            from = to;
            clearInterval(inter);
        }

        cb(from);
    }, time / steps);
};

var sn = function (nameEle, imageEle, followersEle, postsEle) {
    var data = {
        name: '',
        followers: 0,
        posts: 0,
        image: ''
    };

    this.setName = function (name) {
        if (nameEle && name && data.name !== name) {
            data.name = name;
            nameEle.textContent = name;
        }
    };
    this.setFollowers = function (followers) {
        if (followersEle && followers && data.followers !== followers) {
            data.followers = followers;

            countup(0, followers, 1500, function (i) {
                followersEle.textContent = i;
            })
        }
    };
    this.setPosts = function (posts) {
        if (postsEle && posts && data.posts !== posts) {
            data.posts = posts;

            countup(0, posts, 2000, function (i) {
                postsEle.textContent = i;
            })
        }
    };
    this.setImage = function (image) {
        if (imageEle && image && data.image !== image) {
            data.image = image;
            imageEle.setAttribute('src', image);
        }
    };
};

var fb = document.querySelector('.fb');
var insta = document.querySelector('.inst');
var yt = document.querySelector('.yt');

var fbd = new sn(
    fb.querySelector('.name'),
    fb.querySelector('.profile-img'),
    fb.querySelector('.followers')
);

var ibd = new sn(
    insta.querySelector('.name'),
    insta.querySelector('.profile-img'),
    insta.querySelector('.followers'),
    insta.querySelector('.posts')
);

var ybd = new sn(
    yt.querySelector('.name'),
    yt.querySelector('.profile-img'),
    yt.querySelector('.followers'),
    yt.querySelector('.posts')
);

fetch('facebook.json').then(function (res) {
    return res.json();
}).then(function (data) {
    fbd.setName(data.name);
    fbd.setImage('data:' + data.image.mime + ';charset=utf8;base64,' + data.image.data);
    fbd.setFollowers(data.followers);
});

fetch('instagram.json').then(function (res) {
    return res.json();
}).then(function (data) {
    ibd.setName(data.name);
    ibd.setImage('data:' + data.image.mime + ';charset=utf8;base64,' + data.image.data);
    ibd.setFollowers(data.followers);
    ibd.setPosts(data.posts);
});

fetch('youtube.json').then(function (res) {
    return res.json();
}).then(function (data) {
    ybd.setName(data.name);
    ybd.setImage('data:' + data.image.mime + ';charset=utf8;base64,' + data.image.data);
    ybd.setFollowers(data.followers);
    ybd.setPosts(data.posts);
});
