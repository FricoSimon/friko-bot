import { express } from "express";
const app = new express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => { console.log(`Example app listening at http://localhost:${port}`) })

