<?php

include_once 'Connection.php';

$obj = json_decode($_POST["q"], false);
$link = Connection::doConnection();

$myObj = new stdClass();
if ($result = $link->query($obj->query)) {
    $myObj->insert = true;
} else {
    $myObj->insert = false;
}

echo json_encode($myObj);

?>