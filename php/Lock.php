<?php

class Lock {

    private $fileName;
    private $prefix = "../tmp/";
    private $lock = false;

    public function __construct($fileName) {
        $this->fileName = $fileName;
        if (!is_file($this->prefix.$this->fileName)) {
            $file = fopen($this->prefix.$this->fileName, "w");
            fclose($file);
            $this->setLock(true);
        }
    }

    public function close() {
        unlink($this->prefix.$this->fileName);
    }

    public function getLock() {
        return $this->lock;
    }

    public function setLock($lock) {
        $this->lock = $lock;
    }
}
?>