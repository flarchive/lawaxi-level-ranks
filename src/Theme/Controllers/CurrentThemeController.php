<?php

namespace Lawaxi\LevelRanks\Theme\Controllers;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Lawaxi\LevelRanks\Theme\Serializers\ThemesSerializer;
use Lawaxi\LevelRanks\Theme\Theme;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tobscure\JsonApi\Document;

class CurrentThemeController extends AbstractShowController
{

    public $serializer = ThemesSerializer::class;

    protected function data(Request $request, Document $document)
    {
        return RequestUtil::getActor($request)->theme || Theme::findOrFail(1);
    }
}
