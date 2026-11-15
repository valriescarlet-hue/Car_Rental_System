<?php
declare(strict_types=1);

function e(?string $value): string
{
    return htmlspecialchars($value ?? '', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function redirect(string $path): never
{
    global $config;
    header('Location: ' . rtrim($config['app']['base_url'], '/') . '/' . ltrim($path, '/'));
    exit;
}

function set_flash(string $type, string $message): void
{
    $_SESSION['flash'] = ['type' => $type, 'message' => $message];
}

function get_flash(): ?array
{
    $flash = $_SESSION['flash'] ?? null;
    unset($_SESSION['flash']);
    return $flash;
}

function csrf_token(): string
{
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function verify_csrf(): void
{
    $sent = $_POST['csrf_token'] ?? '';
    if (!is_string($sent) || !hash_equals(csrf_token(), $sent)) {
        http_response_code(419);
        exit('Invalid request token. Please go back and try again.');
    }
}

function current_user(): ?array
{
    return $_SESSION['user'] ?? null;
}

function require_login(): array
{
    $user = current_user();
    if (!$user) {
        set_flash('error', 'Please log in first.');
        redirect('login.php');
    }
    return $user;
}

function require_role(array $roles): array
{
    $user = require_login();
    if (!in_array($user['role'], $roles, true)) {
        http_response_code(403);
        exit('403 Forbidden: You do not have permission to view this page.');
    }
    return $user;
}

function dashboard_for_role(string $role): string
{
    // Role routing uses if / else if / else as requested.
    if ($role === 'staff') {
        return 'staff-dashboard.php';
    } else if ($role === 'admin') {
        return 'admin-dashboard.php';
    } else if ($role === 'headadmin') {
        return 'headadmin-dashboard.php';
    } else if ($role === 'customer') {
        return 'customer-dashboard.php';
    } else {
        return 'login.php';
    }
}

function send_verification_email(string $to, string $name, string $token): bool
{
    global $config;
    $autoload = __DIR__ . '/../vendor/autoload.php';
    if (!is_file($autoload)) {
        error_log('PHPMailer is missing. Run composer install.');
        return false;
    }
    require_once $autoload;

    $mailConfig = $config['mail'];
    $verifyUrl = rtrim($config['app']['base_url'], '/') . '/verify-email.php?token=' . urlencode($token);

    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host = $mailConfig['host'];
        $mail->SMTPAuth = true;
        $mail->Username = $mailConfig['username'];
        $mail->Password = $mailConfig['password'];
        $mail->SMTPSecure = $mailConfig['encryption'] === 'ssl'
            ? PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS
            : PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = (int)$mailConfig['port'];
        $mail->CharSet = 'UTF-8';
        $mail->setFrom($mailConfig['from_email'], $mailConfig['from_name']);
        $mail->addAddress($to, $name);
        $mail->isHTML(true);
        $mail->Subject = 'Verify your email address';
        $safeName = e($name);
        $safeUrl = e($verifyUrl);
        $mail->Body = "
            <div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px'>
              <h2>Email verification</h2>
              <p>Hello {$safeName},</p>
              <p>Click the button below to verify your email address and activate your account.</p>
              <p><a href='{$safeUrl}' style='display:inline-block;padding:12px 20px;background:#2563eb;color:#fff;text-decoration:none;border-radius:6px'>Verify my email</a></p>
              <p>If the button does not work, copy this link:</p>
              <p>{$safeUrl}</p>
              <p>This link expires in 24 hours. If you did not create this account, ignore this email.</p>
            </div>";
        $mail->AltBody = "Hello {$name}, verify your email using this link: {$verifyUrl}. The link expires in 24 hours.";
        $mail->send();
        return true;
    } catch (Throwable $ex) {
        error_log('Verification email error: ' . $ex->getMessage());
        return false;
    }
}
