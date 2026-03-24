const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/articleController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Article:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - author
 *         - date
 *         - category
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated id of the article
 *         title:
 *           type: string
 *           description: The title of the article
 *         content:
 *           type: string
 *           description: The content of the article
 *         author:
 *           type: string
 *           description: The author of the article
 *         date:
 *           type: string
 *           format: date
 *           description: The publication date of the article
 *         category:
 *           type: string
 *           description: The category of the article
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: The tags associated with the article
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The creation timestamp of the article
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The last update timestamp of the article
 *       example:
 *         id: 1
 *         title: Getting Started with Node.js
 *         content: This is a comprehensive guide to Node.js development...
 *         author: John Doe
 *         date: 2026-03-18
 *         category: Technology
 *         tags: ["nodejs", "javascript", "backend"]
 *         created_at: 2026-03-18T10:00:00.000Z
 *         updated_at: 2026-03-18T10:00:00.000Z
 */

/**
 * @swagger
 * /api/articles:
 *   post:
 *     summary: Create a new article
 *     tags: [Articles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - author
 *               - date
 *               - category
 *             properties:
 *               title:
 *                 type: string
 *                 example: Getting Started with Node.js
 *               content:
 *                 type: string
 *                 example: This is a comprehensive guide to Node.js development...
 *               author:
 *                 type: string
 *                 example: John Doe
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-18
 *               category:
 *                 type: string
 *                 example: Technology
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["nodejs", "javascript", "backend"]
 *     responses:
 *       201:
 *         description: Article created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Article created successfully
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.post('/', createArticleValidation, handleValidationErrors, createArticle);

/**
 * @swagger
 * /api/articles:
 *   get:
 *     summary: Get all articles (with optional filtering)
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by date (YYYY-MM-DD format)
 *     responses:
 *       200:
 *         description: List of articles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllArticles);

/**
 * @swagger
 * /api/articles/search:
 *   get:
 *     summary: Search articles by title or content
 *     tags: [Articles]
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query to find in title or content
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 query:
 *                   type: string
 *                   example: Node.js
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Article'
 *       400:
 *         description: Validation error (query parameter is required)
 *       500:
 *         description: Internal server error
 */
router.get('/search', searchValidation, handleValidationErrors, searchArticles);

/**
 * @swagger
 * /api/articles/{id}:
 *   get:
 *     summary: Get a single article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', idValidation, handleValidationErrors, getArticleById);

/**
 * @swagger
 * /api/articles/{id}:
 *   put:
 *     summary: Update an article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Updated Article Title
 *               content:
 *                 type: string
 *                 example: Updated article content...
 *               author:
 *                 type: string
 *                 example: Jane Doe
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2026-03-19
 *               category:
 *                 type: string
 *                 example: Programming
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["updated", "programming"]
 *     responses:
 *       200:
 *         description: Article updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Article updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/Article'
 *       400:
 *         description: Validation error
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', updateArticleValidation, handleValidationErrors, updateArticle);

/**
 * @swagger
 * /api/articles/{id}:
 *   delete:
 *     summary: Delete an article by ID
 *     tags: [Articles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Article ID
 *     responses:
 *       200:
 *         description: Article deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Article deleted successfully
 *       404:
 *         description: Article not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', idValidation, handleValidationErrors, deleteArticle);

module.exports = router;
