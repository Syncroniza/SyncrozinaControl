import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoConnect from "./config/mongo.config.js";
import setupRoutes from "./routes/progress.routes.js";
import taskRoutes from "./routes/gantt.routes.js";
import sheetRoutes from "./routes/controlsheet.routes.js";
import projectRoutes from "./routes/project.routes.js";
import budgettRoutes from "./routes/budget.routes.js";
import mailRoutes from "./routes/mail.routes.js";
import laborRoutes from "./routes/laborcost.routes.js";
import contractRoutes from "./routes/contract.routes.js";
import increasediscountRoutes from "./routes/increasediscount.routes.js";
import invoicesRoutes from "./routes/invoices.routes.js";
import payapplicationRoutes from "./routes/payapplication.routes.js";


const app = express();

app.use("/uploads", express.static("server/uploads"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const whitelist = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://appsyncroniza.cl",
    "https://demo.syncroniza.cl",
    "https://www.syncroniza.cl",
    "https://syncroniza.cl",
];

app.use(
  cors({
      credentials: true,
      origin: function (origin, callback) {
          if (!origin) return callback(null, true);
          if (whitelist.indexOf(origin) === -1) {
              const message =
                  "The CORS policy for this site does not " +
                  "allow access from the specified Origin.";
              return callback(new Error(message), false);
          }
          return callback(null, true);
      }
  })
);


// Conexión a MongoDB
const PORT = process.env.PORT || 8000;

setupRoutes(app);
taskRoutes(app);
sheetRoutes(app);
projectRoutes(app);
budgettRoutes(app);
mailRoutes(app)
laborRoutes(app);
contractRoutes(app)
increasediscountRoutes(app)
invoicesRoutes(app)
payapplicationRoutes(app)


app.get("/health", (req, res) => {
    res.send("OK");
    res.status(200);
});




mongoConnect().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
  });
});
