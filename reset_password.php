<?php
header("Access-Control-Allow-Origin: http://localhost:5184");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$conn = new mysqli("localhost", "root", "", "db_appsets");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed"]);
    exit;
}

// Get the JSON data from React
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email']) && isset($data['new_password'])) {
    $email = trim($data['email']);
    $new_password = $data['new_password'];
    $hashed_password = password_hash($new_password, PASSWORD_DEFAULT);

    $tables = ["tb_admin", "tb_patient", "tb_dentist", "tb_staff"];
    $account_found = false;

    foreach ($tables as $table) {
        $stmt = $conn->prepare("SELECT email FROM $table WHERE email = ?");
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $res = $stmt->get_result();

        if ($res->num_rows > 0) {
            $account_found = true;
            $update = $conn->prepare("UPDATE $table SET password = ? WHERE email = ?");
            $update->bind_param("ss", $hashed_password, $email);
            
            if ($update->execute()) {
                echo json_encode(["success" => true, "message" => "Success! Password has been updated."]);
            } else {
                echo json_encode(["success" => false, "message" => "Database error."]);
            }
            exit; 
        }
    }

    if (!$account_found) {
        echo json_encode(["success" => false, "message" => "No account found with that email."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Invalid request."]);
}

$conn->close();
?>