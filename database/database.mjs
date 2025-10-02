import sqlite3 from 'sqlite3';
import { DB_FILE } from '../config.mjs';

const db = new sqlite3.Database(DB_FILE);

export function initDB() {
    db.run(`CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        short TEXT UNIQUE,
        long TEXT,
        secret TEXT,
        created DATETIME DEFAULT CURRENT_TIMESTAMP,
        visit INTEGER DEFAULT 0
    )`);
}

export function countLinks(callback) {
    db.get('SELECT COUNT(*) as count FROM links', (err, row) => {
        callback(err, row ? row.count : 0);
    });
}

export function createLink(long, short, secret, callback) {
    db.run('INSERT INTO links (long, short, secret) VALUES (?, ?, ?)', [long, short, secret], function(err) {
        callback(err, this.lastID);
    });
}

export function getLink(short, callback) {
    db.get('SELECT short, long, created, visit FROM links WHERE short = ?', [short], (err, row) => {
        callback(err, row);
    });
}

export function incrementVisit(short, callback) {
    db.run('UPDATE links SET visit = visit + 1 WHERE short = ?', [short], function(err) {
        callback(err, this.changes);
    });
}

export function getStatus(short, callback) {
    db.get('SELECT created, visit FROM links WHERE short = ?', [short], (err, row) => {
        callback(err, row);
    });
}

export function getAllLinks(callback) {
    db.all('SELECT short, long FROM links ORDER BY id DESC LIMIT 20', (err, rows) => {
        callback(err, rows);
    });
}

export function clearLinks(callback) {
    db.run('DELETE FROM links', function(err) {
        callback(err);
    });
}

export function deleteLink(short, secret, callback) {
    db.get('SELECT secret FROM links WHERE short = ?', [short], (err, row) => {
        if (err) return callback(err, null);
        if (!row) return callback(null, { found: false });
        if (row.secret !== secret) return callback(null, { found: true, authenticated: false });
        
        db.run('DELETE FROM links WHERE short = ?', [short], function(err) {
            callback(err, { found: true, authenticated: true, deleted: this.changes > 0 });
        });
    });
}