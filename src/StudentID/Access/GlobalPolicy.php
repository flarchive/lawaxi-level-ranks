<?php

namespace Lawaxi\LevelRanks\StudentID\Access;

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class GlobalPolicy extends AbstractPolicy
{

    public function startDiscussion(User $actor)
    {
        if(($actor->is_studentID_confirmed || 0) == 0)
            return $this->deny();

        return null;
    }
}
