
const express = require("express")
const router = express.Router()
const blogController = require('../controllers/blogController')
const authenticate = require("../middleware/authenticate")

// create a blog 
router.post("/create-blog", authenticate, blogController.create_blog)

// read a blog
router.get("/blog/:blog_id", blogController.read_one_blog)

// find all blogs
router.get("/all", blogController.all_blogs)

// find all the blogs that belongs to the logged in users 
router.get("/my_blogs", authenticate, blogController.my_blogs)

// find blogs that belong to a certain user
router.get("/blog/author/:author_name",blogController.blog_by_author)

// find all the distinct authors 
router.get("/authors", blogController.authors)

// update a blog 
router.put("/blog/:blog_id", authenticate, blogController.update_blog)

// delete a blog 
router.delete("/blog/:blog_id", authenticate, blogController.delete_blog)

//testing 
//delete all blogs 
router.delete("/delete_all",blogController.delete_all_blogs)

module.exports = router
