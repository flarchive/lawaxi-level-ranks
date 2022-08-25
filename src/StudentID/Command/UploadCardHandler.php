<?php

namespace Lawaxi\LevelRanks\StudentID\Command;

use Lawaxi\LevelRanks\StudentID\Events\SaveCard;
use Lawaxi\LevelRanks\StudentID\CardUploader;
use Lawaxi\LevelRanks\StudentID\CardValidator;
use Flarum\Foundation\Application;
use Flarum\Foundation\DispatchEventsTrait;
use Flarum\User\UserRepository;
use Illuminate\Contracts\Events\Dispatcher;
use Intervention\Image\ImageManager;

class UploadCardHandler
{
    use DispatchEventsTrait;

    /**
     * @var \Flarum\User\UserRepository
     */
    protected $users;

    /**
     * @var CardUploader
     */
    protected $uploader;

    /**
     * @var CardValidator
     */
    protected $validator;

    /**
     * @param Dispatcher $events
     * @param UserRepository $users
     * @param Application $app
     * @param CardUploader $uploader
     * @param CardValidator $validator
     */
    public function __construct(Dispatcher $events, UserRepository $users, CardUploader $uploader, CardValidator $validator)
    {
        $this->events = $events;
        $this->users = $users;
        $this->uploader = $uploader;
        $this->validator = $validator;
    }

    /**
     * @param UploadCard $command
     * @return \Flarum\User\User
     * @throws \Flarum\User\Exception\PermissionDeniedException
     * @throws \Illuminate\Validation\ValidationException
     */
    public function handle(UploadCard $command)
    {
        $actor = $command->actor;

        $user = $this->users->findOrFail($command->userId);

        $actor->assertCan('uploadStudentID', $user);

        $this->validator->assertValid(['studentID' => $command->file]);

        $image = (new ImageManager)->make($command->file->getStream());

        $this->events->dispatch(
            new SaveCard($user, $actor, $image)
        );

        $this->uploader->upload($user, $image);

        $user->save();

        $this->dispatchEventsFor($user, $actor);

        return $user;
    }
}
