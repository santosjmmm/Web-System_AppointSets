<?php
session_start();

$conn = new mysqli("localhost", "root", "", "db_appsets");
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$patient_id = $_SESSION['patient_id'] ?? 0;

$appointments = [];

$stmt = $conn->prepare("SELECT * FROM tb_appointment WHERE patient_id = ?");
$stmt->bind_param("i", $patient_id);
$stmt->execute();
$result = $stmt->get_result();

while ($row = $result->fetch_assoc()) {
    $date = date("j", strtotime($row['date']));
    $appointments[$date][] = $row;
}

$stmt->close();
$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>C'Smiles Dental Center - Your Appointments</title>
    <link rel="stylesheet" href="appointments.css">
</head>
<body>

<header>
    <div class="brand">
        <div class="logo-circle"><img src="logo.jpg" alt="Logo"></div>
        <div class="clinic-title">c'smiles<span>Dental Center</span></div>
    </div>
    <nav><a href="#">Home</a><a href="#">Services</a><a href="#">Contact</a><a href="login.html" class="logout-link">Log out</a></nav>
</header>

<div class="page-wrapper">
    <aside>
        <div class="menu-btn">☰</div>
        <div class="user-section">
            <div class="user-name">John Michael S.</div>
            <div class="avatar-circle">👤</div>
        </div>
        
        <a href="patient_dash.php" class="nav-item">
            <span>💼</span> Book Appointment
        </a>
        
        <a href="appointments.html" class="nav-item active">
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
            <h1>Your Appointments</h1>
            <div class="month-header"><span class="month-name">JULY</span><span class="year-name">2025</span></div>
            <table class="appointments-calendar">
                <thead>
                    <tr><th class="sun">Sunday</th><th class="mon">Monday</th><th class="tue">Tuesday</th><th class="wed">Wednesday</th><th class="thu">Thursday</th><th class="fri">Friday</th><th class="sat">Saturday</th></tr>
                </thead>
                <tbody>
<?php
$days_in_month = 31;
$day = 1;

for ($row = 0; $row < 5; $row++) {
    echo "<tr>";

    for ($col = 0; $col < 7; $col++) {

        echo "<td>";

        if ($day <= $days_in_month) {

            echo "<div class='day-number'>$day</div>";

            if (isset($appointments[$day])) {
                foreach ($appointments[$day] as $apt) {

                    $service = htmlspecialchars($apt['service_id']);
                    $dentist = htmlspecialchars($apt['dentist_id']);
                    $date = htmlspecialchars($apt['date']);
                    $time = htmlspecialchars($apt['time']);

                    echo "
                    <div class='apt-entry'
                        onclick='openModal(
                            " . json_encode($service) . ",
                            " . json_encode($dentist) . ",
                            " . json_encode($date) . ",
                            " . json_encode($time) . "
                        )'>
                        <strong>$service</strong><br>
                        " . date("h:i A", strtotime($time)) . "<br>
                        $dentist
                    </div>";
                }
            }

            $day++;
        }

        echo "</td>";
    }

    echo "</tr>";
}
?>
</tbody>
            </table>
        </main>
    </div>
</div>

<div id="appointmentModal" class="modal-overlay">
    <div class="modal-content">
        <h1>Your Appointments</h1>
        <div class="details-container">
            <h3>Appointment Details:</h3>
            <div class="detail-row"><span class="label">Name:</span><span class="val">John Michael S.</span></div>
            <div class="detail-row"><span class="label">Age:</span><span class="val">21</span></div>
            <div class="detail-row"><span class="label">Address:</span><span class="val">Camella Homes</span></div>
            <div class="detail-row"><span class="label">Contact No:</span><span class="val">09xxxxxxx</span></div>
            <div class="detail-row"><span class="label">Email:</span><span class="val">jm@gmail.com</span></div>
            <div class="detail-row"><span class="label">Service:</span><span class="val" id="modalService">Orthodontics</span></div>

            <div class="detail-row"><span class="label">Dentist:</span><span class="val" id="modalDentist">Dra. Camaclang</span></div>

            <div class="detail-row"><span class="label">Date and Time:</span><span class="val" id="modalDateTime">Jan 25, 2025 - 10:30 AM</span></div>
            <div class="modal-actions">
                <button class="cancel-btn" onclick="openCancelConfirm()">Cancel Appointment</button>
                <button class="confirm-small-btn" onclick="closeModal('appointmentModal')">Confirm</button>
            </div>
        </div>
    </div>
</div>

<div id="cancelConfirmModal" class="modal-overlay">
    <div class="confirm-box">
        <h2>Are you sure you want to cancel your appointment?</h2>
        <div class="reason-section">
            <label>Reason: <span>(Optional)</span></label>
            <textarea placeholder="Type here..."></textarea>
        </div>
        <div class="confirm-actions">
            <button class="no-btn" onclick="closeModal('cancelConfirmModal')">NO</button>
            <button class="yes-btn" onclick="showFinalCancelSuccess()">YES</button>
        </div>
    </div>
</div>

<div id="cancelSuccessModal" class="modal-overlay">
    <div class="success-box">
        <h2 style="font-size: 1.6rem; font-weight: 800; margin-bottom: 30px;">Your appointment has been canceled!</h2>
        <button class="confirm-small-btn" onclick="finalizeCancellation()">Confirm</button>
    </div>
</div>

<script src="appointment.js"></script>

</body>
</html>