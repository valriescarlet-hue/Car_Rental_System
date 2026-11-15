<?php
// Copy to config/config.local.php and enter your own credentials.
// Keep config.local.php private; do not upload it to a public repository.
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
        'base_url' => 'http://localhost/role_login_system/public',
        'session_name' => 'role_login_session',
    ],
    'mail' => [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'username' => 'yourgmail@gmail.com',
        'password' => 'YOUR_16_CHARACTER_GOOGLE_APP_PASSWORD',
        'from_email' => 'yourgmail@gmail.com',
        'from_name' => 'Role-Based Login System',
        'encryption' => 'tls',
    ],
];
