<?php
require_once __DIR__ . '/../app/bootstrap.php';
if (current_user()) {
    redirect(dashboard_for_role(current_user()['role']));
}
redirect('login.php');
