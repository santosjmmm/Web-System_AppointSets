<?php
header("Access-Control-Allow-Origin: http://localhost:5184");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$conn = new mysqli("localhost", "root", "", "db_appsets");

if ($conn->connect_error) {
    // Return success: false so React handles it as an error
    echo json_encode(["success" => false, "message" => "Database Connection Failed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if ($_SERVER["REQUEST_METHOD"] === "POST" && $data) {
    $full_name = trim($data['full_name'] ?? '');
    $age = trim($data['age'] ?? '');
    $contact_number = trim($data['contact_num'] ?? '');
    $address = trim($data['address'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = trim($data['password'] ?? '');
    $confirm_password = trim($data['confirm_password'] ?? '');

    // Basic Validation
    if (empty($full_name) || empty($email) || empty($password)) {
        echo json_encode(["success" => false, "message" => "Required fields are missing!"]);
        exit();
    }

    if (strlen($password) < 8 || strlen($password) > 12) {
        echo json_encode(["success" => false, "message" => "Password must be 8-12 characters"]);
        exit();
    }

    // Check if email exists
    $check = $conn->prepare("SELECT patient_id FROM tb_patient WHERE email = ?");
    $check->bind_param("s", $email);
    $check->execute();
    $check->store_result();

    if ($check->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Email is already registered!"]);
    } else {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Note: Using "s" for age if it's a varchar, change to "i" if it's an int in DB
        $stmt = $conn->prepare("INSERT INTO tb_patient (name, age, contact_num, address, email, password) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssss", $full_name, $age, $contact_number, $address, $email, $hashed_password);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Registration successful!"]);
        } else {
            // This will tell you if the SQL itself failed
            echo json_encode(["success" => false, "message" => "Registration failed: " . $stmt->error]);
        }
        $stmt->close();
    }
    $check->close();
}
$conn->close();
?>