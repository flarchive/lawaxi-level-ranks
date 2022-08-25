<?php

namespace Lawaxi\LevelRanks\StudentID\Listeners;

use Flarum\Foundation\Paths;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\User;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Contracts\Filesystem\Filesystem;

class CardRelationship
{
    /**
     * @var \Flarum\Foundation\Paths
     */
    protected $paths;

    /**
     * @var Filesystem
     */
    protected $studentIDsDir;

    /**
     * @param \Flarum\Foundation\Paths $paths
     */
    public function __construct(Paths $paths, Factory $filesystem)
    {
        $this->paths = $paths;
        $this->studentIDsDir = $filesystem->disk('lawaxi-level-ranks');
    }

    /**
     * @param UserSerializer $serializer
     * @param User $user
     * @return array
     */
    public function __invoke(UserSerializer $serializer, User $user): array
    {
        return [
            'studentID' => $user->studentID ? $this->studentIDsDir->url($user->studentID) : $user->studentID,
        ];
    }
}
