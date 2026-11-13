
document.addEventListener("DOMContentLoaded", () => {

    const content = document.getElementById("content");
    const pageTitle = document.getElementById("page-title");
    const navButtons = document.querySelectorAll(".nav-btn");

    // Sample Dashboard Data
    const data = {
        revenue: 45000,
        activeRentals: 18,
        vehicles: 25,
        pendingPayments: 2
    };

    // Reusable Table Function
    function createTable(headers, rows) {
        return `
            <div class="table-wrap">
                <table>
                    <thead>
                        <tr>
                            ${headers.map(h => `<th>${h}</th>`).join("")}
                        </tr>
                    </thead>
                    <tbody>
                        ${rows.map(row => `
                            <tr>
                                ${row.map(cell => `<td>${cell}</td>`).join("")}
                            </tr>
                        `).join("")}
                    </tbody>
                </table>
            </div>
        `;
    }

    // Dashboard Pages
    const pages = {

        // DASHBOARD
        dashboard: {
            title: "Dashboard Overview",
            html: `
                <div class="section-heading">
                    <h2>Dashboard Overview</h2>
                    <p>Monitor your JCLMR DRIVE rental business.</p>
                </div>

                <div class="stats-grid">

                    <div class="stat-card">
                        <div class="stat-icon">₱</div>
                        <p>Total Revenue</p>
                        <h2>₱${data.revenue.toLocaleString()}</h2>
                        <small>Current revenue</small>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🚘</div>
                        <p>Active Rentals</p>
                        <h2>${data.activeRentals}</h2>
                        <small>Currently rented</small>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">🚗</div>
                        <p>Total Vehicles</p>
                        <h2>${data.vehicles}</h2>
                        <small>Registered vehicles</small>
                    </div>

                    <div class="stat-card">
                        <div class="stat-icon">💳</div>
                        <p>Pending Payments</p>
                        <h2>${data.pendingPayments}</h2>
                        <small>Awaiting payment</small>
                    </div>

                </div>

                <div class="charts-grid">

                    <div class="panel">
                        <div class="panel-heading">
                            <h3>Monthly Revenue</h3>
                            <span class="muted">2026</span>
                        </div>

                        <div class="bar-chart">
                            ${[
                                ["Jan", 40],
                                ["Feb", 65],
                                ["Mar", 50],
                                ["Apr", 85],
                                ["May", 70],
                                ["Jun", 95]
                            ].map(([month, height]) => `
                                <div class="bar-item">
                                    <div class="bar"
                                         style="height:${height}%"></div>
                                    <span>${month}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <div class="panel">
                        <div class="panel-heading">
                            <h3>Rental Summary</h3>
                        </div>

                        <div class="report-numbers">
                            <div class="report-number">
                                <span>Available Vehicles</span>
                                <strong>7</strong>
                            </div>

                            <div class="report-number">
                                <span>Rented Vehicles</span>
                                <strong>18</strong>
                            </div>

                            <div class="report-number">
                                <span>Under Maintenance</span>
                                <strong>3</strong>
                            </div>

                            <div class="report-number">
                                <span>Pending Payments</span>
                                <strong>2</strong>
                            </div>
                        </div>
                    </div>

                </div>

                <div class="panel">
                    <div class="panel-heading">
                        <h3>Recent Activities</h3>
                        <span class="muted">Latest updates</span>
                    </div>

                    <div class="report-numbers">
                        <div class="report-number">
                            <span>New rental registered</span>
                            <strong>Today</strong>
                        </div>

                        <div class="report-number">
                            <span>Payment received</span>
                            <strong>Today</strong>
                        </div>

                        <div class="report-number">
                            <span>Vehicle maintenance recorded</span>
                            <strong>Today</strong>
                        </div>
                    </div>
                </div>
            `
        },

        // PAYMENTS
        payments: {
            title: "Payments Management",
            html: `
                <div class="section-heading">
                    <h2>Payments</h2>
                    <p>View and monitor customer payments.</p>
                </div>

                <div class="stats-grid">

                    <div class="stat-card">
                        <p>Total Payments</p>
                        <h2>₱45,000</h2>
                    </div>

                    <div class="stat-card">
                        <p>Paid Transactions</p>
                        <h2>15</h2>
                    </div>

                    <div class="stat-card">
                        <p>Pending Payments</p>
                        <h2>2</h2>
                    </div>

                    <div class="stat-card">
                        <p>Refunds</p>
                        <h2>₱0</h2>
                    </div>

                </div>

                <div class="panel">
                    <div class="panel-heading">
                        <h3>Payment Records</h3>
                    </div>

                    <div class="toolbar">
                        <input type="text"
                               class="search-input"
                               placeholder="Search payment...">
                        <select class="filter-select">
                            <option value="">All Status</option>
                            <option>Paid</option>
                            <option>Pending</option>
                            <option>Refunded</option>
                        </select>
                    </div>

                    ${createTable(
                        ["Payment ID", "Customer", "Amount", "Date", "Status"],
                        [
                            ["PAY-001", "Juan Dela Cruz", "₱5,000", "Nov 10, 2026", '<span class="status paid">Paid</span>'],
                            ["PAY-002", "Maria Santos", "₱3,500", "Nov 11, 2026", '<span class="status pending">Pending</span>'],
                            ["PAY-003", "Pedro Reyes", "₱4,000", "Nov 12, 2026", '<span class="status paid">Paid</span>']
                        ]
                    )}
                </div>
            `
        },

        // REPORTS
        reports: {
            title: "Reports & Analysis",
            html: `
                <div class="section-heading">
                    <h2>Reports & Analysis</h2>
                    <p>Monitor business performance and rental statistics.</p>
                </div>

                <div class="stats-grid">

                    <div class="stat-card">
                        <p>Total Revenue</p>
                        <h2>₱45,000</h2>
                    </div>

                    <div class="stat-card">
                        <p>Total Rentals</p>
                        <h2>32</h2>
                    </div>

                    <div class="stat-card">
                        <p>Available Vehicles</p>
                        <h2>7</h2>
                    </div>

                    <div class="stat-card">
                        <p>Completed Rentals</p>
                        <h2>14</h2>
                    </div>

                </div>

                <div class="charts-grid">

                    <div class="panel">
                        <div class="panel-heading">
                            <h3>Revenue Analysis</h3>
                        </div>

                        <div class="bar-chart">
                            ${[45, 65, 55, 80, 70, 95].map((h, i) => `
                                <div class="bar-item">
                                    <div class="bar" style="height:${h}%"></div>
                                    <span>${["Jan","Feb","Mar","Apr","May","Jun"][i]}</span>
                                </div>
                            `).join("")}
                        </div>
                    </div>

                    <div class="panel">
                        <div class="panel-heading">
                            <h3>Business Summary</h3>
                        </div>

                        <div class="report-numbers">
                            <div class="report-number">
                                <span>Total Revenue</span>
                                <strong>₱45,000</strong>
                            </div>

                            <div class="report-number">
                                <span>Total Rentals</span>
                                <strong>32</strong>
                            </div>

                            <div class="report-number">
                                <span>Completed Rentals</span>
                                <strong>14</strong>
                            </div>

                            <div class="report-number">
                                <span>Ongoing Rentals</span>
                                <strong>18</strong>
                            </div>
                        </div>
                    </div>

                </div>
            `
        },

        // VEHICLES
        vehicles: {
            title: "Vehicle Management",
            html: `
                <div class="section-heading">
                    <h2>Vehicles</h2>
                    <p>View and manage registered rental vehicles.</p>
                </div>

                <div class="panel">
                    <div class="panel-heading">
                        <h3>Vehicle Records</h3>
                        <button class="btn btn-primary"
                                id="addVehicleBtn">+ Add Vehicle</button>
                    </div>

                    <div class="toolbar">
                        <input type="text"
                               class="search-input"
                               placeholder="Search vehicle...">
                        <select class="filter-select">
                            <option value="">All Status</option>
                            <option>Available</option>
                            <option>Rented</option>
                            <option>Maintenance</option>
                        </select>
                    </div>

                    ${createTable(
                        ["Vehicle ID", "Vehicle Name", "Plate Number", "Type", "Status"],
                        [
                            ["V-001", "Toyota Vios", "ABC-1234", "Sedan", '<span class="status available">Available</span>'],
                            ["V-002", "Mitsubishi Montero", "XYZ-5678", "SUV", '<span class="status rented">Rented</span>'],
                            ["V-003", "Honda City", "DEF-9012", "Sedan", '<span class="status maintenance">Maintenance</span>']
                        ]
                    )}
                </div>
            `
        },

        // MAINTENANCE
        maintenance: {
            title: "Maintenance Management",
            html: `
                <div class="section-heading">
                    <h2>Maintenance</h2>
                    <p>Monitor vehicle repairs and maintenance schedules.</p>
                </div>

                <div class="panel">
                    <div class="panel-heading">
                        <h3>Maintenance Records</h3>
                    </div>

                    ${createTable(
                        ["Maintenance ID", "Vehicle", "Description", "Date", "Status"],
                        [
                            ["M-001", "Toyota Vios", "Oil Change", "Nov 10, 2026", '<span class="status completed">Completed</span>'],
                            ["M-002", "Honda City", "General Inspection", "Nov 15, 2026", '<span class="status pending">Pending</span>'],
                            ["M-003", "Toyota Innova", "Brake Inspection", "Nov 18, 2026", '<span class="status upcoming">Upcoming</span>']
                        ]
                    )}
                </div>
            `
        },

        // RENTALS
        rentals: {
            title: "Rentals & Returns",
            html: `
                <div class="section-heading">
                    <h2>Rentals & Returns</h2>
                    <p>Monitor customer rentals and returned vehicles.</p>
                </div>

                <div class="panel">
                    <div class="panel-heading">
                        <h3>Rental Records</h3>
                    </div>

                    <div class="toolbar">
                        <input type="text"
                               class="search-input"
                               placeholder="Search rental...">
                        <select class="filter-select">
                            <option value="">All Status</option>
                            <option>Ongoing</option>
                            <option>Returned</option>
                            <option>Overdue</option>
                        </select>
                    </div>

                    ${createTable(
                        ["Rental ID", "Customer", "Vehicle", "Return Date", "Status"],
                        [
                            ["R-001", "Juan Dela Cruz", "Toyota Vios", "Nov 15, 2026", '<span class="status rented">Ongoing</span>'],
                            ["R-002", "Pedro Reyes", "Honda City", "Nov 12, 2026", '<span class="status returned">Returned</span>'],
                            ["R-003", "Maria Santos", "Montero", "Nov 13, 2026", '<span class="status overdue">Overdue</span>']
                        ]
                    )}
                </div>
            `
        }

    };

    // LOAD PAGE
    function loadPage(page) {

        if (!pages[page]) return;

        pageTitle.textContent = pages[page].title;
        content.innerHTML = pages[page].html;

        navButtons.forEach(button => {
            button.classList.toggle(
                "active",
                button.dataset.page === page
            );
        });

    }

    // SIDEBAR NAVIGATION
    navButtons.forEach(button => {
        button.addEventListener("click", () => {
            loadPage(button.dataset.page);
        });
    });

    // TABLE SEARCH AND FILTER
    content.addEventListener("input", event => {
        if (!event.target.classList.contains("search-input")) return;

        const search = event.target.value.toLowerCase();
        const table = content.querySelector("table");

        if (!table) return;

        table.querySelectorAll("tbody tr").forEach(row => {
            row.style.display = row.textContent.toLowerCase().includes(search)
                ? ""
                : "none";
        });
    });

    content.addEventListener("change", event => {
        if (!event.target.classList.contains("filter-select")) return;

        const filter = event.target.value.toLowerCase();
        const table = content.querySelector("table");

        if (!table) return;

        table.querySelectorAll("tbody tr").forEach(row => {
            const status = row.cells[row.cells.length - 1].textContent.toLowerCase();

            row.style.display = !filter || status === filter
                ? ""
                : "none";
        });
    });

    // ADD VEHICLE DEMO
    content.addEventListener("click", event => {
        if (event.target.id === "addVehicleBtn") {
            alert("Vehicle registration form can be connected here.");
        }
    });

    // LOAD DEFAULT PAGE
    loadPage("dashboard");

});

function confirmPayment() {
    const confirmAction = confirm(
        "Are you sure you want to confirm this payment?"
    );

    if (confirmAction) {

        // Get existing payments
        let payments = JSON.parse(
            localStorage.getItem("payments")
        ) || [];

        // Create payment record
        const payment = {
            receiptNo: "CR-2026-001",
            customerName: "Juan Dela Cruz",
            contact: "09123456789",
            email: "juan@gmail.com",
            carModel: "Toyota Vios",
            plateNumber: "ABC-1234",
            paymentMethod: "GCash",
            transactionId: "GC-123456789",
            amount: 3000,
            paymentStatus: "Paid",
            date: "November 12, 2026"
        };

        // Prevent duplicate payment records
        const alreadyExists = payments.some(
            p => p.receiptNo === payment.receiptNo
        );

        if (!alreadyExists) {
            payments.push(payment);

            localStorage.setItem(
                "payments",
                JSON.stringify(payments)
            );
        }

        // Redirect customer
        window.location.href = "customer.html";
    }
}
