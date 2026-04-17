import { Hono } from "hono";
import routes from "./routes/index.js";
import { swaggerUI } from '@hono/swagger-ui';
import docApp from "./docs/himati.doc.js";
const app = new Hono();
docApp.doc('/openapi.json', {
    openapi: '3.0.0',
    info: {
        title: 'My API',
        version: '1.0.0',
    },
    servers: [
        { url: '/api' }, // 🔥 penting
    ],
});
app.route("/api", routes);
// docs
app.route('/docs', docApp);
app.get('/swagger', swaggerUI({ url: '/docs/openapi.json' }));
export default app;
