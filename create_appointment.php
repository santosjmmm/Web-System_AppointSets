<?php
header("Access-Control-Allow-Origin: http://localhost:5184");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$conn = new mysqli("localhost", "root", "", "db_appsets");

$json = file_get_contents('php://input');
$data = json_decode($json, true);

$patient_id = $data['patient_id'];
$service_name = $data['service'];
$dentist_name = $data['dentist'];
$date = $data['date']; 
$time = $data['time'];

// 1. Get service_id
$stmt = $conn->prepare("SELECT service_id FROM tb_service WHERE service_name=?");
$stmt->bind_param("s", $service_name);
$stmt->execute();
$s_res = $stmt->get_result()->fetch_assoc();
$service_id = $s_res['service_id'] ?? null;

// 2. Get dentist_id
$stmt = $conn->prepare("SELECT dentist_id FROM tb_dentist WHERE dentist_name=?");
$stmt->bind_param("s", $dentist_name);
$stmt->execute();
$d_res = $stmt->get_result()->fetch_assoc();
$dentist_id = $d_res['dentist_id'] ?? null;

if (!$service_id || !$dentist_id) {
    echo json_encode(["success" => false, "message" => "Invalid Service or Dentist"]);
    exit;
}

// 3. Insert Appointment
$stmt = $conn->prepare("INSERT INTO tb_appointment (date, time, patient_id, dentist_id, service_id) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("ssiii", $date, $time, $patient_id, $dentist_id, $service_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => $conn->error]);
}

$conn->close();
?>