<?php

include_once 'Lock.php';
include_once 'Download.php';

$lock = new Lock("download.lock");

$path = "http://10.200.121.24/cc/soft/logs_new/";
$fileName = "ra_handling.log";
$download = new Download($path, $fileName);
$lock->close();

?>