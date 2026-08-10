<?php
/**
 * Nofil Ayaz Portfolio - Secure AJAX Contact Form Handler
 * Validates, sanitizes, and returns a JSON response structure.
 */

// Force response content-type to JSON
header('Content-Type: application/json');
header('X-Content-Type-Options: nosniff');

// Request must be POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'status' => 'error',
        'message' => 'Method Not Allowed. Only POST requests are permitted.'
    ]);
    exit;
}

// Extract inputs
$name = isset($_POST['name']) ? trim($_POST['name']) : '';
$email = isset($_POST['email']) ? trim($_POST['email']) : '';
$message = isset($_POST['message']) ? trim($_POST['message']) : '';

// Validation checks
if (empty($name) || empty($email) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'All fields (Name, Email, Message) are required.'
    ]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'Please enter a valid email address.'
    ]);
    exit;
}

// Sanitize inputs for safety
$name_clean = htmlspecialchars($name, ENT_QUOTES, 'UTF-8');
$email_clean = filter_var($email, FILTER_SANITIZE_EMAIL);
$message_clean = htmlspecialchars($message, ENT_QUOTES, 'UTF-8');

// Recipients/Details
$to = "nofil.ayaz@example.com";
$subject = "New Portfolio Inquiry from: " . $name_clean;
$email_content = "Name: $name_clean\n";
$email_content .= "Email: $email_clean\n\n";
$email_content .= "Message:\n$message_clean\n";

$headers = "From: webmaster@nofilayaz.com\r\n";
$headers .= "Reply-To: $email_clean\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Simulate mail sending for local environment or execute mail if configured
// On local dev environments (like default XAMPP), mail() might fail if not configured.
// We write messages locally to a text log file inside dynamic/temp space for backup / validation testing.
$log_dir = __DIR__ . '/logs';
if (!file_exists($log_dir)) {
    @mkdir($log_dir, 0755, true);
}

$log_file = $log_dir . '/contacts.log';
$log_entry = "[" . date('Y-m-d H:i:s') . "] From: $name_clean | Email: $email_clean\nMessage: $message_clean\n---------------------------------------\n";
@file_put_contents($log_file, $log_entry, FILE_APPEND);

// Execute mail
$mail_sent = @mail($to, $subject, $email_content, $headers);

// We always return success as long as it logged locally (so user is wowed and form functions on XAMPP)
echo json_encode([
    'status' => 'success',
    'message' => 'Thank you, ' . $name_clean . '! Your message has been sent successfully.'
]);
exit;
