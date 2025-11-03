const Blog = require("../models/blogModel")
const mongoose = require("mongoose")
const path = require("path")
const path_to_env = path.join(__dirname, '../.env')
require('dotenv').config({path: path_to_env})
const mongo_uri = process.env.MONGO_URI

mongoose.connect(mongo_uri)
    .then(() => {
        console.log('Connected to DB')
    })
    .catch((error) => {
        console.log(error)
})


/*
const blogSchema = mongoose.Schema({
    title : {type:String, required: true},
    content: {type:String, required: true},
    updated_date : {type:Date},
    date: {type: Date, default:Date.now},
    author : {type:String, required:true},
    img_url : {type:String}
})

*/

const authors = [
    'lemon', 'meow', 'Elia', 'Leo', 'spiderman',
    'Luke', 'tyler', 'laura', 'lemonade', 'jack',
    'limon123', 'limon'];

const topics = [
    'Technology', 'Travel', 'Food', 'Fitness', 'Business',
    'Design', 'Photography', 'Music', 'Writing', 'Gaming',
    'Science', 'Health', 'Finance', 'Education', 'Lifestyle'
];

const titleTemplates = [
    'Getting Started with {topic}',
    'The Ultimate Guide to {topic}',
    '10 Tips for Better {topic}',
    'Why {topic} Matters in 2024',
    'A Beginner\'s Journey into {topic}',
    'Advanced {topic} Techniques',
    'The Future of {topic}',
    'How I Learned {topic} in 30 Days',
    'Common Mistakes in {topic}',
    'The Complete {topic} Roadmap',
    'Mastering {topic}: A Deep Dive',
    '{topic} Best Practices',
    'Understanding {topic} Fundamentals',
    'My Experience with {topic}',
    'Top 5 {topic} Tools',
    '{topic} for Beginners',
    'Breaking Down {topic}',
    'Real World {topic} Applications',
    '{topic} Trends to Watch',
    'Essential {topic} Resources'
];

const contentParagraphs = [
    'In this comprehensive guide, we explore the fundamental concepts that every practitioner should understand. The journey begins with understanding the core principles and gradually building upon them with practical examples.',
    
    'Through years of experience and continuous learning, I have discovered that success in this field requires dedication, patience, and a willingness to experiment. The key is to start small and progressively tackle more complex challenges.',
    
    'Many people struggle initially because they try to master everything at once. Instead, focus on one aspect at a time and build your skills incrementally. This approach has proven effective for countless individuals.',
    
    'The landscape has evolved significantly over recent years, with new tools and methodologies emerging regularly. Staying current requires active engagement with the community and continuous self-education.',
    
    'One of the most valuable lessons learned is the importance of fundamentals. While it may be tempting to jump into advanced topics, a solid foundation makes everything else easier to grasp.',
    
    'Real-world applications often differ from theoretical knowledge. Practice and hands-on experience are irreplaceable when it comes to truly understanding the nuances and complexities involved.',
    
    'Collaboration and knowledge sharing accelerate learning dramatically. Engaging with others who share similar interests provides fresh perspectives and helps overcome challenging obstacles.',
    
    'Setting clear goals and tracking progress helps maintain motivation during difficult phases. Celebrating small wins along the way makes the journey more enjoyable and sustainable.',
    
    'Resources are abundant today, but quality varies significantly. Curating a collection of reliable sources saves time and ensures you are learning accurate, up-to-date information.',
    
    'Ultimately, consistency matters more than intensity. Regular practice, even in small doses, yields better long-term results than sporadic bursts of activity followed by long breaks.'
];


const sampleImages = [
    'https://images.unsplash.com/photo-1499750310107-5fef28a66643', 
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d', 
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d', 
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c', 
    'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', 
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3',
    'https://images.unsplash.com/photo-1498050108023-c5249f4df085', 
];

// utility function - input an array, output a random value from array
function randomPickFromArray(arr){
    const randomIndex = Math.floor(Math.random() * arr.length)
    return arr[randomIndex]
}

function generateTitle() {
    const topic = randomPickFromArray(topics)
    const title = randomPickFromArray(titleTemplates)
    const new_title = title.replace("{topic}", topic)
    return new_title
}

function generateContent() {
    const num_of_sentences = Math.floor(Math.random() * (10 - 3 + 1)) + 3 // min: 3, max: 10
    
    let content = ""
    for (let i = 0; i < num_of_sentences; i ++) {
        content += randomPickFromArray(contentParagraphs)
        content += "\n"
    }
    return content 
}

function generateDate() {
    // for year - between 2023-2025
    const year = Math.floor(Math.random() * (2025 - 2023 + 1 )) + 2023
    let month = Math.floor(Math.random() * (12 - 1 + 1)) + 1 // month between 1 and 12
    let day = Math.floor(Math.random() * 28 - 1 + 1 ) + 1 // date from 1 - 28
    let date_string = `${year}-${month>=10?month:"0"+month}-${day>=10?day:"0"+day}`
    const new_date = new Date(date_string)
    return new_date
}

function generateAuthor() {
    const author = randomPickFromArray(authors)
    return author 
}

function generateImgUrl(){
    const img_url = randomPickFromArray(sampleImages)
    return img_url
}


// this function create blog data necessary 
function generateBlog() {
    const title = generateTitle()
    const content = generateContent()
    const date = generateDate()
    const author = generateAuthor()
    const img_url = generateImgUrl()

    const data = {title:title, content:content, date:date,author:author, img_url:img_url}
    
    return data 
}

// this function create blogs by the number of count
async function createBlogs(count){

    let blogs = []

    for (let i = 0; i < count; i ++) {
        const blog = generateBlog()
        blogs.push(blog)
    }
    await Blog.insertMany(blogs)

    console.log("inserted!")

}

// createBlogs(800)

async function pagination_test(page = 1, limit = 10) {
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

    console.log(resp_data)
    return resp_data
}
pagination_test(12)





