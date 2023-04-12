// Load env variables
import './utils/loadEnv.js';

// Express Setup
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;

// BodyParser
const urlencodedParser = express.urlencoded({ extended: true });
app.use(urlencodedParser);
app.use(express.json());

// Routes
import routes from "./routes/index.js";

// HBS Setup
import { engine } from 'express-handlebars';

app.engine('hbs', engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/',
}));

app.set('view engine', 'hbs');
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, 'public')))

// Use Routes
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
});