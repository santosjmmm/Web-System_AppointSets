<?php
session_start();

$conn = new mysqli("localhost", "root", "", "db_appsets");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Ensure user is logged in
if (!isset($_SESSION['patient_id'])) {
    header("Location: login.php");
    exit();
}

// Fetch user name
$patient_id = $_SESSION['patient_id'];

$stmt = $conn->prepare("SELECT name FROM tb_patient WHERE patient_id = ?");
$stmt->bind_param("i", $patient_id);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

// Handle form submit
if (isset($_POST['next'])) {

    $_SESSION['service'] = $_POST['service'];
    $_SESSION['dentist'] = $_POST['dentist'];

    header("Location: step2.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>C'Smiles Dental Center - Step 1</title>
	<link rel="stylesheet" href="patient_dash.css">
    
</head>
<body>
<header>
    <div class="brand">
        <div class="logo-circle"><img src="logo.jpg" alt="Logo"></div>
        <div class="clinic-title">C'Smiles<span>Dental Center</span></div>
    </div>
    <nav><a href="#">Home</a><a href="#">Services</a><a href="#">Contact</a><a href="login.php" class="logout-link">Log out</a></nav>
</header>
<div class="page-wrapper">
    <aside>
        
        <div class="user-section">
            <div class="user-name">
    <?php echo isset($user['name']) ? htmlspecialchars($user['name']) : 'Guest'; ?>
</div>
            <div class="avatar-circle">👤</div>
        </div>
        
        <a href="step1.html" class="nav-item active">
            <span>💼</span> Book Appointment
        </a>
        
        <a href="appointments.php" class="nav-item">
            <span>📅</span> Appointments
        </a>

        <a href="records.html" class="nav-item">
            <span>📂</span> Records
        </a>

        <a href="rewards.html" class="nav-item">
            <span>⭐</span> Reward Points
        </a>
    </aside>

    <div class="main-content-area">
        <main>
           <form method="POST">
                <div class="stepper-head">
                    <span style="text-decoration: underline;">Select Service</span>
                    <span class="inactive">Set date and time</span>
                    <span class="inactive">Confirm your details</span>
                    <span class="inactive">Confirm appointment</span>
                </div>
                <h2>What's your plan today?</h2>
                <div class="divider"></div>
                <div class="pill-grid">
                    <label class="pill-option"><input type="radio" name="service" value="Cleaning"><div class="pill-label">Cleaning</div></label>
                    <label class="pill-option"><input type="radio" name="service" value="Restorative" ><div class="pill-label">Restorative</div></label>
                    <label class="pill-option"><input type="radio" name="service" value="Extraction" ><div class="pill-label">Extraction</div></label>
                    <label class="pill-option"><input type="radio" name="service" value="Orthodontics" ><div class="pill-label">Orthodontics</div></label>
                    <label class="pill-option"><input type="radio" name="service" value="Endodontics" ><div class="pill-label">Endodontics</div></label>
                    <label class="pill-option"><input type="radio" name="service" value="Dentures" ><div class="pill-label">Dentures</div></label>
                </div>
                <h2>Who's your Dentist?</h2>
                <div class="divider"></div>
                <div class="dentist-grid">
                    <label class="pill-option">
                        <input type="radio" name="dentist" value="Dra. Camaclang" ><div class="pill-label">Dra. Camaclang</div></label>

                        <label class="pill-option">
                        <input type="radio" name="dentist" value="Dr. Calimbahin"><div class="pill-label">Dr. Calimbahin</div></label>
                </div>

                <!-- TOP ERROR -->
                    <div id="errorTop" class="error-box"></div>

                    <div class="footer-action">
                        <button type="submit" name="next" class="next-btn">Next</button>
                    </div>
            </form>
        </main>
    </div>
</div>
<script src="patient_dash.js"></script>
</body>
</html>