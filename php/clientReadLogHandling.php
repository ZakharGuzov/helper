<?php

include_once 'LogHandling.php';

$log = new LogHandling();
$log->setFileName("ra_handling.log");
$myObj = new stdClass();
$myObj->arr = $log->readLogHandling();

echo json_encode($myObj);

?>