<?php

namespace Lawaxi\LevelRanks\Serializers;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\User;

class AddVerificationAttribute
{
    public function __invoke(UserSerializer $serializer, User $user, array $attributes): array
    {
        $attributes['verification'] = $user->verification;
        $attributes['theme'] = $user->theme;
        $attributes['hastheme'] = $user->hastheme;
        $attributes['vip'] = $user->vip;
        $attributes['balance'] = $user->balance;
        $attributes['is_studentID_confirmed'] = $user->is_studentID_confirmed;
        $attributes['team'] = substr($user->is_studentID_confirmed,0,4);
        return $attributes;
    }
}
