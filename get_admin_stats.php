<?php
header("Access-Control-Allow-Origin: http://localhost:5184");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");
session_start();

// Database Connection
$conn = new mysqli("localhost", "root", "", "db_appsets");
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed"]);
    exit;
}

// 1. Get Admin Name
$admin_id = $_SESSION['admin_id'] ?? 1; // Fallback for testing
$admin_name = "Admin";
$name_query = $conn->prepare("SELECT name FROM tb_admin WHERE admin_id = ?");
$name_query->bind_param("i", $admin_id);
$name_query->execute();
$admin_name = $name_query->get_result()->fetch_assoc()['name'] ?? "Admin";

// 2. Fetch Stats
$total_patients = $conn->query("SELECT COUNT(*) as total FROM tb_patient")->fetch_assoc()['total'];

$today = date('Y-m-d');
$today_appointments = $conn->query("SELECT COUNT(*) as total FROM tb_appointment WHERE date = '$today'")->fetch_assoc()['total'];

$rev_query = $conn->query("SELECT SUM(s.price) as total FROM tb_appointment a JOIN tb_service s ON a.service_id = s.service_id WHERE a.status = 'Completed'");
$revenue = $rev_query->fetch_assoc()['total'] ?? 0;

// 3. Chart Data
$service_chart_query = $conn->query("SELECT s.service_name, COUNT(a.appointment_id) as count FROM tb_appointment a JOIN tb_service s ON a.service_id = s.service_id GROUP BY s.service_id LIMIT 4");
$service_labels = []; $service_counts = [];
while($row = $service_chart_query->fetch_assoc()){
    $service_labels[] = $row['service_name'];
    $service_counts[] = $row['count'];
}

echo json_encode([
    "admin_name" => $admin_name,
    "total_patients" => $total_patients,
    "today_appointments" => $today_appointments,
    "revenue" => $revenue,
    "chart_data" => [
        "labels" => $service_labels,
        "counts" => $service_counts
    ]
]);
?>