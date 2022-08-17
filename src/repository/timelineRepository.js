import connection from "../dbStrategy/postgres.js";

const timelineRepository = {
    savePost: async (postData, userId, title, image, urlDescription) => {
        const { rows } = await connection.query(`INSERT INTO posts (user_id, link_url, description, url_title, url_description, url_image) VALUES ($1, $2, $3, $4, $5, $6) returning id`, [userId, postData.link, postData.description, title, urlDescription, image]);

        if(rows.length > 0){
            await connection.query(`INSERT INTO likes (user_id, post_id) VALUES ($1, $2)`, [userId, rows[0].id]);
        }
        
    },
    getTimelinePosts: async () => {
        const { rows } = await connection.query(`SELECT users.id AS "userId", users.name AS "username", users.picture_url AS "userImage", 
        posts.id AS "postId", posts.link_url AS "link", posts.description, posts.url_title AS "urlTitle", posts.url_description AS "urlDescription", posts.url_image AS "urlImage",
        likes.count AS "likes" 
        FROM users
        JOIN posts
        ON users.id = posts.user_id
        JOIN likes
        ON posts.id = likes.post_id
        GROUP BY users.id,posts.id
        ORDER BY posts.id DESC
        LIMIT 20`);

        return rows;
    },

    updatePost: async (postId, postDescription) => {
        const updatedDescription = await connection.query(`UPDATE posts SET description = $1 WHERE id = $2`, [postDescription, postId]);
        console.log(updatedDescription);
        if(updatedDescription.rowCount > 0){
            return 204;
        }else{
            return 404;
        }
    },

    deletePost: async (postId) => {
        const deleteLikes = await connection.query(`DELETE FROM likes WHERE post_id = $1`, [postId]);
        console.log(deleteLikes);
        if(deleteLikes.rowCount > 0){
            await connection.query(`DELETE FROM posts WHERE id = $1`, [postId]);
            return 204;
        }else{
            return 404;
        }
    }
} 

export default timelineRepository;