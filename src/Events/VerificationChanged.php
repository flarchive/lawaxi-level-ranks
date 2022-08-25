<?php
namespace Lawaxi\LevelRanks\Events;

use Flarum\User\User;

class VerificationChanged
{

    public $user;
    public $actor;
    public $verification;

    public function __construct(User $user, User $actor, string $verification)
    {
        $this->user = $user;
        $this->actor = $actor;
        $this->verification = $verification;
    }
}
