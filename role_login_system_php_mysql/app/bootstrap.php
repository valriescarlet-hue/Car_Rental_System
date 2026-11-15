<?php
declare(strict_types=1);

$config = require __DIR__ . '/../config/config.php';
$localConfig = __DIR__ . '/../config/config.local.php';
if (is_file($localConfig)) {
    $local = require $localConfig;
    $config = array_replace_recursive($config, $local);
}

if (session_status() !== PHP_SESSION_ACTIVE) {
    session_name($config['app']['session_name'] ?? 'role_login_session');
    session_set_cookie_params([
        'httponly' => true,
        'secure' => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
        'samesite' => 'Lax',
    ]);
    session_start();
}

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/helpers.php';
