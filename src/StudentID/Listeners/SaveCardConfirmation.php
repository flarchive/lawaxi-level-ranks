<?php

namespace Lawaxi\LevelRanks\StudentID\Listeners;

use Flarum\User\Event\Saving;
use Illuminate\Support\Arr;

class SaveCardConfirmation
{
    public function handle(Saving $event)
    {

        $user = $event->user;
        $data = $event->data;
        $actor = $event->actor;
        $attributes = Arr::get($data, 'attributes', []);
    }
}
