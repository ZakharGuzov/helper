<?php

include_once 'Lock.php';

$obj = json_decode($_POST["q"], false);
$lock = new Lock($obj->lock);

$myObj = new stdClass();
$myObj->lock = $lock->getLock();
if ($obj->close) {
    $lock->close();
}

echo json_encode($myObj);

?>