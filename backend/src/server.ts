
import express from "express";
import chargesRoutes from './routes/charges';

const app = express();
const PORT = process.env.PORT || 5000

app.use(function (_req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(express.json())
app.use('/api/charges', chargesRoutes)

app.listen(PORT, () => console.log("Server Running on Port" + PORT))