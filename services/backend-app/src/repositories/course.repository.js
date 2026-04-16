const pool = require('../config/db');

const CourseRepository = {
    findAll: async (searchTerm) => {
        let query = 'SELECT * FROM courses';
        let values = [];
        if (searchTerm) {
            query += ` WHERE course_name ILIKE $1 OR course_code ILIKE $1 OR lecturer_name ILIKE $1`;
            values.push(`%${searchTerm}%`);
        }
        query += ' ORDER BY id ASC';
        const result = await pool.query(query, values);
        return result.rows;
    },
    findById: async (id) => {
        const result = await pool.query('SELECT * FROM courses WHERE id = $1', [id]);
        return result.rows[0];
    }
};
module.exports = CourseRepository;