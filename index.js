const fs = require("fs");
const path = require('path');
const ini = require('ini');
const express = require('express');

const app = express()

// Récupération du fichier de configuration config.ini
const configFile = fs.readFileSync('./config.ini', 'utf-8');
const config = ini.parse(configFile);

// Récupération du dossier contenant le site web
const DirName = config.pathsDir.datadir;

// Récupération des pages d'erreur personnalisées
const page404 = config.errorPage.__404__;
const page403 = config.errorPage.__403__;

// Défini si l'état de maintenance est activé (active la whitelist)
const maintenance = config.Hostname.maintenance;

// interface d'écoute du serveur NodeJS
const host = config.Hostname.host;
const port = config.Hostname.port;
const domain = config.Hostname.domain;

// Blacklist et Whitelist
const bannedIps = config.Lists.Blacklist
const whitelist = config.Lists.Whitelist

// Etats d'activation de la Blacklist et la Whitelist
const whitelistEnabled = config.Lists.EnableWhitelist
const blacklistEnabled = config.Lists.EnableBlacklist

// Création du routeur expressJS
const router = express.Router();


/** Fonction de récupération des ressources dans la racine du site
 * @param {String} url
 * @param {Response} res
 * @returns {Buffer}
 */
function getRessource(url, res) {
    try {
        return fs.readFileSync(DirName + url);
    } catch (e) {
        console.log(e);
        send404(res);
    }
}

/** Renvoi une ressource sous la forme de chaine de caractère
 * @param {String} url
 * @param {Response} res
 * @returns {string}
 */
function getTextRessource(url, res) {
    return getRessource(url, res).toString();
}

/** Renvoi une erreur 404 (Not Found)
 * @param {Response} res
 */
function send404(res) {
    res.setHeader("Content-Type", "text/html");
    res.status(404);
    res.end(getTextRessource(page404));
}

/** Renvoi une erreur 403 (Forbidden)
 * @param {Response} res
 */
function send403(res) {
    res.setHeader("Content-Type", "text/html");
    res.status(403);
    res.end(getTextRessource(page403));
}

// Affiche index.html quand le client demande la racine du site
router.get('/', function(req, res) {
    res.end(getTextRessource("/index.html", res));
});

// Renvoi une page html situé à la racine (index ou login) si non trouvé renvois une erreur 404
router.get('/*.html', function(req, res) {
    res.end(getTextRessource(req.url, res));
});

// Pour les requêtes AJAX
router.get('/assets/html/*', function(req, res) {
    res.end(getTextRessource(req.url, res));
});

// Renvoi les fichiers CSS
router.get("/assets/css/*.css", function (req, res) {
    if (req.url.indexOf("css") !== -1) {
        res.setHeader("Content-Type", "text/css");
        res.end(getTextRessource(req.url, res));
    } else {

    }
});

// Renvoi les fichiers TTF
router.get("/assets/css/*.ttf", function (req, res) {
    res.setHeader("Content-Type", "application/octet-stream");
    res.end(getRessource(req.url, res));
});

// Renvoi les script Javascript
router.get("/assets/js/*", function (req, res) {
    res.setHeader("Content-Type", "appplication/script");
    res.end(getRessource(req.url, res));
});

// Renvoi les image
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

// Formulaire get et Post
// todo : Traitement des formulaires
router.all("/form/*", function (req, res) {
    res.setHeader("Content-Type", "text/html");
    res.set({ 'content-type': 'text/html; charset=utf-8' });
    res.end("Le formulaire a bien été reçu");
})

// Route par défaut => Erreur 404
router.all("/*", function (req, res) {

    send404(res);

});

// Lancement du serveur
app.use('/', router);
console.log("Server listen on http://" + domain + ":" + port);
app.listen(port);