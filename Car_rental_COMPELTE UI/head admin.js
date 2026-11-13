
/* ==========================================
   JCLMR DRIVE - HEAD ADMIN DASHBOARD
========================================== */

// DATA STORAGE

const defaultData = {
    vehicles: [
        { id: 1, name: "Toyota Vios", plate: "ABC-1234", type: "Sedan", status: "Available" },
        { id: 2, name: "Mitsubishi Montero", plate: "DEF-5678", type: "SUV", status: "Rented" },
        { id: 3, name: "Toyota Hiace", plate: "GHI-9012", type: "Van", status: "Maintenance" }
    ],

    payments: [
        { id: 1, customer: "Juan Dela Cruz", amount: 2500, method: "GCash", status: "Paid" },
        { id: 2, customer: "Maria Santos", amount: 3500, method: "Cash", status: "Pending" }
    ],

    maintenance: [
        { id: 1, vehicle: "Toyota Vios", issue: "Oil Change", date: "2026-11-12", status: "Pending" },
        { id: 2, vehicle: "Toyota Hiace", issue: "Engine Check", date: "2026-11-10", status: "Completed" }
    ],

    rentals: [
        { id: 1, customer: "Pedro Reyes", vehicle: "Toyota Vios", date: "2026-11-12", status: "Upcoming" },
        { id: 2, customer: "Ana Cruz", vehicle: "Mitsubishi Montero", date: "2026-11-11", status: "Returned" }
    ],

    staffRequests: [
        { id: 1, name: "John Smith", email: "john@gmail.com", position: "Staff", status: "Pending" },
        { id: 2, name: "Anna Reyes", email: "anna@gmail.com", position: "Staff", status: "Pending" }
    ],

    adminRequests: [
        { id: 1, name: "Mark Santos", email: "mark@gmail.com", position: "Admin", status: "Pending" }
    ]
};

function loadData() {
    const saved = localStorage.getItem("jclmrHeadData");

    if (saved) {
        try {
            return { ...defaultData, ...JSON.parse(saved) };
        } catch (error) {
            console.error("Unable to load saved data:", error);
        }
    }

    return JSON.parse(JSON.stringify(defaultData));
}

let data = loadData();

function saveData() {
    localStorage.setItem("jclmrHeadData", JSON.stringify(data));
}

// ELEMENTS

const content = document.getElementById("content");
const pageTitle = document.getElementById("page-title");
const navButtons = document.querySelectorAll(".nav-btn");

let currentPage = "dashboard";

// SECURITY HELPER

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;"
    })[char]);
}

// GENERAL HELPERS

function money(amount) {
    return "₱" + Number(amount || 0).toLocaleString("en-PH");
}

function statusBadge(status) {
    return `<span class="status ${escapeHTML(String(status).toLowerCase())}">
        ${escapeHTML(status)}
    </span>`;
}

function emptyMessage(message) {
    return `<div class="empty-message">${escapeHTML(message)}</div>`;
}

function sectionHeading(title, description) {
    return `
        <div class="section-heading">
            <h2>${title}</h2>
            <p>${description}</p>
        </div>
    `;
}

function table(headers, rows) {
    if (!rows.length) {
        return emptyMessage("No records found.");
    }

    return `
        <div class="table-wrap">
            <table>
                <thead>
                    <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
                </thead>
                <tbody>${rows.join("")}</tbody>
            </table>
        </div>
    `;
}

// NAVIGATION

navButtons.forEach(button => {
    button.addEventListener("click", () => {
        navButtons.forEach(btn => btn.classList.remove("active"));

        button.classList.add("active");

        currentPage = button.dataset.page;

        renderPage();
    });
});

function renderPage() {
    const titles = {
        dashboard: "Dashboard Overview",
        payments: "Payments Management",
        reports: "Reports & Analysis",
        vehicles: "Vehicle Management",
        maintenance: "Maintenance Management",
        rentals: "Rentals & Returns",
        staff: "Staff Requests",
        admins: "Admin Requests"
    };

    pageTitle.textContent = titles[currentPage] || "Dashboard";

    const pages = {
        dashboard: renderDashboard,
        payments: renderPayments,
        reports: renderReports,
        vehicles: renderVehicles,
        maintenance: renderMaintenance,
        rentals: renderRentals,
        staff: renderStaffRequests,
        admins: renderAdminRequests
    };

    if (pages[currentPage]) {
        pages[currentPage]();
    }
}

