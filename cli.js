const { Sequelize, DataTypes } = require('sequelize');

// Connect to the database
const sequelize = new Sequelize('blogapp', 'postgres', 'sql#1234', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

// Define the Blogs model
const Blog = sequelize.define('Blog', {
  author: {
    type: DataTypes.TEXT,
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'blogs',
  timestamps: false,
});

// Fetch and print blogs
async function printBlogs() {
  try {
    await sequelize.authenticate();
    const blogs = await Blog.findAll();
    blogs.forEach(blog => {
      console.log(`${blog.author}: '${blog.title}', ${blog.likes} likes`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
  } finally {
    await sequelize.close();
  }
}

printBlogs();
