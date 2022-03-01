export default function handler(req, res) {
    if (req.method === 'GET') {
        handlerGet(req, res);
        return;
    } 
    if (req.method === 'POST') {
        handlerPost(req, res);
        return;
    } 
    res.status(405).json({message: 'inválid request'});
}

function handlerGet(req, res) {
    if (req.query.name === 'google') {
        res.status(200).json({ url: 'https://google.com'});
        return;
    }
    res.status(404).send();
}

function handlerPost(req, res) {
    res.status(200).json({teste: '123'});
}