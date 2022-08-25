<?php

namespace Lawaxi\LevelRanks\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Api\Serializer\UserSerializer;
use Flarum\User\User;
use Illuminate\Contracts\Bus\Dispatcher;
use Illuminate\Support\Arr;
use Lawaxi\LevelRanks\StudentID\Command\UploadCard;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;

class PayController extends AbstractShowController
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
        $target_id = Arr::get($request->getQueryParams(), 'id');
        $amount = Arr::get($request->getQueryParams(), 'amount');
        $actor = $request->getAttribute('actor');

        return $this->bus->dispatch(
            new UploadCard(User::findOrFail($target_id),$actor,$amount));
    }
}
