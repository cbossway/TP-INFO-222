const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const articleRoutes = require('./routes/articles');
const database = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Blog API',
      version: '1.0.0',
      description: 'API Backend for a simple blog application',
      contact: {
        name: 'MATAGNE DASSE PRESLIE CHANEL',
        email: 'preslie.matagne@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server'
      }
    ]
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/articles', articleRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Blog API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found'
  });
});

// Initialize database and start server
database.initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Blog API server is running on port ${PORT}`);
    console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
  });
}).catch(err => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});

module.exports = app;
