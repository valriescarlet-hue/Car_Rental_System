<?php
declare(strict_types=1);

// Copy this file to config/config.local.php for private settings, or edit these values.
return [
    'db' => [
        'host' => '127.0.0.1',
        'name' => 'role_login_system',
        'user' => 'root',
        'pass' => '',
        'charset' => 'utf8mb4',
    ],
    'app' => [
        'name' => 'Role-Based Login System',
        // Example: http://localhost/role_login_system/public
        'base_url' => 'http://localhost/role_login_system/public',
        'session_name' => 'role_login_session',
    ],
    'mail' => [
        // Gmail SMTP requires a Google App Password (not your normal Gmail password).
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'yourgmail@gmail.com',
        'password' => 'YOUR_16_CHARACTER_GOOGLE_APP_PASSWORD',
        'from_email' => 'yourgmail@gmail.com',
        'from_name' => 'Role-Based Login System',
        'encryption' => 'tls',
    ],
];
