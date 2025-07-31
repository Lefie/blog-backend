const cookieSession = require("cookie-session")
const blogService = require("../services/blogService")
const formatted_date = require("../utils/processDate")

// creating a blog
const create_blog = async(req, res) => {
    try {
        const cookie = req.cookies['chocolate_cookie']
        console.log(cookie)
        // the input data
        const {title, content,img_url} = req.body
        const author = cookie.username
        const blog_data = {
            title : title,
            content : content,
            author: author,
            img_url: img_url
        }      
        console.log("blog data", blog_data)
        const blog = await blogService.create_blog(blog_data)
        console.log(blog)
        res.status(200).json(blog)
    }catch(error){
        return res.status(500).json({
            "msg":"error creating blog",
            "error":error
        })
    }
}

// read one blog by id
const read_one_blog = async(req,res) => {
    try {
        const blog_id = req.params.blog_id
        const blog = await blogService.findBlogById(blog_id)
        console.log("blog from read one blog",blog)
        return res.status(200).json(blog)
    }catch(error){
        return res.status(500).json({
            "msg":"error reading a blog",
            "error":error
        })
    }
}

// find all blogs
const all_blogs = async(req, res) => {
    try {
       const all_blogs = await blogService.findAllBlogs();
       console.log("all blogs ", all_blogs)
       return res.status(200).json(all_blogs)
    }catch(error){
        return res.status(500).json({
            "msg":"error retrieving all blogs",
            "error":error
        })
    }
}

// find all the blogs that belong to the logged in user
const my_blogs = async(req, res) => {
    try {
        const cookie = req.cookies["chocolate_cookie"]
        console.log("cookie from my blogs", cookie)
        const username = cookie.username
        const my_blogs = await blogService.findBlogsByQuery({author:username})
        res.status(200).json(my_blogs)
    }catch(error){
        res.status(500).json({
            "msg":"error retrieving blogs by logged in user",
            "error":error
        })
    }
}

// find blogs that belong to a certain author
const blog_by_author = async(req, res) => {
    try{
        const author_name = req.params.author_name
        console.log("backend", author_name)
        const blogs = await blogService.findBlogsByQuery({author:author_name})
        res.status(200).json(blogs)
    }catch(error){
        res.status(500).json({
            "msg":"error retrieving blogs by author",
            "error":error
        })
    }
}

// find all the authors
const authors = async(req, res) => {
    try {
        const authors = await blogService.findAllAuthors()
        
        res.status(200).json({authors})

    }catch(error){
        res.status(500).json({"error": error})
    }
}



// update a blg
const update_blog = async(req, res) => {
    try {
        // make sure that this blog's author is the logged-in user 
        const blog_id = req.params.blog_id
        const blog = await blogService.findBlogById(blog_id)
        const logged_in_user = req.cookies['chocolate_cookie'].username
        const author = blog.author
        console.log(logged_in_user, author)
        if (logged_in_user === author){
            const { title, content,img_url } = req.body
            const date = formatted_date()
            const updatedBlog = await blogService.updateBlog(blog_id,{title:title, content:content, updated_date:date,img_url:img_url})
            console.log("updated")
            res.status(200).json(updatedBlog)
        }else{
            res.status(500).json({"meesage":"update your own blog!"})
        }
    }catch(error){
        res.status(500).json({
            "msg":"error updating a blog",
            "error":error
        })
    }
}

//delete a blog
const delete_blog = async(req, res) => {
    try {
        const blog_id = req.params.blog_id
        const username = req.cookies['chocolate_cookie'].username
        const blog = await blogService.findBlogById(blog_id)
        const author = blog.author

        if(username === author){
            const deleted_one = await blogService.deleteBlogById(blog_id)
            res.status(200).json(deleted_one)
        } else {
            res.status(500).json({"message":"delete unsuccessfully. Are you trying to delete someone else's blog?"})
        }   

    }catch(error){
       
        res.status(500).json({
            "msg":"error deleting a blog",
            "error":error
        })
    }

}

//CAREFUL: delete all blogs 
const delete_all_blogs = async(req, res) => {
    try {
        const deleted_all_blogs = await blogService.deleteAllBlogs()
        if(delete_all_blogs){
           return res.status(200).json({"msg":"deletion successful"})
        }
        else {
            return res.status(500).json({"msg":"deletion unsuccessful"})
        }
    }catch(error) {
        res.status(500).json({
            "msg":`delete all error ${error}`
        })
    }
}


module.exports = {
    create_blog,
    read_one_blog,
    all_blogs,
    my_blogs,
    update_blog,
    blog_by_author,
    delete_blog,
    authors,
    delete_all_blogs
}