<?php

use Flarum\Database\Migration;
use Illuminate\Database\Schema\Blueprint;

return Migration::createTable('themes', function (Blueprint $table) {
    $table->increments('id');
    $table->string('title');
    $table->integer('price');
    $table->string('icon');
    $table->string('icon-color');
    $table->string('frame');
    $table->string('favicon');
    $table->string('color-p');
    $table->string('color-s');
});
