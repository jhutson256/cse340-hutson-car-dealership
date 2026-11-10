import 'dotenv/config'; 
import express from 'express';

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

app.set('views', './src/views');

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('home', { title: 'My Express App' });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
