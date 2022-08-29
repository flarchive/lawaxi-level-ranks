<?php

namespace Lawaxi\LevelRanks\Listeners;

use Flarum\Bus\Dispatcher;
use Flarum\User\Event\Saving;
use Illuminate\Support\Arr;
use Lawaxi\LevelRanks\Command\Pay;
use Lawaxi\LevelRanks\Events\VerificationChanged;
use Lawaxi\LevelRanks\Theme\Theme;

class SaveUser
{
    protected $events;

    /**
     * @param Dispatcher $events
     */
    public function __construct(Dispatcher $events)
    {
        $this->events = $events;
    }



    public function handle(Saving $event)
    {
        $user = $event->user;
        $data = $event->data;
        $actor = $event->actor;
        $attributes = Arr::get($data, 'attributes', []);

        if($actor->can('edit', $user)) {
            if (isset($attributes['verification'])) {
                if ($user->verification != $attributes['verification']) {
                    $user->verification = $attributes['verification'];
                    $user->raise(new VerificationChanged($user, $actor, $attributes['verification']));
                }
            }
            if (isset($attributes['hastheme'])) $user->hastheme = $attributes['hastheme'];
            if(isset($attributes['is_studentID_confirmed'])) $user->is_studentID_confirmed = $attributes['is_studentID_confirmed'];

            if (isset($attributes['donate'])){
                $user->balance = $user->balance + $attributes['donate'];
                $user->vip = $user->vip + $attributes['donate'];
            }
        }

        if (isset($attributes['buyTheme'])
            && $actor->id === $user->id
            && !in_array($attributes['buyTheme'],preg_split("/,/",$user->hastheme))){

            $price = Theme::findOrFail($attributes['buyTheme'])->price;
            if($price >= 0 && $user->balance >= $price){
                $user->balance = $user->balance - $price;
                $user->hastheme = $user->hastheme . ','. strval($attributes['buyTheme']);
                $user->theme = $attributes['buyTheme'];
            }
        }

        if (isset($attributes['theme'])){
            if(($actor->id === $user->id && in_array($attributes['theme'],preg_split("/,/",$user->hastheme)))
            || $actor->can('edit', $user)){
                $user->theme = $attributes['theme'];
            }
        }
        $user->save();

        if(isset($attributes['payAmount']) && $actor->id !== $user->id){
            $this->events->dispatch(
                new Pay($actor,$user,$attributes['payAmount']));
        }

    }
}
