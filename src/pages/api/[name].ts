import mysql, { ServerlessMysql } from 'serverless-mysql';
import url from 'url'
import { NextApiRequest, NextApiResponse } from 'next';

interface Link {
    id: number,
    url: string
}

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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

async function handlerGet(req: NextApiRequest, res: NextApiResponse, db: ServerlessMysql) {
    let results = await db.query<Array<Link>>('SELECT `id`, `url` FROM `raspga_links` WHERE `name` = ?', [req.query.name]);
    if (results.length === 0) {
        res.status(404).send("");
        return;
    }
    /* registrando acesso */
    let ip = (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.connection.remoteAddress);
    await db.query('INSERT INTO `raspga_links_access` (`link_id`, `ip_address`) VALUES (?, ?)', [results[0].id, ip]);

    res.status(200).json({url: results[0].url})
}

async function handlerPost(req: NextApiRequest, res: NextApiResponse, db: ServerlessMysql) {
    /* verificando o nome */
    if (req.query.name.length > 32) {
        res.status(400).json({message: 'E nome não pode conter mais que 32 caracteres'});
        return;
    }

    if (typeof req.query.name !== 'string') {
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

    if (req.body.url_link.length > 10000) {
        res.status(400).json({message: 'URL não pode ser maior que 10000 caracteres'});
        return;
    }

    if (!RegExp('^(https?:\\/\\/)([a-zA-Z0-9]{1,255}(\\.[a-zA-Z0-9]{1,20}){1,4})(\\/[a-zA-Z0-9\\-]{0,255}){0,25}(\\?[a-zA-Z0-9]{0,255}\\=[^\\=&]{0,32}(&[a-zA-Z0-9]{0,255}\\=[^\\=&]{0,255}){0,20})?$').test(req.body.url_link)) {
        res.status(400).json({message: 'Link informado é inválido'});
        return;
    }
    
    let url_parse = new URL(req.body.url_link);
    let blacklist = await db.query<String[]>('SELECT `hostname` FROM `raspga_url_blacklist` WHERE `hostname` = ?', [url_parse.hostname]);
    if (blacklist.length > 0) {
        res.status(400).json({message: 'Essa URL não pode ser encurtado'});
        return;
    }

    let results = await db.query<Array<Link>>('SELECT `id`, `url` FROM `raspga_links` WHERE `name` = ?', [req.query.name]);
    if (results.length > 0) {
        res.status(400).json({message: 'O nome já está em uso'});
        return;
    }
    
    let ip = (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'] : req.connection.remoteAddress);
    await db.query('INSERT INTO `raspga_links` (`name`, `url`, `ip_address`) VALUES (?, ?, ?)', [req.query.name, req.body.url_link, ip]);
    res.status(200).send("");
}