<?php

class Download {
  
    private $prefix = "../tmp/";

    public function __construct($path, $fileName) {
        $file = $path.$fileName;
        file_put_contents($this->prefix.$fileName, fopen($file, "r"));
    }
}
?>