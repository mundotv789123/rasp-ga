import mysql from 'serverless-mysql';
import validuri from 'valid-url';

async function getDB() {
    var conn = mysql({
        config: {
            host: process.env.MYSQL_HOSTNAME,
            user: process.env.MYSQL_USERNAME,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE
        }
    });
    conn.connect();
    return conn;
}

export default async function handler(req, res) {
    let db = await getDB();
    if (db === null) {
        res.status(500).json({message: 'internal error'});
    }
    if (req.method === 'GET') {
        await handlerGet(req, res, db);
        return;
    } 
    if (req.method === 'POST') {
        await handlerPost(req, res, db);
        return; 
    }
    db.end();
    res.status(405).json({message: 'method is not supported'});
}

async function handlerGet(req, res, db) {
    let results = await db.query('SELECT `id`, `url` FROM `raspga_links` WHERE `name` = ?', [req.query.name]);
    if (results.length === 0) {
        res.status(404).send();
        return;
    }
    /* registrando acesso */
    let ip = (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.connection.remoteAddress);
    await db.query('INSERT INTO `raspga_links_access` (`link_id`, `ip_address`) VALUES (?, ?)', [results[0].id, ip]);

    res.status(200).json({url: results[0].url})
}

async function handlerPost(req, res, db) {
    /* verificando o nome */
    if (req.query.name.length > 32) {
        res.status(400).json({message: 'E nome não pode conter mais que 32 caracteres'});
        return;
    }

    if (RegExp('[^\\w\\d]').test(req.query.name)) {
        res.status(400).json({message: 'E nome não pode conter caracteres especiais'});
        return;
    }

    /* verificando url */
    if (!req.body.url_link) {
        res.status(400).json({message: 'Informe o link a ser encurtado'});
        return;
    }

    if (!req.body.url_link.length > 128) {
        res.status(400).json({message: 'URL não pode ser maior que 128 caracteres'});
        return;
    }

    if (!validuri.isUri(req.body.url_link)) {
        res.status(400).json({message: 'Link informado não é uma uri'});
        return;
    }

    let results = await db.query('SELECT `url` FROM `raspga_links` WHERE `name` = ?', [req.query.name]);
    if (results.length > 0) {
        res.status(400).json({message: 'E nome já está em uso'});
        return;
    }
    
    let ip = (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.connection.remoteAddress);
    await db.query('INSERT INTO `raspga_links` (`name`, `url`, `ip_address`) VALUES (?, ?, ?)', [req.query.name, req.body.url_link, ip]);
    res.status(200).send();
}