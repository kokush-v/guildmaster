import express, { Express } from "express";
import morgan from "morgan";
import http from "http";
import routes from "./routes";

const router: Express = express();

router.use(morgan("dev"));

router.use(express.urlencoded({ extended: false }));

router.use(express.json());

router.use((req, res, next) => {
	res.header("Access-Conroll-Allow-Origin", "*");

	res.header("Access-Conroll-Allow-Headers", "origin, X-Requested-With, Content-Type, Accept, Authorization");

	if (req.method === "OPTIONS") {
		res.header("Access-Conroll-Allow-Methods", "GET PATCH DELETE POST PUT");
		return res.status(200).json();
	}
	next();
});

router.use("/", routes);

router.use((req, res, next) => {
	const error = new Error("not found");
	return res.status(404).json({
		message: error.message,
	});
});

const httpServer = http.createServer(router);
const PORT: any = process.env.SERVER_PORT ?? 3000;

httpServer.listen(PORT, () => console.log(`Server started on port ${PORT}`));
