<?php

namespace Lawaxi\LevelRanks;

use Flarum\Api\Serializer\UserSerializer;
use Flarum\Extend;
use Flarum\Foundation\Paths;
use Flarum\Http\UrlGenerator;
use Flarum\User\Event\Saving;
use Flarum\User\User;
use Lawaxi\LevelRanks\Controller\PayController;
use Lawaxi\LevelRanks\Events\VerificationChanged;
use Lawaxi\LevelRanks\Listeners\SaveUser;
use Lawaxi\LevelRanks\Listeners\VerificationChangedNotification;
use Lawaxi\LevelRanks\Notification\VerificationBlueprint;
use Lawaxi\LevelRanks\Serializers\AddVerificationAttribute;
use Lawaxi\LevelRanks\StudentID\Access\RevokeAccessFromSuspendedUsers;
use Lawaxi\LevelRanks\StudentID\Access\UserPolicy;
use Lawaxi\LevelRanks\StudentID\Controller\UploadCardController;
use Lawaxi\LevelRanks\StudentID\Listeners\CardRelationship;
use Lawaxi\LevelRanks\StudentID\Listeners\SaveCardConfirmation;
use Lawaxi\LevelRanks\Theme\Controllers\CurrentThemeController;
use Lawaxi\LevelRanks\Theme\Controllers\ListThemesController;
use Lawaxi\LevelRanks\Theme\Controllers\ShowThemesController;
use Lawaxi\LevelRanks\Theme\Serializers\ThemesSerializer;

return [

    //Frontend
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    //配置

    (new Extend\Settings())
        ->serializeToForum('lawaxi-level-ranks.address', 'lawaxi-level-ranks.address')
        ->serializeToForum('lawaxi-level-ranks.payCode', 'lawaxi-level-ranks.payCode')
        ->serializeToForum('lawaxi-level-ranks.studentID_example', 'lawaxi-level-ranks.studentID_example')
        ->serializeToForum('lawaxi-level-ranks.studentID_maxSize', 'lawaxi-level-ranks.studentID_maxSize'),

    //Routes
    (new Extend\Routes('api'))
        ->get('/themes', 'themes.index', ListThemesController::class)
        ->get('/themes/{id}', 'themes.show', ShowThemesController::class)
        ->get('/theme', 'themes.current', CurrentThemeController::class)
        ->post('/users/{id}/card', 'users.card.upload', UploadCardController::class)
        ->post('/users/{id}/pay', 'users.pay', PayController::class),

    (new Extend\Filesystem())
        ->disk('lawaxi-level-ranks', function (Paths $paths, UrlGenerator $url) {
            return [
                'root'   => "$paths->public/assets/studentIDs",
                'url'    => $url->to('forum')->path('assets/studentIDs')
            ];
        }),


    //学生卡不允许更改
    (new Extend\Policy())
        ->modelPolicy(User::class, UserPolicy::class),
      //  ->globalPolicy(GlobalPolicy::class),

    (new Extend\User())
        ->permissionGroups(RevokeAccessFromSuspendedUsers::class),

    //Events & Listeners (Callback)
    (new Extend\Event())
        ->listen(Saving::class, SaveUser::class)
        ->listen(Saving::class, SaveCardConfirmation::class)
        ->listen(VerificationChanged::class, VerificationChangedNotification::class),

    //前后端匹配
    (new Extend\ApiSerializer(UserSerializer::class))
        ->attributes(AddVerificationAttribute::class)
        ->hasMany('themes', ThemesSerializer::class)
        ->attributes(CardRelationship::class),

    (new Extend\Notification())
        ->type(VerificationBlueprint::class, UserSerializer::class, ['alert', 'email']),

    //View
    (new Extend\View())
        ->namespace('lawaxi-level-ranks', __DIR__.'/views'),
];