// ==========================================
// DASHBOARD
// ==========================================

function renderDashboard() {

    const totalVehicles = data.vehicles.length;

    const availableVehicles = data.vehicles.filter(
        v => v.status === "Available"
    ).length;

    const rentedVehicles = data.vehicles.filter(
        v => v.status === "Rented"
    ).length;

    const pendingPayments = data.payments.filter(
        p => p.status === "Pending"
    ).length;

    const totalRevenue = data.payments
        .filter(p => p.status === "Paid")
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const pendingStaff = data.staffRequests.filter(
        r => r.status === "Pending"
    ).length;

    const pendingAdmins = data.adminRequests.filter(
        r => r.status === "Pending"
    ).length;

    content.innerHTML = `
        ${sectionHeading(
            "Dashboard Overview",
            "Monitor your JCLMR Drive business activities."
        )}

        <div class="stats-grid">

            <div class="stat-card">
                <div class="stat-icon">🚘</div>
                <p>Total Vehicles</p>
                <h2>${totalVehicles}</h2>
                <small>${availableVehicles} Available</small>
            </div>

            <div class="stat-card">
                <div class="stat-icon">₱</div>
                <p>Total Revenue</p>
                <h2>${money(totalRevenue)}</h2>
                <small>Paid transactions</small>
            </div>

            <div class="stat-card">
                <div class="stat-icon">📋</div>
                <p>Active Rentals</p>
                <h2>${rentedVehicles}</h2>
                <small>Currently rented</small>
            </div>

            <div class="stat-card">
                <div class="stat-icon">♙</div>
                <p>Pending Requests</p>
                <h2>${pendingStaff + pendingAdmins}</h2>
                <small>${pendingStaff} Staff / ${pendingAdmins} Admin</small>
            </div>

        </div>

        <div class="panel">
            <div class="panel-heading">
                <h3>Recent Payments</h3>
                <span class="muted">${pendingPayments} Pending Payments</span>
            </div>

            ${table(
                ["Customer", "Amount", "Method", "Status"],
                data.payments.slice(-5).reverse().map(p => `
                    <tr>
                        <td>${escapeHTML(p.customer)}</td>
                        <td>${money(p.amount)}</td>
                        <td>${escapeHTML(p.method)}</td>
                        <td>${statusBadge(p.status)}</td>
                    </tr>
                `)
            )}
        </div>

        <div class="request-grid">

            <div class="request-card">
                <h3>Staff Requests</h3>
                <p>${pendingStaff} pending staff applications.</p>
                <button class="btn btn-primary" data-page-link="staff">
                    View Requests
                </button>
            </div>

            <div class="request-card">
                <h3>Admin Requests</h3>
                <p>${pendingAdmins} pending admin applications.</p>
                <button class="btn btn-primary" data-page-link="admins">
                    View Requests
                </button>
            </div>

        </div>
    `;
}

// ==========================================
// PAYMENTS
// ==========================================

function renderPayments() {

    content.innerHTML = `
        ${sectionHeading(
            "Payments Management",
            "View and manage customer transactions."
        )}

        <div class="panel">

            <div class="panel-heading">
                <h3>All Payments</h3>
                <span class="muted">${data.payments.length} Transactions</span>
            </div>

            <div class="toolbar">
                <input type="text" id="paymentSearch"
                    placeholder="Search customer...">

                <select id="paymentFilter">
                    <option value="All">All Payments</option>
                    <option value="Paid">Paid</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

            <div id="paymentTable"></div>

        </div>
    `;

    const search = document.getElementById("paymentSearch");
    const filter = document.getElementById("paymentFilter");

    function update() {
        const keyword = search.value.toLowerCase();

        const results = data.payments.filter(p =>
            p.customer.toLowerCase().includes(keyword) &&
            (filter.value === "All" || p.status === filter.value)
        );

        document.getElementById("paymentTable").innerHTML = table(
            ["ID", "Customer", "Amount", "Method", "Status", "Action"],
            results.map(p => `
                <tr>
                    <td>#${p.id}</td>
                    <td>${escapeHTML(p.customer)}</td>
                    <td>${money(p.amount)}</td>
                    <td>${escapeHTML(p.method)}</td>
                    <td>${statusBadge(p.status)}</td>
                    <td>
                        <div class="action-group">
                            ${p.status === "Pending" ? `
                                <button class="btn btn-success"
                                    data-action="payment-paid"
                                    data-id="${p.id}">Mark Paid</button>

                                <button class="btn btn-danger"
                                    data-action="payment-reject"
                                    data-id="${p.id}">Reject</button>
                            ` : "-"}
                        </div>
                    </td>
                </tr>
            `)
        );
    }

    search.addEventListener("input", update);
    filter.addEventListener("change", update);

    update();
}

