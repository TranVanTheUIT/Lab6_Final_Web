import express from "express";
import mongoose from "mongoose";
import Cors from "cors";
import Pusher from "pusher";
import Posts from "./postModel.js";
// import dotenv from "dotenv";

// dotenv.config();
const app = express();
const port = process.env.PORT || 9000;
const connection_url =
	"mongodb+srv://thien2002nhan:thien2002nhan@cluster1.jbqo2un.mongodb.net/LAB6REACT?retryWrites=true&w=majority";
const pusher = new Pusher({
	appId: "1519608",
	key: "a7ecab62a4cd09e00b6b",
	secret: "e3366149cf2177d8ac92",
	cluster: "ap1",
	useTLS: true,
});

//Middleware
app.use(express.json());
app.use(Cors());

//DB Config
mongoose.connect(connection_url);

mongoose.connection.once("open", () => {
	console.log("DB Connected");
	const changeStream = mongoose.connection.collection("posts").watch();
	changeStream.on("change", (change) => {
		console.log(change);
		if (change.operationType === "insert") {
			console.log("Trigerring Puser");
			pusher.trigger("posts", "inserted", {
				change: change,
			});
		} else {
			console.log("Error trigerring Pusher");
		}
	});
});

//API Endpoints
app.get("/", (req, res) => res.status(200).send("Hello TheWebDev"));

app.post("/upload", (req, res) => {
	const dbPost = req.body;
	Posts.create(dbPost, (err, data) => {
		if (err) res.status(500).send(err);
		else res.status(201).send(data);
	});
});

app.get("/sync", (req, res) => {
	Posts.find((err, data) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(data);
		}
	});
});
//Listener
app.listen(port, () => console.log(`Listening on localhost: ${port}`));
