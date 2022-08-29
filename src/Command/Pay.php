<?php

namespace Lawaxi\LevelRanks\Command;

use Flarum\User\User;
use Psr\Http\Message\UploadedFileInterface;

class Pay
{
    public $actor;
    public $target;
    public $amount;

    public function __construct($actor,$target,$amount)
    {
        $this->actor = $actor;
        $this->target = $target;
        $this->amount = $amount;
    }
}
