#!/usr/bin/env node

const err = (message) => {
    console.error(message);
    process.exit(1);
};

// check for FB_API_TOKEN environment variable
if (!process.env.FB_API_TOKEN) {
    err('FB_API_TOKEN environment variable is missing!');
}

// imports
const fs = require('fs');
const path = require('path');
const https = require('https');
const sharp = require('sharp');

const apiPath = path.join(__dirname, '..', 'public', 'api');
var file = path.join(apiPath, 'data.json');

// let's check if a custom output filepath is provided as arg
if (process.argv[2]) {
    let p = process.argv[2];
    let f = p[0] === '/' ? p : path.join(process.env.PWD, p);

    try {
        // check file existance, readable and writable
        fs.accessSync(f, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK);
    } catch (e) {
        err(`The file "${f}" has to be created first and must be readable|writable to the script.`);
    }

    file = f;
}

console.log(`Fetch data, write result to file "${file}".`);

// @link https://gist.github.com/ktheory/df3440b01d4b9d3197180d5254d7fb65
const httpRequest = (urlOptions, data = '') => {
    return new Promise((resolve, reject) => {
        const req = https.request(urlOptions, (res) => {
            let body = [];
            res.on('data', (chunk) => (body.push(chunk)));
            res.on('error', reject);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode <= 299) {
                    resolve({ statusCode: res.statusCode, headers: res.headers, body: Buffer.concat(body) });
                } else {
                    reject('Request failed. status: ' + res.statusCode + ', body: ' + Buffer.concat(body));
                }
            });
        });
        req.on('error', reject);
        req.write(data, 'binary');
        req.end();
    });
};

let apiUrl = new URL('https://graph.facebook.com/v7.0/jumpcrewpegau');
apiUrl.searchParams.set('fields', 'instagram_accounts.limit(1){follow_count,followed_by_count,media_count,profile_pic,username},fan_count,picture.type(large),name');
apiUrl.searchParams.set('access_token', process.env.FB_API_TOKEN);

fbData = httpRequest(apiUrl.toString())
    .then((data) => {
        return JSON.parse(data.body);
    })
    .catch(err);

fbData
    .then((body) => {
        httpRequest(body.picture.data.url)
            .then((data) => {
                sharp(data.body).jpeg({quality: 80}).toFile(path.join(apiPath, 'facebook.jpg'));
            })
            .catch(err);
        return body;
    }).catch(err);

fbData
    .then((body) => {
        httpRequest(body.instagram_accounts.data[0].profile_pic)
            .then((data) => {
                sharp(data.body).jpeg({quality: 80}).toFile(path.join(apiPath, 'instagram.jpg'));
            })
            .catch(err);
        return body;
    }).catch(err);

try {
    var output = JSON.parse(fs.readFileSync(file));
} catch (e) {
    var output = {
        facebook: {
            name: '?',
            followers: 0,
            posts: 0
        },
        instagram: {
            name: '?',
            followers: 0,
            posts: 0
        }
    };
}

fbData
    .then((body) => {
        output.facebook.name = body.name;
        output.facebook.followers = body.fan_count;

        output.instagram.name = body.instagram_accounts.data[0].username;
        output.instagram.followers = body.instagram_accounts.data[0].followed_by_count;
        output.instagram.posts = body.instagram_accounts.data[0].media_count;

        return output;
    })
    .then((output) => {
        fs.writeFileSync(file, JSON.stringify(output));
    })
    .catch(err);