// ==========================================
// REPORTS & ANALYSIS
// ==========================================

function renderReports() {

    const paid = data.payments.filter(p => p.status === "Paid");

    const revenue = paid.reduce(
        (sum, p) => sum + Number(p.amount), 0
    );

    const pending = data.payments.filter(
        p => p.status === "Pending"
    ).length;

    const rejected = data.payments.filter(
        p => p.status === "Rejected"
    ).length;

    const completedRentals = data.rentals.filter(
        r => r.status === "Returned"
    ).length;

    const maxAmount = Math.max(
        ...data.payments.map(p => Number(p.amount)),
        1
    );

    content.innerHTML = `
        ${sectionHeading(
            "Reports & Analysis",
            "Business performance and financial overview."
        )}

        <div class="stats-grid">

            <div class="stat-card">
                <p>Total Revenue</p>
                <h2>${money(revenue)}</h2>
                <small>Confirmed payments</small>
            </div>

            <div class="stat-card">
                <p>Total Transactions</p>
                <h2>${data.payments.length}</h2>
                <small>All payment records</small>
            </div>

            <div class="stat-card">
                <p>Completed Rentals</p>
                <h2>${completedRentals}</h2>
                <small>Returned vehicles</small>
            </div>

            <div class="stat-card">
                <p>Pending Payments</p>
                <h2>${pending}</h2>
                <small>${rejected} Rejected</small>
            </div>

        </div>

        <div class="charts-grid">

            <div class="panel">
                <div class="panel-heading">
                    <h3>Payment Transactions</h3>
                </div>

                <div class="bar-chart">
                    ${data.payments.slice(-7).map(p => {
                        const height = (Number(p.amount) / maxAmount) * 100;

                        return `
                            <div class="bar-item">
                                <div class="bar"
                                    style="height:${height}%"
                                    title="${money(p.amount)}">
                                </div>
                                <span>#${p.id}</span>
                            </div>
                        `;
                    }).join("") || emptyMessage("No payment data.")}
                </div>
            </div>

            <div class="panel">
                <div class="panel-heading">
                    <h3>Business Summary</h3>
                </div>

                <div class="report-numbers">

                    <div class="report-number">
                        <span>Total Vehicles</span>
                        <strong>${data.vehicles.length}</strong>
                    </div>

                    <div class="report-number">
                        <span>Available Vehicles</span>
                        <strong>${data.vehicles.filter(v => v.status === "Available").length}</strong>
                    </div>

                    <div class="report-number">
                        <span>Maintenance</span>
                        <strong>${data.maintenance.filter(m => m.status === "Pending").length}</strong>
                    </div>

                    <div class="report-number">
                        <span>Total Rentals</span>
                        <strong>${data.rentals.length}</strong>
                    </div>

                </div>
            </div>

        </div>

        <div class="panel">
            <h3>Export Report</h3>
            <p class="muted" style="margin:10px 0 15px">
                Download a CSV copy of your payment records.
            </p>

            <button class="btn btn-primary" data-action="export-payments">
                Download Payment Report
            </button>
        </div>
    `;
}

// ==========================================
// VEHICLES
// ==========================================

