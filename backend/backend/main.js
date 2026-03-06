// backend/main.js
const express = require('express');
const cors    = require('cors');
const routes  = require('./src/routes/index');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', routes);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MediCore API → http://localhost:${PORT}/api`);
});
