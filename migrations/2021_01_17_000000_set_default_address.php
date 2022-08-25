<?php
use Illuminate\Database\Schema\Builder;
return [
    'up' => function (Builder $schema) {
        /**
         * @var \Flarum\Settings\SettingsRepositoryInterface
         */
        $settings = resolve('flarum.settings');

        $settings->set('lawaxi-level-ranks.address', "https://lawaxi.net/");
        $settings->set('lawaxi-level-ranks.payCode', "https://lawaxi.net/assets/payCode.jpg");
        $settings->set('lawaxi-level-ranks.cardExample', "https://lawaxi.net/assets/cardExample.jpg");
    },
    'down' => function (Builder $schema) {
        /**
         * @var \Flarum\Settings\SettingsRepositoryInterface
         */
        $settings = resolve('flarum.settings');
        $settings->delete('lawaxi-level-ranks.address');
        $settings->delete('lawaxi-level-ranks.payCode');
        $settings->delete('lawaxi-level-ranks.cardExample');
    },
];
