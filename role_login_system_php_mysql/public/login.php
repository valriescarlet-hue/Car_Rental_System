<?php
require_once __DIR__ . '/../app/bootstrap.php';

if (current_user()) {
    redirect(dashboard_for_role(current_user()['role']));
}
$error = '';
$flash = get_flash();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    verify_csrf();
    $email = strtolower(trim((string)($_POST['email'] ?? '')));
    $password = (string)($_POST['password'] ?? '');

    $stmt = db()->prepare('SELECT id,full_name,email,password_hash,role,email_verified_at FROM users WHERE email = ? LIMIT 1');
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        $error = 'Incorrect email or password.';
    } elseif ($user['email_verified_at'] === null) {
        $error = 'Please verify your email first. Open the verification email sent to your Gmail inbox.';
    } else {
        session_regenerate_id(true);
        $_SESSION['user'] = [
            'id' => (int)$user['id'],
            'full_name' => $user['full_name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ];
        redirect(dashboard_for_role($user['role']));
    }
}
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Login</title><link rel="stylesheet" href="assets/style.css"></head><body>
<div class="topbar"><div class="brand">Role-Based Login System</div><nav><a href="register.php">Create account</a></nav></div>
<div class="container"><div class="card auth-card"><h1>Login</h1><p class="muted">Sign in using your verified email address.</p>
<?php if ($flash): ?><div class="alert <?= e($flash['type']) ?>"><?= e($flash['message']) ?></div><?php endif; ?>
<?php if ($error): ?><div class="alert error"><?= e($error) ?></div><?php endif; ?>
<form method="post">
<input type="hidden" name="csrf_token" value="<?= e(csrf_token()) ?>">
<div class="field"><label for="email">Email address</label><input id="email" type="email" name="email" required autocomplete="username" value="<?= e($_POST['email'] ?? '') ?>"></div>
<div class="field"><label for="password">Password</label><input id="password" type="password" name="password" required autocomplete="current-password"></div>
<button class="btn" type="submit">Login</button>
</form><p class="muted">No account yet? <a href="register.php">Register here</a>.</p></div></div></body></html>
