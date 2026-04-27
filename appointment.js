
function openModal(service, dentist, date, time) {
    document.getElementById('appointmentModal').style.display = 'flex';

    document.getElementById('modalService').textContent = service;
    document.getElementById('modalDentist').textContent = dentist;
    document.getElementById('modalDateTime').textContent =
        date + " - " + new Date("1970-01-01 " + time).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

function openCancelConfirm() {
    document.getElementById('cancelConfirmModal').style.display = 'flex';
}

function showFinalCancelSuccess() {
    closeModal('cancelConfirmModal');
    document.getElementById('cancelSuccessModal').style.display = 'flex';
}

function finalizeCancellation() {
    closeModal('cancelSuccessModal');
    closeModal('appointmentModal');
}