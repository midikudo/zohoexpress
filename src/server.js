import Fastify from 'fastify';
import { cfg } from './config.js';
import zohoWebhookRoute from './routes/zohoWebhook.js';


const fastify = Fastify({
logger: cfg.logPretty ? { transport: { target: 'pino-pretty' } } : true,
});


fastify.get('/health', async () => ({ status: 'ok', time: new Date().toISOString() }));
fastify.register(zohoWebhookRoute);


fastify.listen({ port: cfg.port, host: '0.0.0.0' })
.then(addr => fastify.log.info(`Server listening on ${addr}`))
.catch(err => { fastify.log.error(err); process.exit(1); });