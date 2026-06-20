<?php
// ============================================================
//  api/wishes.php – API Ucapan & Kehadiran
//  GET  → ambil semua ucapan (dengan pagination)
//  POST → kirim ucapan baru
// ============================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// ── GET: Ambil daftar ucapan ─────────────────────────────────
if ($method === 'GET') {
    try {
        $pdo = getDB();

        $page     = max(1, (int)($_GET['page'] ?? 1));
        $perPage  = 7;
        $offset   = ($page - 1) * $perPage;

        // Total data
        $total = (int)$pdo->query("SELECT COUNT(*) FROM wishes")->fetchColumn();

        // Data halaman ini
        $stmt = $pdo->prepare(
            "SELECT nama, kehadiran, pesan,
                    DATE_FORMAT(tanggal, '%d/%m/%Y, %H.%i') AS tanggal
             FROM wishes
             ORDER BY tanggal DESC
             LIMIT :limit OFFSET :offset"
        );
        $stmt->bindValue(':limit',  $perPage, PDO::PARAM_INT);
        $stmt->bindValue(':offset', $offset,  PDO::PARAM_INT);
        $stmt->execute();
        $wishes = $stmt->fetchAll();

        // Hitung kehadiran
        $countStmt = $pdo->query(
            "SELECT
                SUM(kehadiran = 'Hadir')       AS hadir,
                SUM(kehadiran = 'Tidak Hadir') AS tidak
             FROM wishes"
        );
        $counts = $countStmt->fetch();

        echo json_encode([
            'success'     => true,
            'data'        => $wishes,
            'total'       => $total,
            'total_pages' => (int)ceil($total / $perPage),
            'page'        => $page,
            'hadir'       => (int)$counts['hadir'],
            'tidak'       => (int)$counts['tidak'],
        ]);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Gagal mengambil data.']);
    }
    exit;
}

// ── POST: Simpan ucapan baru ─────────────────────────────────
if ($method === 'POST') {
    try {
        $body = json_decode(file_get_contents('php://input'), true);

        $nama      = trim($body['nama']      ?? '');
        $kehadiran = trim($body['kehadiran'] ?? '');

        // Map nilai dari HTML ("hadir"/"tidak") ke format DB ("Hadir"/"Tidak Hadir")
        $kehadiranMap = ['hadir' => 'Hadir', 'tidak' => 'Tidak Hadir'];
        $kehadiran = $kehadiranMap[$kehadiran] ?? $kehadiran;
        $pesan     = trim($body['pesan']     ?? '');

        // Validasi
        $errors = [];
        if ($nama === '')                                        $errors[] = 'Nama wajib diisi.';
        if (mb_strlen($nama) > 100)                              $errors[] = 'Nama terlalu panjang.';
        if (!in_array($kehadiran, ['Hadir', 'Tidak Hadir']))     $errors[] = 'Kehadiran tidak valid.';
        if ($pesan === '')                                       $errors[] = 'Pesan wajib diisi.';
        if (mb_strlen($pesan) > 1000)                            $errors[] = 'Pesan terlalu panjang.';

        if (!empty($errors)) {
            http_response_code(422);
            echo json_encode(['success' => false, 'message' => implode(' ', $errors)]);
            exit;
        }

        $pdo  = getDB();
        $stmt = $pdo->prepare(
            "INSERT INTO wishes (nama, kehadiran, pesan) VALUES (:nama, :kehadiran, :pesan)"
        );
        $stmt->execute([
            ':nama'      => $nama,
            ':kehadiran' => $kehadiran,
            ':pesan'     => $pesan,
        ]);

        echo json_encode(['success' => true, 'message' => 'Ucapan berhasil disimpan!']);

    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Gagal menyimpan ucapan.']);
    }
    exit;
}

// Method lain tidak diizinkan
http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed.']);