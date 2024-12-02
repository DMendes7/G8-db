const jsonServer = require('json-server');

const path = require('path');
const fs = require('fs');

const server = jsonServer.create();

// Caminhos para o arquivo original e o temporário
const originalDbPath = path.join(__dirname, 'db.json');
const tmpDbPath = path.join('/tmp', 'db.json');

// Copia o arquivo `db.json` para o diretório `/tmp` durante o início do servidor
if (!fs.existsSync(tmpDbPath)) {
    console.log('Copiando db.json para /tmp...');
    fs.copyFileSync(originalDbPath, tmpDbPath);
    console.log('Arquivo db.json copiado para /tmp com sucesso!');
} else {
    console.log('Arquivo db.json já existe em /tmp.');
}

// Configura o JSON Server para usar o arquivo temporário
const router = jsonServer.router(tmpDbPath);
const middlewares = jsonServer.defaults();

server.use(middlewares);

// Permitir CORS
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

// Rotas dinâmicas para adicionar dados em `usuarios`, `vendedores`, e `comentarios`
server.post('/usuarios', (req, res) => {
    const db = router.db; // Acessa o banco de dados
    const usuarios = db.get('usuarios');

    const novoUsuario = { id: Date.now().toString(), ...req.body };
    usuarios.push(novoUsuario).write();

    res.status(201).json(novoUsuario);
});

server.post('/vendedores', (req, res) => {
    console.log('Recebendo payload para /vendedores:', req.body);
    
    try {
        const db = router.db; // Acessa o banco de dados
        const vendedores = db.get('vendedores');
        const { v4: uuidv4 } = require('uuid');
        
        // Criar o novo vendedor com ID único
        const novoVendedor = { id: uuidv4(), ...req.body };
        console.log('Vendedor a ser salvo:', novoVendedor);

        // Adicionar o vendedor ao banco de dados
        vendedores.push(novoVendedor).write();
        
        console.log('Vendedor salvo com sucesso!');
        res.status(201).json(novoVendedor);
    }  catch (error) {
        console.error('Erro interno ao salvar vendedor:', error.message); // Log detalhado do erro
        console.error('Stack trace:', error.stack); // Loga a pilha do erro para mais detalhes
        res.status(500).json({ error: 'Erro interno ao salvar vendedor.', details: error.message });
    }
});


server.post('/comentarios', (req, res) => {
    const db = router.db;
    const comentarios = db.get('comentarios');

    const novoComentario = { id: Date.now().toString(), ...req.body };
    comentarios.push(novoComentario).write();

    res.status(201).json(novoComentario);
});

// Configuração do rewriter para redirecionar rotas de forma adequada
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

// Configuração da porta para Vercel
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`JSON Server está rodando na porta ${PORT}`);
});

module.exports = server;
