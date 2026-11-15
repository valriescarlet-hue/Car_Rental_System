<?php
require_once __DIR__ . '/../app/bootstrap.php';
$user = require_role(['staff']);
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Staff Dashboard</title><link rel="stylesheet" href="assets/style.css"></head><body>
<div class="topbar"><div class="brand">Role-Based Login System</div><nav><span><?= e($user['full_name']) ?></span> <a href="logout.php">Logout</a></nav></div>
<div class="container"><div class="card"><span class="role">STAFF</span><h1>Staff Dashboard</h1><p class="muted">Welcome to the staff workspace.</p><h2>Account information</h2><div class="grid"><div class="stat"><strong>Name</strong><p><?= e($user['full_name']) ?></p></div><div class="stat"><strong>Email</strong><p><?= e($user['email']) ?></p></div><div class="stat"><strong>Role</strong><p><?= e(ucfirst($user['role'])) ?></p></div></div><h2>Dashboard modules</h2><ul><li>View assigned tasks</li><li>Update work status</li><li>View customer requests</li></ul><p class="muted">This is a starter dashboard. Connect the listed modules to your project requirements.</p></div></div><div class="footer">Role-Based Login System</div></body></html>
