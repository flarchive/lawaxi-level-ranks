<?php

use Flarum\Database\Migration;

return Migration::addColumns('users', [
    'verification' => ['string', 'length' => 100, 'nullable' => true],
    'theme' => ['integer', 'nullable' => true],
    'hastheme' => ['string', 'length' => 8964,'nullable' => true],
    'vip' => ['integer', 'nullable' => true],
    'balance' => ['integer', 'nullable' => true]
]);