function renderVehicles() {

    content.innerHTML = `
        ${sectionHeading(
            "Vehicle Management",
            "Manage your rental vehicle inventory."
        )}

        <div class="panel">

            <div class="panel-heading">
                <h3>Vehicle Inventory</h3>
                <button class="btn btn-primary" data-action="add-vehicle">
                    + Add Vehicle
                </button>
            </div>

            <div class="toolbar">
                <input id="vehicleSearch" placeholder="Search vehicle...">
            </div>

            <div id="vehicleTable"></div>

        </div>
    `;

    const search = document.getElementById("vehicleSearch");

    function update() {
        const keyword = search.value.toLowerCase();

        const results = data.vehicles.filter(v =>
            v.name.toLowerCase().includes(keyword) ||
            v.plate.toLowerCase().includes(keyword)
        );

        document.getElementById("vehicleTable").innerHTML = table(
            ["ID", "Vehicle", "Plate Number", "Type", "Status", "Action"],
            results.map(v => `
                <tr>
                    <td>#${v.id}</td>
                    <td>${escapeHTML(v.name)}</td>
                    <td>${escapeHTML(v.plate)}</td>
                    <td>${escapeHTML(v.type)}</td>
                    <td>${statusBadge(v.status)}</td>
                    <td>
                        <div class="action-group">
                            <button class="btn btn-warning"
                                data-action="edit-vehicle"
                                data-id="${v.id}">Edit</button>

                            <button class="btn btn-danger"
                                data-action="delete-vehicle"
                                data-id="${v.id}">Delete</button>
                        </div>
                    </td>
                </tr>
            `)
        );
    }

    search.addEventListener("input", update);

    update();
}

// ==========================================
// MAINTENANCE
// ==========================================

function renderMaintenance() {

    content.innerHTML = `
        ${sectionHeading(
            "Maintenance Management",
            "Track vehicle repairs and maintenance schedules."
        )}

        <div class="panel">

            <div class="panel-heading">
                <h3>Maintenance Records</h3>

                <button class="btn btn-primary" data-action="add-maintenance">
                    + Add Record
                </button>
            </div>

            ${table(
                ["ID", "Vehicle", "Issue", "Date", "Status", "Action"],
                data.maintenance.map(m => `
                    <tr>
                        <td>#${m.id}</td>
                        <td>${escapeHTML(m.vehicle)}</td>
                        <td>${escapeHTML(m.issue)}</td>
                        <td>${escapeHTML(m.date)}</td>
                        <td>${statusBadge(m.status)}</td>
                        <td>
                            ${m.status === "Pending" ? `
                                <button class="btn btn-success"
                                    data-action="maintenance-complete"
                                    data-id="${m.id}">
                                    Complete
                                </button>
                            ` : "-"}
                        </td>
                    </tr>
                `)
            )}

        </div>
    `;
}

// ==========================================
// RENTALS & RETURNS
// ==========================================

function renderRentals() {

    content.innerHTML = `
        ${sectionHeading(
            "Rentals & Returns",
            "Monitor vehicle rentals and customer returns."
        )}

        <div class="panel">

            <div class="panel-heading">
                <h3>Rental Records</h3>

                <button class="btn btn-primary" data-action="add-rental">
                    + Add Rental
                </button>
            </div>

            ${table(
                ["ID", "Customer", "Vehicle", "Date", "Status", "Action"],
                data.rentals.map(r => `
                    <tr>
                        <td>#${r.id}</td>
                        <td>${escapeHTML(r.customer)}</td>
                        <td>${escapeHTML(r.vehicle)}</td>
                        <td>${escapeHTML(r.date)}</td>
                        <td>${statusBadge(r.status)}</td>
                        <td>
                            ${r.status !== "Returned" ? `
                                <button class="btn btn-success"
                                    data-action="return-vehicle"
                                    data-id="${r.id}">
                                    Mark Returned
                                </button>
                            ` : "-"}
                        </td>
                    </tr>
                `)
            )}

        </div>
    `;
}

// ==========================================
// STAFF REQUESTS
// ==========================================

function renderStaffRequests() {

    const pending = data.staffRequests.filter(
        r => r.status === "Pending"
    ).length;

    content.innerHTML = `
        ${sectionHeading(
            "Staff Requests",
            "Review and manage staff account applications."
        )}

        <div class="notice">
            You have <strong>${pending}</strong> pending staff requests.
            Approve or reject each application below.
        </div>

        <div class="panel">

            <div class="panel-heading">
                <h3>Staff Applications</h3>
                <span class="muted">${data.staffRequests.length} Total</span>
            </div>

            <div class="request-grid">

                ${data.staffRequests.map(r => `
                    <div class="request-card">

                        <h3>${escapeHTML(r.name)}</h3>

                        <p>Email: ${escapeHTML(r.email)}</p>

                        <p>Position: ${escapeHTML(r.position)}</p>

                        <p>Status: ${statusBadge(r.status)}</p>

                        ${r.status === "Pending" ? `
                            <div class="action-group">

                                <button class="btn btn-success"
                                    data-action="approve-staff"
                                    data-id="${r.id}">
                                    ✓ Approve
                                </button>

                                <button class="btn btn-danger"
                                    data-action="reject-staff"
                                    data-id="${r.id}">
                                    ✕ Reject
                                </button>

                            </div>
                        ` : `
                            <p>Application has already been processed.</p>
                        `}

                    </div>
                `).join("") || emptyMessage("No staff requests available.")}

            </div>
        </div>
    `;
}

