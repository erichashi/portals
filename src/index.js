const server = require('./server');

const port = process.env.WEB_PORT || 8080;

server.create()
    .then(app => {
        app.listen(port, () => console.log(`localhost:${port}`))
    })
    .catch(e => console.log(e));

