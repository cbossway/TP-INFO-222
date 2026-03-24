const database = require('../config/database');

class Article {
  constructor(data = {}) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.author = data.author;
    this.date = data.date;
    this.category = data.category;
    this.tags = data.tags;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static async create(articleData) {
    const { title, content, author, date, category, tags } = articleData;
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
    
    const sql = `
      INSERT INTO articles (title, content, author, date, category, tags)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const params = [title, content, author, date, category, tagsString];
    
    try {
      const result = await database.run(sql, params);
      return await Article.findById(result.id);
    } catch (error) {
      throw new Error('Error creating article: ' + error.message);
    }
  }

  static async findAll(filters = {}) {
    let sql = 'SELECT * FROM articles WHERE 1=1';
    const params = [];

    if (filters.category) {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.author) {
      sql += ' AND author = ?';
      params.push(filters.author);
    }

    if (filters.date) {
      sql += ' AND date = ?';
      params.push(filters.date);
    }

    sql += ' ORDER BY created_at DESC';

    try {
      const rows = await database.all(sql, params);
      return rows.map(row => new Article(row));
    } catch (error) {
      throw new Error('Error fetching articles: ' + error.message);
    }
  }

  static async findById(id) {
    const sql = 'SELECT * FROM articles WHERE id = ?';
    
    try {
      const row = await database.get(sql, [id]);
      return row ? new Article(row) : null;
    } catch (error) {
      throw new Error('Error finding article: ' + error.message);
    }
  }

  static async search(query) {
    const sql = `
      SELECT * FROM articles 
      WHERE title LIKE ? OR content LIKE ?
      ORDER BY created_at DESC
    `;
    const searchTerm = `%${query}%`;
    
    try {
      const rows = await database.all(sql, [searchTerm, searchTerm]);
      return rows.map(row => new Article(row));
    } catch (error) {
      throw new Error('Error searching articles: ' + error.message);
    }
  }

  async update(updateData) {
    const { title, content, author, date, category, tags } = updateData;
    const tagsString = Array.isArray(tags) ? tags.join(',') : tags;
    
    const sql = `
      UPDATE articles 
      SET title = ?, content = ?, author = ?, date = ?, category = ?, tags = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;
    
    const params = [title, content, author, date, category, tagsString, this.id];
    
    try {
      const result = await database.run(sql, params);
      if (result.changes === 0) {
        throw new Error('Article not found');
      }
      return await Article.findById(this.id);
    } catch (error) {
      throw new Error('Error updating article: ' + error.message);
    }
  }

  async delete() {
    const sql = 'DELETE FROM articles WHERE id = ?';
    
    try {
      const result = await database.run(sql, [this.id]);
      if (result.changes === 0) {
        throw new Error('Article not found');
      }
      return true;
    } catch (error) {
      throw new Error('Error deleting article: ' + error.message);
    }
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      content: this.content,
      author: this.author,
      date: this.date,
      category: this.category,
      tags: this.tags ? this.tags.split(',') : [],
      created_at: this.created_at,
      updated_at: this.updated_at
    };
  }
}

module.exports = Article;