// ==========================================
// ADMIN REQUESTS
// ==========================================

function renderAdminRequests() {

    const pending = data.adminRequests.filter(
        r => r.status === "Pending"
    ).length;

    content.innerHTML = `
        ${sectionHeading(
            "Admin Requests",
            "Review applications for administrator access."
        )}

        <div class="notice">
            You have <strong>${pending}</strong> pending admin requests.
            Only approve trusted applicants.
        </div>

        <div class="panel">

            <div class="panel-heading">
                <h3>Administrator Applications</h3>
                <span class="muted">${data.adminRequests.length} Total</span>
            </div>

            <div class="request-grid">

                ${data.adminRequests.map(r => `
                    <div class="request-card">

                        <h3>${escapeHTML(r.name)}</h3>

                        <p>Email: ${escapeHTML(r.email)}</p>

                        <p>Requested Role: ${escapeHTML(r.position)}</p>

                        <p>Status: ${statusBadge(r.status)}</p>

                        ${r.status === "Pending" ? `
                            <div class="action-group">

                                <button class="btn btn-success"
                                    data-action="approve-admin"
                                    data-id="${r.id}">
                                    ✓ Approve
                                </button>

                                <button class="btn btn-danger"
                                    data-action="reject-admin"
                                    data-id="${r.id}">
                                    ✕ Reject
                                </button>

                            </div>
                        ` : `
                            <p>Application has already been processed.</p>
                        `}

                    </div>
                `).join("") || emptyMessage("No admin requests available.")}

            </div>
        </div>
    `;
}

// ==========================================
// ACTION HANDLER
// ==========================================

