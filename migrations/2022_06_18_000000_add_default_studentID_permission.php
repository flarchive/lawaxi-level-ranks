<?php

use Flarum\Database\Migration;
use Flarum\Group\Group;

return Migration::addPermissions([
    'viewStudentID' => Group::ADMINISTRATOR_ID,
]);
