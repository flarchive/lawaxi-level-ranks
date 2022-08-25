<?php
namespace Lawaxi\LevelRanks\Listeners;

use Flarum\Notification\NotificationSyncer;
use Lawaxi\LevelRanks\Events\VerificationChanged;
use Lawaxi\LevelRanks\Notification\VerificationBlueprint;

class VerificationChangedNotification
{
    /**
     * @var NotificationSyncer
     */
    protected $notifications;

    /**
     * @param NotificationSyncer $notifications
     */
    public function __construct(NotificationSyncer $notifications)
    {
        $this->notifications = $notifications;
    }

    /**
     * @param VerificationChanged $event
     */
    public function handle($event)
    {
        $this->notifications->sync(new VerificationBlueprint($event->user, $event->actor, $event->verification),[$event->user]);
    }
}
