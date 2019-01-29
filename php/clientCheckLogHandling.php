<?php

include_once 'Lock.php';
include_once 'Download.php';
include_once 'LogHandling.php';

$lock = new Lock("download.lock");
$myObj = new stdClass();
$myObj->lock = true;
if ($lock->getLock()) {
    $myObj->lock = false;

    $path = "http://10.200.121.24/cc/soft/";
    $fileName = "logrc.php";
    $download = new Download($path, $fileName);

    $log = new LogHandling();
    $log->setFileName($fileName);
    $web = $log->getSizeWeb();
    $myObj->webSize = $web;
    if ($log->getSizeDB() != $web) {
        $myObj->download = true;
    } else {
        $myObj->download = false;
        $lock->close();
    }
}

echo json_encode($myObj);

?>