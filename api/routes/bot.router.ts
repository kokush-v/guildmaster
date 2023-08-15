import express from "express";
import botController from "../controllers/bot.controller";

const botRouter = express();

botRouter.get("/name", botController.getBotName);

export default botRouter;
