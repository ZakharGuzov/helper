<?php

include_once 'Connection.php';

$obj = json_decode($_POST["q"], false);

$link = Connection::doConnection();
$result = $link->query($obj->query);
$fields = $result->fetch_fields();
$arr = null;
while ($row = $result->fetch_assoc()) {
    foreach ($fields as $field) {
        $str = $field->name;
        $arr[$str][] = $row[$str];
    }
}
if ($arr == null) {
    $arr["result"] = false;
} else {
    $arr["result"] = true;
}
$boolTransfer = false;
foreach ($obj as $key => $value) {
    if ($key == "transfer") {
        $boolTransfer = true;
    }
}
if ($boolTransfer) {
    $arr["transfer"] = $obj->transfer;
} else {
    $arr["transfer"] = null;
}

echo json_encode($arr);

?>