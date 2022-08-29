<?php

namespace Lawaxi\LevelRanks\StudentID\Filter;

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;

class StudentIDFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'studentID';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $filterState->getQuery()->where('users.studentID', $negate ? '!=': '==', null);
    }
}
