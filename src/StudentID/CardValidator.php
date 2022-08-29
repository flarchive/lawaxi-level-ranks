<?php

namespace Lawaxi\LevelRanks\StudentID;

use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AvatarValidator;
use Illuminate\Validation\Factory;
use Intervention\Image\ImageManager;
use Symfony\Contracts\Translation\TranslatorInterface;

class CardValidator extends AvatarValidator
{
    /**
     * @var SettingsRepositoryInterface
     */
    protected $config;

    /**
     * {@inheritdoc}
     */
    public function __construct(Factory $validator, TranslatorInterface $translator, ImageManager $imageManager, SettingsRepositoryInterface $config)
    {
        parent::__construct($validator, $translator, $imageManager);

        $this->config = $config;
    }

    /**
     * {@inheritDoc}
     */
    public function assertValid(array $attributes)
    {
        $this->laravelValidator = $this->makeValidator($attributes);

        $this->assertFileRequired($attributes['studentID']);
        $this->assertFileMimes($attributes['studentID']);
        $this->assertFileSize($attributes['studentID']);
    }

    /**
     * @return int
     */
    protected function getMaxSize()
    {
        return (int) ($this->config->get('lawaxi-level-ranks.studentID_maxSize') ?? 666);
    }

    /**
     * @return string[]
     */
    protected function getAllowedTypes()
    {
        return ['jpeg', 'jpg', 'png', 'bmp'];
    }
}
