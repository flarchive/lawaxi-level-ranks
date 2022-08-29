<?php

namespace Lawaxi\LevelRanks\Notification;

use Flarum\Notification\Blueprint\BlueprintInterface;
use Flarum\Notification\MailableInterface;
use Flarum\User\User;
use Symfony\Contracts\Translation\TranslatorInterface;

class VerificationBlueprint implements BlueprintInterface, MailableInterface
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

    public function getSubject()
    {
        return $this->user;
    }

    public static function getSubjectModel()
    {
        return User::class;
    }

    public function getFromUser()
    {
        return $this->actor;
    }


    public function getData()
    {
        return $this->verification;
    }

    public static function getType()
    {
        return 'verification';
    }

    public function getEmailView()
    {
        return ['text' => 'lawaxi-level-ranks::verification'];
    }

    public function getEmailSubject(TranslatorInterface $translator)
    {
        return $translator->trans('lawaxi-level-ranks.email.verification.subject');
    }
}
