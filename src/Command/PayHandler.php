<?php

namespace Lawaxi\LevelRanks\Command;

use Flarum\Foundation\DispatchEventsTrait;
use Flarum\User\UserRepository;
use Illuminate\Contracts\Events\Dispatcher;
use Lawaxi\LevelRanks\StudentID\Command\UploadCard;

class PayHandler
{
    use DispatchEventsTrait;
    public function __construct(Dispatcher $events, UserRepository $users)
    {
        $this->events = $events;
        $this->users = $users;
    }


    public $actor;
    public $target;
    public $amount;

    public function handle(Pay $command)
    {
        $actor = $command->actor;
        $target = $command->target;
        $amount = $command->amount;

        if($actor === $target)
            return null;

        if($actor !== null && $target !== null && $actor->balance >= $amount){
            $actor->balance = $actor->balance - $amount;
            $target->balance = $target->balance + $amount;
            $actor->save();
            $target->save();

            return $actor;
        }

        return null;
    }

}
