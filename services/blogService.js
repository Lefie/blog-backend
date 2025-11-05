
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
    const blogs = await Blog.find({}).sort({'date':-1})
    return blogs
}

// find blogs by their page 
const findBlogsByPage = async(page = 1, limit = 10) => {
    const skip = (page - 1) * limit
    const blog_data = await Blog.find()
                        .sort({date:-1})
                        .skip(skip)
                        .limit(limit)
        
    const totalBlogs = await Blog.countDocuments();

    const resp_data = {
        blog_data, 
        pagination: {
            currentPage: page, 
            blogsPerPage: limit,
            totalPages: Math.ceil(totalBlogs / limit),
            totalBlogs:totalBlogs,
            hasNextPage: page * limit < totalBlogs,
            hasPrevPage: page > 1,
            nextPage: page * limit < totalBlogs ? page + 1 : null,
            prevPage: page > 1 ? page - 1 : null
        }
    }

    return resp_data
}

// find blogs by some condition
const findBlogsByQuery = async( query ) => {
    const blogs = await Blog.find(query).sort({'date':-1})
    return blogs
}

const findBlogsByQueryPaginated = async (query, page = 1, limit = 10) => {
    const skip = (page - 1) * limit
    const blogs = await Blog.find(query).sort({'date':-1}).skip(skip).limit(limit)
    const totalBlogsByAuthor = await Blog.countDocuments(query)
    console.log(totalBlogsByAuthor)
    
    const resp_data = {
        blog_data:blogs,
        pagination: {
            currentPage: page, 
            blogsPerPage: limit, 
            totalPages: Math.ceil(totalBlogsByAuthor / limit),
            hasNextPage: page * limit < totalBlogsByAuthor,
            hasPrevPage: page > 1,
            nextPage: page * limit < totalBlogsByAuthor ? page + 1: null,
            prevPage: page > 1 ? page - 1: null
        }
    }
    
    return resp_data

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
    deleteAllBlogs,
    findBlogsByPage,
    findBlogsByQueryPaginated
}