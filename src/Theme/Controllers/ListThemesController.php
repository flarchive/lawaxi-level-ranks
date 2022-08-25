<?php

namespace Lawaxi\LevelRanks\Theme\Controllers;

use Flarum\Api\Controller\AbstractListController;
use Lawaxi\LevelRanks\Theme\Serializers\ThemesSerializer;
use Lawaxi\LevelRanks\Theme\Theme;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class ListThemesController extends AbstractListController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = ThemesSerializer::class;

    /**
     * {@inheritdoc}
     */
    public $include = [
        'id',
        'title',
        'price',
        'icon',
        'icon_color',
        'frame',
        'favicon',
        'color_p',
        'color_s'
    ];
    protected function data(ServerRequestInterface $request, Document $document)
    {
        return Theme::all();
    }
}
