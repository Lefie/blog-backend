
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
                    .lean()
                    .then(blogs => blogs.sort((a, b) => new Date(b.date) - new Date(a.date)) )
    return blogs
}

// find blogs by some condition
const findBlogsByQuery = async( query ) => {
    const blogs = await Blog.find(query)
    return blogs
}

// find distinct authors 
const findAllAuthors = async() => {
    const authors = await Blog.distinct('author')
    return authors
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

// delete all the blogs 
const deleteAllBlogs = async() => {
   const deleted_blogs = await Blog.deleteMany({})
   console.log("delete all blogs")
   return deleted_blogs
}

module.exports = {
    create_blog,
    findBlogById,
    findAllBlogs,
    findBlogsByQuery,
    updateBlog,
    deleteBlogById,
    findAllAuthors,
    deleteAllBlogs
}