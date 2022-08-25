<?php

namespace Lawaxi\LevelRanks\StudentID\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Api\Serializer\UserSerializer;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Lawaxi\LevelRanks\StudentID\Command\UploadCard;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class UploadCardController extends AbstractShowController
{
    /**
     * {@inheritdoc}
     */
    public $serializer = UserSerializer::class;

    /**
     * @var Dispatcher
     */
    protected $bus;

    /**
     * @param Dispatcher $bus
     */
    public function __construct(Dispatcher $bus)
    {
        $this->bus = $bus;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $id = Arr::get($request->getQueryParams(), 'id');
        $actor = $request->getAttribute('actor');
        $file = Arr::get($request->getUploadedFiles(), 'studentID');

        return $this->bus->dispatch(
            new UploadCard($id, $file, $actor)
        );
    }
}
