<?php

namespace Lawaxi\LevelRanks\Theme\Controllers;

use Flarum\Api\Controller\AbstractShowController;
use Illuminate\Support\Arr;
use Lawaxi\LevelRanks\Theme\Serializers\ThemesSerializer;
use Lawaxi\LevelRanks\Theme\Theme;
use Psr\Http\Message\ServerRequestInterface as Request;
use Tobscure\JsonApi\Document;

class ShowThemesController extends AbstractShowController
{
    public $serializer = ThemesSerializer::class;

    protected function data(Request $request, Document $document)
    {
        $id = Arr::get($request->getQueryParams(), 'id');
        return Theme::findOrFail($id);
    }
}
