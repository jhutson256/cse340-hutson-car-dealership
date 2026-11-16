import 'dotenv/config'; 
import routes from './src/controllers/routes.js';
import { setupDatabase, testConnection } from './src/models/setup.js';
import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.set('views', './src/views');

app.set('view engine', 'ejs');

app.use('/', routes);

app.listen(PORT, async () => {
    await setupDatabase();
    await testConnection();
    console.log(`Server running at http://localhost:${PORT}`);
});