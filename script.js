var countup = function (from, to, time, cb) {
        var steps = time / 50,
            incr = Math.ceil((to - from) / Math.floor(steps)),
            inter = setInterval(function () {
                from += incr;

                if (from >= to) {
                    from = to;
                    clearInterval(inter);
                }

                cb(from);
            }, time / steps);
    },
    sn = function (nameEle, followersEle, postsEle) {
        var data = {
            name: '',
            followers: 0,
            posts: 0
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
    },
    fb = document.querySelector('.fb'),
    insta = document.querySelector('.inst'),
    yt = document.querySelector('.yt'),
    fbd = new sn(
        fb.querySelector('.name'),
        fb.querySelector('.followers')
    ),
    ibd = new sn(
        insta.querySelector('.name'),
        insta.querySelector('.followers'),
        insta.querySelector('.posts')
    ),
    ybd = new sn(
        yt.querySelector('.name'),
        yt.querySelector('.followers'),
        yt.querySelector('.posts')
    );

fetch('api/data.json').then(function (res) {
    return res.json();
}).then(function (data) {
    fbd.setName(data.facebook.name);
    fbd.setFollowers(data.facebook.followers);

    ibd.setName(data.instagram.name);
    ibd.setFollowers(data.instagram.followers);
    ibd.setPosts(data.instagram.posts);

    ybd.setName(data.youtube.name);
    ybd.setFollowers(data.youtube.followers);
    ybd.setPosts(data.youtube.posts);
});
