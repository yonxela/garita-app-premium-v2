document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const form = document.getElementById('visitorForm');
    const homeView = document.getElementById('homeView');
    const formView = document.getElementById('formView');
    const successView = document.getElementById('successView');
    const appHeader = document.querySelector('.app-header');
    const btnStart = document.getElementById('btnStart');

    // Inputs
    const neighborInput = document.getElementById('neighborName');
    const visitorInput = document.getElementById('visitorName');
    const platesInput = document.getElementById('plates');
    const peopleInput = document.getElementById('peopleCount');
    const dateInput = document.getElementById('visitDate');
    const dateChips = document.getElementById('dateChips');
    const chips = dateChips.querySelectorAll('.chip');

    // Buttons
    const btnMinus = document.getElementById('btnMinus');
    const btnPlus = document.getElementById('btnPlus');
    const submitBtn = document.getElementById('submitBtn');
    const btnNewRegistration = document.getElementById('btnNewRegistration');

    // Admin View
    const adminView = document.getElementById('adminView');
    const btnAdminView = document.getElementById('btnAdminView');
    const btnCloseAdmin = document.getElementById('btnCloseAdmin');
    const btnClearVisits = document.getElementById('btnClearVisits');
    const visitsList = document.getElementById('visitsList');

    // Success view labels
    const resVisitor = document.getElementById('resVisitor');
    const resPlates = document.getElementById('resPlates');
    const resCount = document.getElementById('resCount');
    const resDate = document.getElementById('resDate');

    // Welcome Screen Transition
    btnStart.addEventListener('click', () => {
        homeView.classList.add('fade-out');
        setTimeout(() => {
            homeView.style.display = 'none';
            appHeader.style.display = 'flex';
            formView.style.display = 'flex';
            formView.classList.add('fade-in');

            // Focus on first input if empty
            if (!neighborInput.value) {
                neighborInput.focus();
            } else {
                visitorInput.focus();
            }
        }, 300);
    });

    // Default to today's date
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;

    // Date Chips Logic
    chips.forEach(chip => {
        chip.addEventListener('click', () => {
            const val = chip.getAttribute('data-value');

            if (val === 'today') {
                dateInput.value = today;
                chips[0].classList.add('active');
                chips[1].classList.remove('active');
                chips[1].textContent = 'Otra fecha';
            } else {
                dateInput.showPicker();
            }
        });
    });

    dateInput.addEventListener('change', () => {
        if (dateInput.value !== today) {
            chips[0].classList.remove('active');
            chips[1].classList.add('active');

            // Format for display inside the chip
            const parts = dateInput.value.split('-');
            const d = new Date(parts[0], parts[1] - 1, parts[2]);
            chips[1].textContent = d.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
        } else {
            chips[0].click();
        }
    });

    // Load saved neighbor name if exists
    const savedNeighbor = localStorage.getItem('garita_neighborName');
    if (savedNeighbor) {
        neighborInput.value = savedNeighbor;
    }

    // Number input logic
    btnMinus.addEventListener('click', () => {
        let val = parseInt(peopleInput.value);
        if (val > 1) {
            peopleInput.value = val - 1;
        }
    });

    // Plus Logic
    btnPlus.addEventListener('click', () => {
        let val = parseInt(peopleInput.value);
        if (val < 10) {
            peopleInput.value = val + 1;
        }
    });

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validate basic inputs
        if (!neighborInput.value || !visitorInput.value || !platesInput.value) {
            return;
        }

        // Save neighbor name for future convenience
        localStorage.setItem('garita_neighborName', neighborInput.value);

        // UI Loading state
        submitBtn.classList.add('loading');
        submitBtn.querySelector('span').style.display = 'none';
        submitBtn.querySelector('.spinner').style.display = 'block';

        // Simulate API call / processing time
        setTimeout(() => {
            // Register Visit
            const visitData = {
                id: Date.now(),
                neighborName: neighborInput.value,
                visitorName: visitorInput.value,
                plates: platesInput.value.toUpperCase(),
                count: peopleInput.value,
                date: dateInput.value,
                timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
            };

            // Save to LocalStorage
            let visits = JSON.parse(localStorage.getItem('garita_visits') || '[]');
            visits.unshift(visitData); // add to beginning
            localStorage.setItem('garita_visits', JSON.stringify(visits));

            // Populate success ticket
            resVisitor.textContent = visitorInput.value;
            resPlates.textContent = platesInput.value.toUpperCase();
            resCount.textContent = peopleInput.value + (peopleInput.value == 1 ? ' persona' : ' personas');

            // Format date for display (e.g., 26 de febrero)
            const dateParts = dateInput.value.split('-');
            const displayDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
            resDate.textContent = displayDate.toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });

            // Clear the specific inputs for next time
            visitorInput.value = '';
            platesInput.value = '';
            peopleInput.value = '1';
            dateInput.value = today;
            chips[0].click(); // Reset to today chip

            // Transition views
            formView.classList.add('fade-out');

            setTimeout(() => {
                formView.style.display = 'none';
                formView.classList.remove('fade-out');

                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.querySelector('span').style.display = 'block';
                submitBtn.querySelector('.spinner').style.display = 'none';

                // Show success
                successView.style.display = 'block';
            }, 300);

        }, 1200);
    });

    // New Registration
    btnNewRegistration.addEventListener('click', () => {
        // Clear specific fields
        visitorInput.value = '';
        platesInput.value = '';
        peopleInput.value = '1';

        // Transition views
        successView.classList.add('fade-out');

        setTimeout(() => {
            successView.style.display = 'none';
            successView.classList.remove('fade-out');

            formView.style.display = 'flex';

            // Focus on visitor name
            visitorInput.focus();
        }, 300);
    });

    // Uppercase formatting for plates
    platesInput.addEventListener('input', (e) => {
        e.target.value = e.target.value.toUpperCase();
    });

    // Admin View Navigation
    const passwordModal = document.getElementById('passwordModal');
    const adminPasswordInput = document.getElementById('adminPassword');
    const btnCancelAdmin = document.getElementById('btnCancelAdmin');
    const btnSubmitAdmin = document.getElementById('btnSubmitAdmin');
    const passwordError = document.getElementById('passwordError');

    btnAdminView.addEventListener('click', () => {
        passwordModal.style.display = 'flex';
        adminPasswordInput.value = '';
        passwordError.style.display = 'none';
        setTimeout(() => adminPasswordInput.focus(), 100);
    });

    btnCancelAdmin.addEventListener('click', () => {
        passwordModal.style.display = 'none';
    });

    btnSubmitAdmin.addEventListener('click', () => {
        if (adminPasswordInput.value === 'N2026') {
            passwordModal.style.display = 'none';
            homeView.style.display = 'none';
            appHeader.style.display = 'flex';
            formView.style.display = 'none';
            successView.style.display = 'none';
            adminView.style.display = 'flex';
            renderVisits();
        } else {
            passwordError.style.display = 'block';
        }
    });

    adminPasswordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            btnSubmitAdmin.click();
        }
    });

    btnCloseAdmin.addEventListener('click', () => {
        adminView.style.display = 'none';
        formView.style.display = 'flex';
    });

    // Clear Visits History
    btnClearVisits.addEventListener('click', () => {
        const password = prompt('Ingrese la clave para borrar el historial:');

        if (password === 'D20261') {
            if (confirm('¿Estás seguro de que quieres borrar de forma definitiva el historial de visitas?')) {
                localStorage.removeItem('garita_visits');
                renderVisits();
                alert('Historial borrado exitosamente.');
            }
        } else if (password !== null) {
            alert('Clave incorrecta.');
        }
    });

    // Render Visits
    function renderVisits() {
        const visits = JSON.parse(localStorage.getItem('garita_visits') || '[]');

        if (visits.length === 0) {
            visitsList.innerHTML = '<p style="text-align: center; color: var(--text-muted); margin-top: 2rem;">No hay visitas autorizadas aún.</p>';
            return;
        }

        visitsList.innerHTML = visits.map(v => `
            <div class="visit-card">
                <div class="visit-header">
                    <span class="visit-visitor"><span class="emoji">👋</span> ${v.visitorName}</span>
                    <span class="visit-timestamp"><span class="emoji">⏰</span> ${v.timestamp}</span>
                </div>
                <div class="visit-details">
                    <span class="visit-badge-plates"><span class="emoji">🚗</span> ${v.plates}</span>
                    <span><span class="emoji">📅</span> ${v.date} | <span class="emoji">👥</span> ${v.count}</span>
                </div>
                <span class="visit-neighbor"><span class="emoji">🏠</span> Autorizado por: ${v.neighborName}</span>
            </div>
        `).join('');
    }
});