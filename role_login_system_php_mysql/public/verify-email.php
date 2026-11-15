<?php
require_once __DIR__ . '/../app/bootstrap.php';

$token = (string)($_GET['token'] ?? '');
$message = 'This verification link is invalid or has expired.';
$type = 'error';

if ($token !== '' && preg_match('/^[a-f0-9]{64}$/', $token)) {
    $hash = hash('sha256', $token);
    $stmt = db()->prepare(
        'SELECT id FROM users WHERE verification_token_hash = ? AND verification_expires_at > NOW() AND email_verified_at IS NULL LIMIT 1'
    );
    $stmt->execute([$hash]);
    $user = $stmt->fetch();
    if ($user) {
        $update = db()->prepare(
            'UPDATE users SET email_verified_at = NOW(), verification_token_hash = NULL, verification_expires_at = NULL WHERE id = ?'
        );
        $update->execute([$user['id']]);
        $message = 'Your email address is verified. You can now log in.';
        $type = 'success';
    } else {
        $check = db()->prepare('SELECT id,email_verified_at FROM users WHERE verification_token_hash IS NULL AND email_verified_at IS NOT NULL');
        // Do not reveal account details; invalid/used links receive the same safe message.
    }
}
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Email verification</title><link rel="stylesheet" href="assets/style.css"></head><body>
<div class="topbar"><div class="brand">Role-Based Login System</div></div>
<div class="container"><div class="card auth-card"><h1>Email verification</h1><div class="alert <?= e($type) ?>"><?= e($message) ?></div><a class="btn" href="login.php">Go to login</a></div></div></body></html>
