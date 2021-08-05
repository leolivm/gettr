import { Router } from "express";
import SearchController from "./app/controllers/SearchController";

const routes = Router();

routes.get("/", SearchController.index);

export default routes;
