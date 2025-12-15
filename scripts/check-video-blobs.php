<?php
// Check video records in DB
require_once __DIR__ . '/../Database.php';

$db = Database::getInstance();

echo "Checking video records...\n";

$videos = $db->fetchAll('SELECT id, filename, mime_type, OCTET_LENGTH(image_data) as size FROM portfolio_uploads WHERE mime_type LIKE "video/%" ORDER BY created_at DESC');

foreach ($videos as $video) {
    echo "ID: {$video['id']}\n";
    echo "Filename: {$video['filename']}\n";
    echo "MIME: {$video['mime_type']}\n";
    echo "Size: {$video['size']} bytes\n";

    // Check first few bytes to see if it's actually MP4
    $blob = $db->fetchOne('SELECT LEFT(image_data, 20) as header FROM portfolio_uploads WHERE id = ?', [$video['id']]);
    $hex = bin2hex($blob['header']);
    echo "First 20 bytes (hex): $hex\n";

    // MP4 should start with ftyp or moov, but let's check common signatures
    if (strpos($hex, '66747970') !== false) { // ftyp
        echo "Looks like MP4 (ftyp box found)\n";
    } elseif (strpos($hex, '6d6f6f76') !== false) { // moov
        echo "Looks like MP4 (moov box found)\n";
    } else {
        echo "WARNING: Does not look like MP4 header!\n";
    }

    echo "---\n";
}
?>