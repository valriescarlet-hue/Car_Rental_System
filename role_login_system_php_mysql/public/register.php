<?php
require_once __DIR__ . '/../app/bootstrap.php';

if (current_user()) {
    redirect(dashboard_for_role(current_user()['role']));
}

$error = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $name = trim((string)($_POST['full_name'] ?? ''));
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    $password = (string)($_POST['password'] ?? '');

    if ($name === '' || strlen($name) > 120) {
        $error = 'Please enter your name (maximum 120 characters).';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $error = 'Please enter a valid email address.';
    } elseif (strlen($password) < 8) {
        $error = 'Password must be at least 8 characters.';
    } else {
        $stmt = db()->prepare('SELECT id FROM users WHERE email = ?');
        $stmt->execute([$email]);
        if ($stmt->fetch()) {
            $error = 'That email is already registered. Please log in instead.';
        } else {
            $token = bin2hex(random_bytes(32));
            $tokenHash = hash('sha256', $token);
            $stmt = db()->prepare(
                "INSERT INTO users (full_name,email,password_hash,role,verification_token_hash,verification_expires_at)
                 VALUES (?,?,?,'customer',?,DATE_ADD(NOW(), INTERVAL 24 HOUR))"
            );
            $stmt->execute([$name, $email, password_hash($password, PASSWORD_DEFAULT), $tokenHash]);
            if (send_verification_email($email, $name, $token)) {
                set_flash('success', 'Account created. Check your Gmail inbox and click the verification link before logging in.');
            } else {
                set_flash('error', 'Your account was created, but the verification email could not be sent. Check SMTP settings, then use the resend verification page or contact the administrator.');
            }
            redirect('login.php');
        }
    }
}
$flash = get_flash();
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Create account</title><link rel="stylesheet" href="assets/style.css"></head><body>
<div class="topbar"><div class="brand">Role-Based Login System</div><nav><a href="login.php">Login</a></nav></div>
<div class="container"><div class="card auth-card"><h1>Create account</h1><p class="muted">New public registrations are assigned the Customer role.</p>
<?php if ($flash): ?><div class="alert <?= e($flash['type']) ?>"><?= e($flash['message']) ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert error"><?= e($error) ?></div><?php endif; ?>
<form method="post">
<input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
<div class="field"><label for="full_name">Full name</label><input id="full_name" name="full_name" maxlength="120" required value="<?= e($_POST['full_name'] ?? '') ?>"></div>
<div class="field"><label for="email">Email address</label><input id="email" type="email" name="email" required value="<?= e($_POST['email'] ?? '') ?>"></div>
<div class="field"><label for="password">Password</label><input id="password" type="password" name="password" minlength="8" required></div>
<button class="btn" type="submit">Create account</button>
</form><p class="muted">Already registered? <a href="login.php">Log in</a>.</p></div></div></body></html>
