<?php

namespace Lawaxi\LevelRanks\StudentID\Access;

use Flarum\User\User;
use Flarum\User\Access\AbstractPolicy;

class UserPolicy extends AbstractPolicy
{
    public function uploadStudentID(User $actor, User $user)
    {
        if(($user->is_studentID_confirmed || 0) == 0) // var of boolean
            return $this->allow();
        else
            return $this->deny();
    }

}
