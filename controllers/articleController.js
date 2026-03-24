const { body, param, query, validationResult } = require('express-validator');
const Article = require('../models/Article');

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array()
    });
  }
  next();
};

// Create article validation
const createArticleValidation = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('content')
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 1 })
    .withMessage('Content cannot be empty'),
  body('author')
    .notEmpty()
    .withMessage('Author is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('category')
    .notEmpty()
    .withMessage('Category is required')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.some(tag => typeof tag !== 'string')) {
        throw new Error('All tags must be strings');
      }
      return true;
    })
];

// Update article validation
const updateArticleValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer'),
  body('title')
    .optional()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be between 1 and 255 characters'),
  body('content')
    .optional()
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ min: 1 })
    .withMessage('Content must have at least 1 character'),
  body('author')
    .optional()
    .notEmpty()
    .withMessage('Author cannot be empty')
    .isLength({ min: 1, max: 100 })
    .withMessage('Author must be between 1 and 100 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date'),
  body('category')
    .optional()
    .notEmpty()
    .withMessage('Category cannot be empty')
    .isLength({ min: 1, max: 50 })
    .withMessage('Category must be between 1 and 50 characters'),
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      if (tags.some(tag => typeof tag !== 'string')) {
        throw new Error('All tags must be strings');
      }
      return true;
    })
];

// ID validation
const idValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('ID must be a positive integer')
];

// Search validation
const searchValidation = [
  query('query')
    .notEmpty()
    .withMessage('Search query is required')
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters')
];

// Controller methods
const createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: article.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const getAllArticles = async (req, res) => {
  try {
    const { category, author, date } = req.query;
    const filters = {};
    
    if (category) filters.category = category;
    if (author) filters.author = author;
    if (date) filters.date = date;

    const articles = await Article.findAll(filters);
    res.status(200).json({
      success: true,
      count: articles.length,
      data: articles.map(article => article.toJSON())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Article not found'
      });
    }

    res.status(200).json({
      success: true,
      data: article.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const updateArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Article not found'
      });
    }

    const updatedArticle = await article.update(req.body);
    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: updatedArticle.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Article not found'
      });
    }

    await article.delete();
    res.status(200).json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

const searchArticles = async (req, res) => {
  try {
    const { query } = req.query;
    const articles = await Article.search(query);
    
    res.status(200).json({
      success: true,
      count: articles.length,
      query: query,
      data: articles.map(article => article.toJSON())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: error.message
    });
  }
};

module.exports = {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  searchArticles,
  createArticleValidation,
  updateArticleValidation,
  idValidation,
  searchValidation,
  handleValidationErrors
};
