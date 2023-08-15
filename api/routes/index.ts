import express from "express";
import botRouter from "./bot.router";

const routes = express();

routes.use("/bot", botRouter);

export default routes;
