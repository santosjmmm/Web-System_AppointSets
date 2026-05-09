<?php
// Change 5183 to 5184 to match your Vite terminal
// 1. Specify the exact origin (do not use *)
header("Access-Control-Allow-Origin: http://localhost:5184");

// 2. Add this line to allow credentials (cookies/sessions)
header("Access-Control-Allow-Credentials: true");

header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 3. IMPORTANT: Only call session_start() ONCE
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}
// ===== READ JSON =====
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// ===== VALIDATE INPUT =====
if (!is_array($data)) {
    echo json_encode(["success" => false, "message" => "Invalid JSON"]);
    exit();
}

$email = isset($data['email']) ? trim($data['email']) : '';
$password = isset($data['password']) ? trim($data['password']) : '';

if ($email === '' || $password === '') {
    echo json_encode(["success" => false, "message" => "Email and password are required"]);
    exit();
}

// ===== LOGIN ATTEMPTS =====
$_SESSION['login_attempts'] = $_SESSION['login_attempts'] ?? 0;
$_SESSION['lock_time'] = $_SESSION['lock_time'] ?? 0;

$cooldown = 30;

if ($_SESSION['login_attempts'] >= 3) {
    $elapsed = time() - $_SESSION['lock_time'];
    $remaining_time = $cooldown - $elapsed;

    if ($remaining_time > 0) {
        echo json_encode([
            "success" => false,
            "message" => "Too many attempts. Try again in $remaining_time seconds."
        ]);
        exit();
    } else {
        $_SESSION['login_attempts'] = 0;
        $_SESSION['lock_time'] = 0;
    }
}

// ===== DATABASE =====
$conn = new mysqli("localhost", "root", "", "db_appsets");

if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Database connection failed"]);
    exit();
}

$conn->set_charset("utf8mb4");

// ===== TABLES =====
$tables = [
    ["table" => "tb_admin", "id" => "admin_id", "role" => "admin"],
    ["table" => "tb_patient", "id" => "patient_id", "role" => "patient"],
    ["table" => "tb_dentist", "id" => "dentist_id", "role" => "dentist"],
    ["table" => "tb_staff", "id" => "staff_id", "role" => "staff"]
];

// ===== LOGIN CHECK =====
foreach ($tables as $t) {
    $stmt = $conn->prepare("SELECT * FROM {$t['table']} WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // ... inside your foreach loop, under password_verify ...

if (password_verify($password, $user['password'])) {

    // ✅ SUCCESS
    $_SESSION['login_attempts'] = 0;
    $_SESSION['lock_time'] = 0;
    $_SESSION['role'] = $t['role'];
    $_SESSION[$t['id']] = $user[$t['id']];

    // UPDATED BLOCK BELOW:
    echo json_encode([
        "success" => true,
        "role" => $t['role'],
        "name" => $user['name'],       // 👈 Add this: Sends the name to React
        "patient_id" => $user[$t['id']] // 👈 Add this: Sends the ID to React
    ]);

} else {
// ... rest of the code
            // ❌ WRONG PASSWORD
            $_SESSION['login_attempts']++;

            if ($_SESSION['login_attempts'] >= 3) {
                $_SESSION['lock_time'] = time();
            }

            echo json_encode([
                "success" => false,
                "message" => "Incorrect password"
            ]);
        }

        $stmt->close();
        $conn->close();
        exit();
    }

    $stmt->close();
}

// ❌ EMAIL NOT FOUND
echo json_encode([
    "success" => false,
    "message" => "No account found"
]);

$conn->close();
?>