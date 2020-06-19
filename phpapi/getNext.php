<?php
include '../functions.php';

$url = $_REQUEST['url'];

if(!isset($url)) die();

$conn = db__connect();

if(!db__rowNum($conn, "video", "url", $url)) die();


$res = db__getData($conn, "video", "url", $url);
$next = db__getData($conn, "video", "vid", $res[0]["link"]);

echo json_encode(array(
    url => $next[0]["url"]
));
