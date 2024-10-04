
const Blog = require("../models/blogModel")


// save a blog to database
const create_blog = async (blog_data) => {
    const blog_post = new Blog(blog_data)
    const blog = await blog_post.save()
    return blog
}

// find a blog by its id 
const findBlogById = async (id) => {
    const blog = await Blog.findById(id)
    return blog
}

// find all blogs 
const findAllBlogs = async () => {
    const blogs = await Blog.find({})
    return blogs
}

// find blogs by some condition
const findBlogsByQuery = async( query ) => {
    const blogs = await Blog.find(query)
    return blogs
}

// update a blog
const updateBlog = async( id, update_data_obj) => {
    const blog = await Blog.findByIdAndUpdate(id,update_data_obj)
    return blog
}

// delete a blog 
const deleteBlogById = async (id) => {
    const blog = await Blog.findByIdAndDelete(id)
    return blog
}

module.exports = {
    create_blog,
    findBlogById,
    findAllBlogs,
    findBlogsByQuery,
    updateBlog,
    deleteBlogById
}