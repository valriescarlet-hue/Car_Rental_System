# Role-Based Login and Gmail Email Verification (PHP + MySQL)

A starter project for Visual Studio Code, PHP 8.1+, MySQL, and XAMPP. It includes:
- Registration (public registrations always receive the `customer` role).
- Secure password hashing and prepared SQL statements.
- Gmail SMTP verification link with a 24-hour expiry.
- Login blocked until email is verified.
- Role-based redirects and protected dashboards: Staff, Admin, Head Admin, Customer.
- CLI-only account creation for trusted staff/admin/headadmin accounts.
- CSRF tokens and session ID regeneration.

## 1. Requirements
- XAMPP (Apache, PHP 8.1+, MySQL/MariaDB)
- Composer
- Visual Studio Code
- A Gmail account with 2-Step Verification enabled

## 2. Put the project in XAMPP
Extract this folder to:
`C:\xampp\htdocs\role_login_system`

Open that folder in Visual Studio Code.

## 3. Create the database
1. Start Apache and MySQL in XAMPP.
2. Open phpMyAdmin: `http://localhost/phpmyadmin`
3. Import `database.sql`.

The database name is `role_login_system`.

## 4. Install PHPMailer
Open the VS Code terminal in the project folder and run:

```bash
composer install
```

If Composer is not installed, install Composer for Windows first, then reopen VS Code.

## 5. Configure Gmail SMTP
1. In your Google Account, turn on 2-Step Verification.
2. Create a Google App Password from Google Account > Security > App passwords (if the option is available for your account).
3. Copy `config/config.local.example.php` to `config/config.local.php`.
4. Put your MySQL and Gmail SMTP details in `config/config.local.php`.
5. For Gmail, use:
   - host: `smtp.gmail.com`
   - port: `587`
   - encryption: `tls`
   - username/from_email: your full Gmail address
   - password: your 16-character Google App Password, NOT your normal Gmail password
6. Set `base_url` to the exact local URL you use. For this folder, it is:
   `http://localhost/role_login_system/public`

Never publish `config.local.php` or your Gmail App Password.

## 6. Create role accounts
Normal registration creates Customer accounts only. This is deliberate: users must not be able to choose Admin or Head Admin for themselves.

From the project root in VS Code terminal, run:

```bash
php tools/create_user.php
```

Enter the person's name, email, password, and role:
- `staff`
- `admin`
- `headadmin`
- `customer`

Accounts created by this trusted CLI tool are marked email-verified. Use it only for accounts you personally authorize. If you want staff/admin users to verify Gmail too, change the insert in `tools/create_user.php` to store a verification token and send it with `send_verification_email()` instead.

Example:
- Mark → `staff` → Mark's Staff Dashboard
- Your admin Gmail → `admin` → Admin Dashboard
- Head administrator → `headadmin` → Head Admin Dashboard
- Public registration → `customer` → Customer Dashboard (after Gmail verification)

## 7. Open the website
Visit:
`http://localhost/role_login_system/public`

Register a customer account, open the Gmail inbox, click Verify my email, then log in.

## 8. How role redirection works
The role logic is in `app/helpers.php` in `dashboard_for_role()`:

```php
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
```

Each dashboard independently checks the session role. Typing another dashboard URL manually will not bypass the role check.

## Troubleshooting
- **Email does not arrive:** check Spam/Junk, Gmail address, App Password, SMTP settings, and PHP error log.
- **PHPMailer missing:** run `composer install` from the project root.
- **Database connection error:** confirm MySQL is running and credentials/database name are correct.
- **Verification link points to the wrong URL:** update `app.base_url` in `config/config.local.php`.
- **Expired verification link:** current starter code requires an administrator to recreate the account or add a resend-verification feature.

## Security notes before production
Use HTTPS on a real server, keep secrets outside the public web root, configure rate limiting and password reset, add audit logs and admin user-management screens, and restrict who can run the CLI account creation tool. This project is a functional local-development starter, not a complete production identity platform.
