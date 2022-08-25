<?php

namespace Lawaxi\LevelRanks\StudentID;

use Illuminate\Support\Str;
use Intervention\Image\Image;
use Illuminate\Contracts\Filesystem\Factory;
use Illuminate\Contracts\Filesystem\Filesystem;
use Flarum\User\User;
use Flarum\Settings\SettingsRepositoryInterface;
use League\Flysystem\FilesystemInterface;

class CardUploader
{
    /**
     * @var Filesystem
     */
    protected $studentIDsDir;

    /**
     * @var SettingsRepositoryInterface
     */
    protected $config;

    /**
     * @param FilesystemInterface $studentIDsDir
     */
    public function __construct(Factory $filesystem, SettingsRepositoryInterface $config)
    {
        $this->studentIDsDir = $filesystem->disk('lawaxi-level-ranks');
        $this->config = $config;
    }

    /**
     * @param User $user
     * @param Image $image
     */
    public function upload(User $user, Image $image)
    {
        if (extension_loaded('exif')) {
            $image->orientate();
        }

        if ($image->width() > 2500) {
            $image->resize(2500, null, function($constraint) {
                $constraint->aspectRatio();
            });
        }

        $encodedImage = $image->encode('jpg');
        $studentIDPath = Str::random() . '.jpg';

        $this->remove($user);
        $user->studentID = $studentIDPath;

        $this->studentIDsDir->put($studentIDPath, $encodedImage);
    }

    /**
     * @param User $user
     */
    public function remove(User $user)
    {
        $studentIDPath = $user->studentID;

        if (empty($studentIDPath))
            return;

        $user->afterSave(function () use ($studentIDPath) {
            if ($this->studentIDsDir->exists($studentIDPath)) {
                $this->studentIDsDir->delete($studentIDPath);
            }
        });

        $user->studentID = null;
    }
}
