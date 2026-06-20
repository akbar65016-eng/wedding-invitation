<?php
// ============================================================
//  db.php – Koneksi Database
//  ⚠️  FILE INI RAHASIA – JANGAN di-commit ke GitHub!
//  
//  Cara pakai:
//  1. Copy file ini → simpan sebagai: api/db.php
//  2. Isi nilai DB_USER dan DB_PASS sesuai server kamu
//  3. Pastikan api/db.php sudah ada di .gitignore
// ============================================================

define('DB_HOST', 'localhost');
define('DB_NAME', 'digital_invitation');
define('DB_USER', 'isi_username_mysql');   // ← ganti ini
define('DB_PASS', 'isi_password_mysql');   // ← ganti ini
define('DB_CHARSET', 'utf8mb4');

function getDB(): PDO {
    static $pdo = null;
    if ($pdo === null) {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    }
    return $pdo;
}