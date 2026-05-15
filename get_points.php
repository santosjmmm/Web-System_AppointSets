<?php
header("Access-Control-Allow-Origin: http://localhost:5184");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$conn = new mysqli("localhost", "root", "", "db_appsets");

if ($conn->connect_error) {
    die(json_encode([
        "success" => false,
        "message" => "Database connection failed"
    ]));
}

$patient_id = $_GET['patient_id'] ?? null;

if (!$patient_id) {
    echo json_encode([
        "success" => false,
        "message" => "Missing patient_id"
    ]);
    exit;
}

/*
|--------------------------------------------------------------------------
| CHANGE 'points' TO YOUR REAL COLUMN NAME IF DIFFERENT
|--------------------------------------------------------------------------
*/
$stmt = $conn->prepare("
    SELECT points 
    FROM tb_patient 
    WHERE patient_id = ?
");

$stmt->bind_param("i", $patient_id);
$stmt->execute();

$result = $stmt->get_result()->fetch_assoc();

echo json_encode([
    "success" => true,
    "points" => $result['points'] ?? 0
]);

$stmt->close();
$conn->close();
?>