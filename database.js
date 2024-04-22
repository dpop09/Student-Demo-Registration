import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

const dbOperations = {
    getAllRegisteredStudents: async function() {
        const [rows] = await pool.query(`
        SELECT * FROM registered_students
        `)
        return rows
    },    
    registerStudent: async function(id, fname, lname, project, email, phone_number, timeslot) {
        const [result] = await pool.query(`
        INSERT INTO registered_students (ID, fname, lname, project_name, email_address, phone_number, timeslot)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [id, fname, lname, project, email, phone_number, timeslot])
        return result
    },
    getCount: async function(timeslot) {
        const [[row]] = await pool.query(`
        SELECT COUNT(*) FROM registered_students
        WHERE timeslot = ?
        `, [timeslot])
        return row['COUNT(*)']
    },
    isIdUnique: async function(id) {
        const [[row]] = await pool.query(`
        SELECT COUNT(*) FROM registered_students
        WHERE ID = ?
        `, [id])
        if (row['COUNT(*)'] >= 1)
            return false
        return true
    },
    deleteStudent: async function(id) {
        const [result] = await pool.query(`
        DELETE FROM registered_students
        WHERE ID = ?
        `, [id])
        return result
    }
}

export { dbOperations }