const fs = require("fs");
const ini = require('ini');
const http = require("http");

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


/** Fonction de récupération des ressources dans la racine du site
 * @param {String} url
 * @param {ServerResponse} res
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
 * @param {ServerResponse} res
 * @returns {string}
 */
function getTextRessource(url, res) {
    let contentTxt = getRessource(url, res)
    if (contentTxt !== undefined) {
        return contentTxt.toString();
    }
}

/** Renvoi une erreur 404 (Not Found)
 * @param {ServerResponse} res
 */
function send404(res) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(404);
    res.end(getTextRessource(page404, res));
}

/** Renvoi une erreur 403 (Forbidden)
 * @param {ServerResponse} res
 */
function send403(res) {
    res.setHeader("Content-Type", "text/html");
    res.writeHead(403);
    res.end(getTextRessource(page403, res));
}

function sendResponse(content, res, contentType) {
    res.writeHead(200, {"Content-Type" : contentType});
    res.end(content);
}


const server = http.createServer((req, res) => {

    let url = req.url;

    if (url === '/' || url === "/?") {
        url = "/index.html";
    }

    let ext = url.split(".")[1];
    let content;

    switch (ext) {
        case "html":
            content = getTextRessource(url, res);
            if (content !== undefined) {
                sendResponse(content, res, "text/html");
            }
            break;

        case "css":
            content = getTextRessource(url, res);
            if (content != undefined) {
                sendResponse(content, res, "text/css");
            }
            break;

        case "js":

            content = getRessource(url, res);
            if (content != undefined) {
                sendResponse(content, res, "application/x-javascript");
            }
            break;

        case "svg":
        case "jpeg":
        case "gif":
        case "png":
        case "jpg":

            content = getRessource(url, res);

            if (content != undefined) {
                if (ext != "svg") {
                    sendResponse(content, res, "image/" + ext);
                } else {
                    sendResponse(content, res, "image/svg+xml");
                }
            }
            break;

        default:
            send404(res);
    }


}).listen(port, host, () => {
    console.log("Serveur running on http://" + domain + ":" + port);
    console.log("Serveur running on http://" + host + ":" + port);

});
