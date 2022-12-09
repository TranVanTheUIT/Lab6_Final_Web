import "./App.css";
import React, { useState, useEffect } from "react";
import Post from "./components/Post";
import ImageUpload from "./components/ImageUpload";
import { styled } from "@mui/system";
import { Button, Input } from "@mui/material";
import Modal from "@mui/material/Modal";
import axios from "./axios";
import Pusher from "pusher-js";
import { auth } from "./firebase";
import Logo192 from "./logo192.png";

const pusher = new Pusher("a7ecab62a4cd09e00b6b", {
	cluster: "ap1",
});

function getModalStyle() {
	const top = 50;
	const left = 50;

	return {
		top: `50%`,
		left: `50%`,
		transform: `translate(-50%, -50%)`,
	};
}

const useStyles = styled((theme) => ({
	paper: {
		position: `absolute`,
		width: 400,
		backgroundColor: theme.palette.background.paper,
		border: "2px solid #000",
		boxShadow: theme.shadow[5],
		padding: theme.spacing(2, 4, 3),
	},
}));

const App = () => {
	const classes = useStyles();
	const [modalStyle] = React.useState(getModalStyle);
	const [open, setOpen] = useState(false);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [user, setUser] = useState(null);
	const [openSignIn, setOpenSignIn] = useState(false);
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		const unsubcribe = auth.onAuthStateChanged((authUser) => {
			if (authUser) {
				setUser(authUser);
			} else {
				setUser(null);
			}
		});
		return () => {
			unsubcribe();
		};
	}, [user, username]);

	const fetchPosts = async () => {
		await axios.get("/sync").then((res) => setPosts(res.data));
	};

	useEffect(() => {
		const channel = pusher.subscribe("posts");
		channel.bind("inserted", (data) => {
			fetchPosts();
		});
	}, []);

	useEffect(() => {
		fetchPosts();
	}, []);

	const signUp = (e) => {
		e.preventDefault();
		auth
			.createUserWithEmailAndPassword(email, password)
			.then((authUser) => authUser.user.updateProfile({ displayName: username }))
			.catch((err) => alert(err.message));
		setOpen(false);
	};

	const signIn = async (e) => {
		e.preventDefault();
		await auth.signInWithEmailAndPassword(email, password).catch((err) => alert(err.message));
		setOpenSignIn(false);
		console.log(await auth.signInWithEmailAndPassword(email, password));
	};

	return (
		<div className="app">
			<Modal open={open} onClose={() => setOpen(false)}>
				<div className={classes.paper}>
					<form className="app__signup">
						<center>
							<img className="app__headerImage" src={Logo192} alt="Header" />
						</center>
						<Input placeholder="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
						<Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signUp}>
							Sign Up
						</Button>
					</form>
				</div>
			</Modal>
			<Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
				<div className={classes.paper}>
					<form className="app__signup">
						<center>
							<img src={Logo192} alt="Header" className="app__headerImage" />
						</center>
						<Input placeholder="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
						<Input
							placeholder="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						<Button type="submit" onClick={signIn}>
							Sign In
						</Button>
					</form>
				</div>
			</Modal>
			<div className="app__header">
				<img src={Logo192} alt="Header" className="app__headerImage" />
				{user ? (
					<Button onClick={() => auth.signOut()}>Logout</Button>
				) : (
					<div className="app__loginContainer">
						<Button onClick={() => setOpenSignIn(true)}>Sign In</Button>
						<Button onClick={() => setOpen(true)}>Sign Up</Button>
					</div>
				)}
			</div>
			<div className="app__posts">
				{posts.map((post) => (
					<Post key={post.id} username={post.user} caption={post.caption} imageUrl={post.image} />
				))}
			</div>
			{user?.displayName ? (
				<ImageUpload username={user.displayName} />
			) : (
				<h3 className="app__notLogin">Need to login to upload</h3>
			)}
		</div>
	);
};

export default App;
