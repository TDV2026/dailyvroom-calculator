import { Router, type IRouter } from "express";
import healthRouter from "./health";
import calculateRouter from "./calculate";
import shippingRouter from "./shipping";
import shareRouter from "./share";
import subscribeRouter from "./subscribe";

const router: IRouter = Router();

router.use(healthRouter);
router.use(calculateRouter);
router.use(shippingRouter);
router.use(shareRouter);
router.use(subscribeRouter);

export default router;
