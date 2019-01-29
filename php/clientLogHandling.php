<?php

include_once 'LogHandling.php';
include_once 'Download.php';

$log = new LogHandling();

$myObj = new stdClass();
$myObj->sizeDB = $log->getSizeDB();
$myObj->date = $log->getDate();
$myObj->time = $log->getTime();

echo json_encode($myObj);

?>