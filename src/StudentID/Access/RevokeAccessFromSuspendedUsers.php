<?php

namespace Lawaxi\LevelRanks\StudentID\Access;

use Flarum\Group\Group;
use Flarum\User\User;

class RevokeAccessFromSuspendedUsers
{
    /**
     * @param User $user
     * @param array $groupIds
     */
    public function __invoke(User $user, array $groupIds)
    {
        if(($user->is_studentID_confirmed || 0) == 0)
            return [Group::GUEST_ID];

        return $groupIds;
    }
}
