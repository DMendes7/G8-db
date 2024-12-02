const jsonServer = require('json-server');
const { v4: uuidv4 } = require('uuid'); // Para gerar IDs únicos
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Permitir CORS
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(204);
    } else {
        next();
    }
});

// Rotas dinâmicas para CRUD
server.post('/usuarios', (req, res) => {
    const db = router.db;
    const usuarios = db.get('usuarios');

    const novoUsuario = { id: uuidv4(), ...req.body };
    usuarios.push(novoUsuario).write();

    res.status(201).json(novoUsuario);
});

server.put('/usuarios/:id', (req, res) => {
    const db = router.db;
    const usuarios = db.get('usuarios');
    const { id } = req.params;

    const usuarioExistente = usuarios.find({ id }).value();
    if (usuarioExistente) {
        usuarios.find({ id }).assign(req.body).write();
        res.status(200).json({ ...usuarioExistente, ...req.body });
    } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
});

server.delete('/usuarios/:id', (req, res) => {
    const db = router.db;
    const usuarios = db.get('usuarios');
    const { id } = req.params;

    const usuarioExistente = usuarios.find({ id }).value();
    if (usuarioExistente) {
        usuarios.remove({ id }).write();
        res.status(200).json({ message: 'Usuário excluído com sucesso' });
    } else {
        res.status(404).json({ error: 'Usuário não encontrado' });
    }
});

server.post('/vendedores', (req, res) => {
    const db = router.db;
    const vendedores = db.get('vendedores');

    const novoVendedor = { id: uuidv4(), ...req.body };
    vendedores.push(novoVendedor).write();

    res.status(201).json(novoVendedor);
});

server.put('/vendedores/:id', (req, res) => {
    const db = router.db;
    const vendedores = db.get('vendedores');
    const { id } = req.params;

    const vendedorExistente = vendedores.find({ id }).value();
    if (vendedorExistente) {
        vendedores.find({ id }).assign(req.body).write();
        res.status(200).json({ ...vendedorExistente, ...req.body });
    } else {
        res.status(404).json({ error: 'Vendedor não encontrado' });
    }
});

server.delete('/vendedores/:id', (req, res) => {
    const db = router.db;
    const vendedores = db.get('vendedores');
    const { id } = req.params;

    const vendedorExistente = vendedores.find({ id }).value();
    if (vendedorExistente) {
        vendedores.remove({ id }).write();
        res.status(200).json({ message: 'Vendedor excluído com sucesso' });
    } else {
        res.status(404).json({ error: 'Vendedor não encontrado' });
    }
});

server.post('/comentarios', (req, res) => {
    const db = router.db;
    const comentarios = db.get('comentarios');

    const novoComentario = { id: uuidv4(), ...req.body };
    comentarios.push(novoComentario).write();

    res.status(201).json(novoComentario);
});

server.put('/comentarios/:id', (req, res) => {
    const db = router.db;
    const comentarios = db.get('comentarios');
    const { id } = req.params;

    const comentarioExistente = comentarios.find({ id }).value();
    if (comentarioExistente) {
        comentarios.find({ id }).assign(req.body).write();
        res.status(200).json({ ...comentarioExistente, ...req.body });
    } else {
        res.status(404).json({ error: 'Comentário não encontrado' });
    }
});

server.delete('/comentarios/:id', (req, res) => {
    const db = router.db;
    const comentarios = db.get('comentarios');
    const { id } = req.params;

    const comentarioExistente = comentarios.find({ id }).value();
    if (comentarioExistente) {
        comentarios.remove({ id }).write();
        res.status(200).json({ message: 'Comentário excluído com sucesso' });
    } else {
        res.status(404).json({ error: 'Comentário não encontrado' });
    }
});

// Configuração do rewriter
server.use(
    jsonServer.rewriter({
        '/usuarios*': '/usuarios',
        '/vendedores*': '/vendedores',
        '/comentarios*': '/comentarios',
        '/*': '/$1'
    })
);

// Usa o roteador padrão do JSON Server
server.use(router);

// Configuração da porta
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`JSON Server está rodando na porta ${PORT}`);
});

module.exports = server;
