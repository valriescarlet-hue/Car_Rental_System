<?php
// Run from terminal: php tools/create_user.php
// This script creates role accounts directly. It is intentionally CLI-only.
if (PHP_SAPI !== 'cli') {
    http_response_code(403);
    exit("Run this script from the command line only.\n");
}
require_once __DIR__ . '/../app/bootstrap.php';

echo "Create a role account\n";
$name = trim((string)readline("Full name: "));
$email = strtolower(trim((string)readline("Email: ")));
$password = (string)readline("Password (minimum 8 characters): ");
$role = strtolower(trim((string)readline("Role (staff/admin/headadmin/customer): ")));

$allowed = ['staff', 'admin', 'headadmin', 'customer'];
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8 || !in_array($role, $allowed, true)) {
    fwrite(STDERR, "Invalid input. No account was created.\n");
    exit(1);
}
$stmt = db()->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    fwrite(STDERR, "That email is already registered.\n");
    exit(1);
}

$token = bin2hex(random_bytes(32));
$tokenHash = hash('sha256', $token);
$stmt = db()->prepare(
    'INSERT INTO users (full_name,email,password_hash,role,verification_token_hash,verification_expires_at)
     VALUES (?,?,?,?,?,DATE_ADD(NOW(), INTERVAL 24 HOUR))'
);
$stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT), $role, $tokenHash]);

if (send_verification_email($email, $name, $token)) {
    echo "Created {$role} account for {$email}. A Gmail verification link has been sent. They cannot log in until they verify it.\n";
} else {
    echo "Account created, but email sending failed. Check Gmail SMTP settings and PHP error log. Account remains unverified.\n";
}
