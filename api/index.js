const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db.json'); // Certifique-se de que o arquivo `db.json` está no diretório raiz
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Permitir CORS
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Adicionar suporte a POST em `/usuarios`, `/vendedores`, e `/comentarios`
server.post('/usuarios', (req, res) => {
    const db = router.db; // Obtém o banco de dados
    const usuarios = db.get('usuarios');

    // Gera um ID único para o novo usuário
    const novoUsuario = { id: Date.now().toString(), ...req.body };
    usuarios.push(novoUsuario).write();

    res.status(201).json(novoUsuario);
});

server.post('/vendedores', (req, res) => {
    const db = router.db;
    const vendedores = db.get('vendedores');

    const novoVendedor = { id: Date.now().toString(), ...req.body };
    vendedores.push(novoVendedor).write();

    res.status(201).json(novoVendedor);
});

server.post('/comentarios', (req, res) => {
    const db = router.db;
    const comentarios = db.get('comentarios');

    const novoComentario = { id: Date.now().toString(), ...req.body };
    comentarios.push(novoComentario).write();

    res.status(201).json(novoComentario);
});

server.use(router);

module.exports = server;
