<?php
header("Access-Control-Allow-Origin: http://localhost:5184");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

$conn = new mysqli("localhost", "root", "", "db_appsets");
if ($conn->connect_error) {
    echo json_encode(["success" => false, "message" => "Connection failed"]);
    exit();
}

function uploadImage($file) {
    if(isset($file) && $file['error'] === 0){
        $targetDir = "../../Frontend/public/uploads/"; 
        if(!is_dir($targetDir)) mkdir($targetDir, 0777, true);
        $imageName = time() . "_" . basename($file["name"]);
        if(move_uploaded_file($file["tmp_name"], $targetDir . $imageName)) return $imageName;
    }
    return "";
}

// GET: Combine both tables for the React state
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $services = $conn->query("SELECT *, 'regular' as service_type FROM tb_service")->fetch_all(MYSQLI_ASSOC);
    $rewards = $conn->query("SELECT reward_id as service_id, reward_name as service_name, reward_desc as description, reward_image as service_image, points as points_required, reward_duration as duration, status, 'points' as service_type FROM tb_rewards")->fetch_all(MYSQLI_ASSOC);
    
    echo json_encode(["success" => true, "services" => array_merge($services, $rewards)]);
    exit();
}

$input = json_decode(file_get_contents("php://input"), true);
$action = $_POST['action'] ?? $input['action'] ?? '';

if ($action === 'add' || $action === 'update') {
    $type = $_POST['service_type'] ?? 'regular';
    $img = uploadImage($_FILES['service_image'] ?? null);
    
    if ($type === 'regular') {
        if ($action === 'add') {
            $stmt = $conn->prepare("INSERT INTO tb_service (service_name, description, price, duration, service_image, status) VALUES (?, ?, ?, ?, ?, 'Available')");
            $stmt->bind_param("ssdss", $_POST['service_name'], $_POST['description'], $_POST['price'], $_POST['duration'], $img);
        } else {
            $id = $_POST['service_id'];
            $sql = $img ? "UPDATE tb_service SET service_name=?, description=?, price=?, duration=?, service_image=? WHERE service_id=?" : "UPDATE tb_service SET service_name=?, description=?, price=?, duration=? WHERE service_id=?";
            $stmt = $conn->prepare($sql);
            $img ? $stmt->bind_param("ssdssi", $_POST['service_name'], $_POST['description'], $_POST['price'], $_POST['duration'], $img, $id) : $stmt->bind_param("ssdsi", $_POST['service_name'], $_POST['description'], $_POST['price'], $_POST['duration'], $id);
        }
    } else {
        // Mapping for tb_rewards
        if ($action === 'add') {
            $stmt = $conn->prepare("INSERT INTO tb_rewards (reward_name, reward_desc, points, reward_duration, reward_image, status) VALUES (?, ?, ?, ?, ?, 'Active')");
            $stmt->bind_param("ssiss", $_POST['service_name'], $_POST['description'], $_POST['points_required'], $_POST['duration'], $img);
        } else {
            $id = $_POST['service_id'];
            $sql = $img ? "UPDATE tb_rewards SET reward_name=?, reward_desc=?, points=?, reward_duration=?, reward_image=? WHERE reward_id=?" : "UPDATE tb_rewards SET reward_name=?, reward_desc=?, points=?, reward_duration=? WHERE reward_id=?";
            $stmt = $conn->prepare($sql);
            $img ? $stmt->bind_param("ssissi", $_POST['service_name'], $_POST['description'], $_POST['points_required'], $_POST['duration'], $img, $id) : $stmt->bind_param("ssisi", $_POST['service_name'], $_POST['description'], $_POST['points_required'], $_POST['duration'], $id);
        }
    }
    
    if ($stmt->execute()) echo json_encode(["success" => true, "message" => "Success!"]);
    else echo json_encode(["success" => false, "message" => $stmt->error]);
    exit();
}

if ($action === 'toggle_status') {
    $id = intval($input['service_id']);
    $type = $input['service_type'];
    $newStatus = (strtolower($input['current_status']) === 'available' || strtolower($input['current_status']) === 'active') ? 'Unavailable' : 'Available';
    
    if ($type === 'regular') {
        $stmt = $conn->prepare("UPDATE tb_service SET status=? WHERE service_id=?");
    } else {
        $newStatus = ($newStatus === 'Available') ? 'Active' : 'Deactive';
        $stmt = $conn->prepare("UPDATE tb_rewards SET status=? WHERE reward_id=?");
    }
    
    $stmt->bind_param("si", $newStatus, $id);
    $stmt->execute();
    echo json_encode(["success" => true]);
    exit();
}
?>