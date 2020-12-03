const fs = require("fs");
const path = require('path');
const ini = require('ini');
const express = require('express');

const app = express()

const configFile = fs.readFileSync('./config.ini', 'utf-8');
const config = ini.parse(configFile);

const DirName = config.pathsDir.datadir;

const page404 = config.errorPage.__404__;
const page403 = config.errorPage.__403__;

const maintenance = config.Hostname.maintenance;
const host = config.Hostname.host;
const port = config.Hostname.port;
const protocol = config.Hostname.protocol;
const domain = config.Hostname.domain;

const bannedIps = config.Lists.Blacklist
const whitelist = config.Lists.Whitelist

const whitelistEnabled = config.Lists.EnableWhitelist
const blacklistEnabled = config.Lists.EnableBlacklist

const router = express.Router();

function getRessource(url) {
    try {
        return fs.readFileSync(DirName + url);
    } catch (e) {
        console.log(e);
    }
}

function getTextRessource(url) {
    return getRessource(url).toString();
}

function send404(res) {
    res.setHeader("Content-Type", "text/html");
    res.status(404);
    res.end(getTextRessource(page404));
}

// respond with "hello world" when a GET request is made to the homepage
router.get('/', function(req, res) {
    res.end(getTextRessource("/index.html"));
});

router.get('/*.html', function(req, res) {
    res.end(getTextRessource(req.url));
});

router.get('/assets/html/*', function(req, res) {
    res.end(getTextRessource(req.url));
});

router.get("/assets/css/*.css", function (req, res) {
    if (req.url.indexOf("css") !== -1) {
        res.setHeader("Content-Type", "text/css");
        res.end(getTextRessource(req.url));
    } else {

    }
});

router.get("/assets/css/*.ttf", function (req, res) {
    res.setHeader("Content-Type", "application/octet-stream");
    res.end(getRessource(req.url));
});

router.get("/assets/js/*", function (req, res) {
    res.setHeader("Content-Type", "appplication/script");
    res.end(getRessource(req.url));
});

router.get("/assets/images/*", function (req, res) {

    let options = {
        root: path.join(__dirname, 'public_html'),
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    }

    res.sendFile(req.url, options);

})

// post and get forms

router.all("/import", function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.set({ 'content-type': 'text/html; charset=utf-8' });
    res.end("Le formulaire a bien été reçu");
})

// Default => Error 404
router.all("/*", function (req, res) {
    send404(res);
});

app.use('/', router);
console.log("Server lisent on http://" + host + ":" + port);
app.listen(port);