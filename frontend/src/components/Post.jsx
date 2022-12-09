import "./Post.css";
import { Avatar } from "@mui/material";

const Post = ({ username, caption, imageUrl }) => {
	return (
		<div className="post">
			<div className="post__header">
				<Avatar className="post__avatar" alt={username} src="" />
				<h3>{username}</h3>
			</div>
			<img src={imageUrl} alt="react" className="post__image" />
			<h4 className="post__text">
				<strong>{username}</strong>
				{caption}
			</h4>
		</div>
	);
};

export default Post;