content.addEventListener("click", function(event) {

    const button = event.target.closest("[data-action], [data-page-link]");

    if (!button) return;

    if (button.dataset.pageLink) {
        const page = button.dataset.pageLink;

        const nav = document.querySelector(
            `.nav-btn[data-page="${page}"]`
        );

        if (nav) nav.click();

        return;
    }

    const action = button.dataset.action;
    const id = Number(button.dataset.id);

    // STAFF APPROVAL

    if (action === "approve-staff" || action === "reject-staff") {

        const request = data.staffRequests.find(r => r.id === id);

        if (!request || request.status !== "Pending") return;

        const approved = action === "approve-staff";

        if (!confirm(
            `Are you sure you want to ${approved ? "approve" : "reject"} ${request.name}'s staff request?`
        )) return;

        request.status = approved ? "Approved" : "Rejected";

        saveData();
        renderPage();

        alert(`Staff request ${request.status.toLowerCase()} successfully!`);
    }

    // ADMIN APPROVAL

    else if (action === "approve-admin" || action === "reject-admin") {

        const request = data.adminRequests.find(r => r.id === id);

        if (!request || request.status !== "Pending") return;

        const approved = action === "approve-admin";

        if (!confirm(
            `Are you sure you want to ${approved ? "approve" : "reject"} ${request.name}'s admin request?`
        )) return;

        request.status = approved ? "Approved" : "Rejected";

        saveData();
        renderPage();

        alert(`Admin request ${request.status.toLowerCase()} successfully!`);
    }

    // PAYMENT ACTIONS

    else if (action === "payment-paid" || action === "payment-reject") {

        const payment = data.payments.find(p => p.id === id);

        if (!payment || payment.status !== "Pending") return;

        payment.status = action === "payment-paid" ? "Paid" : "Rejected";

        saveData();
        renderPage();

        alert("Payment status updated!");
    }

    // ADD VEHICLE

    else if (action === "add-vehicle") {

        const name = prompt("Enter vehicle name:");
        if (!name || !name.trim()) return;

        const plate = prompt("Enter plate number:");
        if (!plate || !plate.trim()) return;

        const type = prompt("Enter vehicle type:");
        if (!type || !type.trim()) return;

        data.vehicles.push({
            id: Date.now(),
            name: name.trim(),
            plate: plate.trim(),
            type: type.trim(),
            status: "Available"
        });

        saveData();
        renderPage();

        alert("Vehicle added successfully!");
    }

    // EDIT VEHICLE

    else if (action === "edit-vehicle") {

        const vehicle = data.vehicles.find(v => v.id === id);
        if (!vehicle) return;

        const name = prompt("Vehicle name:", vehicle.name);
        if (name === null || !name.trim()) return;

        const plate = prompt("Plate number:", vehicle.plate);
        if (plate === null || !plate.trim()) return;

        const status = prompt(
            "Status: Available, Rented, Maintenance",
            vehicle.status
        );

        if (status === null) return;

        const validStatuses = ["Available", "Rented", "Maintenance"];

        if (!validStatuses.includes(status.trim())) {
            alert("Invalid vehicle status.");
            return;
        }

        vehicle.name = name.trim();
        vehicle.plate = plate.trim();
        vehicle.status = status.trim();

        saveData();
        renderPage();
    }

    // DELETE VEHICLE

    else if (action === "delete-vehicle") {

        if (!confirm("Delete this vehicle?")) return;

        data.vehicles = data.vehicles.filter(v => v.id !== id);

        saveData();
        renderPage();

        alert("Vehicle deleted!");
    }

    // ADD MAINTENANCE

    else if (action === "add-maintenance") {

        const vehicle = prompt("Enter vehicle name:");
        if (!vehicle || !vehicle.trim()) return;

        const issue = prompt("Enter maintenance issue:");
        if (!issue || !issue.trim()) return;

        data.maintenance.push({
            id: Date.now(),
            vehicle: vehicle.trim(),
            issue: issue.trim(),
            date: new Date().toISOString().slice(0, 10),
            status: "Pending"
        });

        saveData();
        renderPage();

        alert("Maintenance record added!");
    }

    // COMPLETE MAINTENANCE

    else if (action === "maintenance-complete") {

        const record = data.maintenance.find(m => m.id === id);
        if (!record) return;

        record.status = "Completed";

        saveData();
        renderPage();

        alert("Maintenance marked as completed!");
    }

    // ADD RENTAL

    else if (action === "add-rental") {

        const customer = prompt("Enter customer name:");
        if (!customer || !customer.trim()) return;

        const vehicle = prompt("Enter vehicle name:");
        if (!vehicle || !vehicle.trim()) return;

        const available = data.vehicles.find(v =>
            v.name.toLowerCase() === vehicle.trim().toLowerCase() &&
            v.status === "Available"
        );

        if (!available) {
            alert("Vehicle not found or not available.");
            return;
        }

        data.rentals.push({
            id: Date.now(),
            customer: customer.trim(),
            vehicle: available.name,
            date: new Date().toISOString().slice(0, 10),
            status: "Upcoming"
        });

        available.status = "Rented";

        saveData();
        renderPage();

        alert("Rental added successfully!");
    }

    // RETURN VEHICLE

    else if (action === "return-vehicle") {

        const rental = data.rentals.find(r => r.id === id);

        if (!rental || rental.status === "Returned") return;

        if (!confirm("Confirm vehicle return?")) return;

        rental.status = "Returned";

        const vehicle = data.vehicles.find(
            v => v.name === rental.vehicle
        );

        if (vehicle && vehicle.status === "Rented") {
            vehicle.status = "Available";
        }

        saveData();
        renderPage();

        alert("Vehicle successfully returned!");
    }

    // EXPORT PAYMENTS

    else if (action === "export-payments") {

        const headers = ["ID", "Customer", "Amount", "Method", "Status"];

        const rows = data.payments.map(p => [
            p.id,
            p.customer,
            p.amount,
            p.method,
            p.status
        ]);

        const csv = [
            headers,
            ...rows
        ].map(row =>
            row.map(value =>
                `"${String(value).replace(/"/g, '""')}"`
            ).join(",")
        ).join("\n");

        const blob = new Blob([csv], {
            type: "text/csv;charset=utf-8;"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "JCLMR_Payment_Report.csv";

        link.click();

        URL.revokeObjectURL(url);
    }

});

// ==========================================
// INITIALIZE DASHBOARD
// ==========================================

renderPage();

console.log("JCLMR Drive Head Admin Dashboard Loaded!");
