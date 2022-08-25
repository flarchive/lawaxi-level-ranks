<?php

use Flarum\Database\Migration;

return Migration::addColumns('users', [
    'studentID' => ['string','length' => 20,  'nullable' => true],
    'is_studentID_confirmed' => ['integer']
]);
