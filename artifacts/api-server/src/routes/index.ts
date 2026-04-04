import { Router, type IRouter } from "express";
import healthRouter from "./health";
import restaurantsRouter from "./restaurants";
import nomsRouter from "./noms";
import usersRouter from "./users";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(restaurantsRouter);
router.use(nomsRouter);
router.use(usersRouter);
router.use(statsRouter);

export default router;
