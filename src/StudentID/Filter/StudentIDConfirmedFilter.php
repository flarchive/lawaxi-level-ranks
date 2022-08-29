<?php

namespace Lawaxi\LevelRanks\StudentID\Filter;

use Flarum\Filter\FilterInterface;
use Flarum\Filter\FilterState;

class StudentIDConfirmedFilter implements FilterInterface
{
    public function getFilterKey(): string
    {
        return 'is_studentID_confirmed';
    }

    public function filter(FilterState $filterState, string $filterValue, bool $negate)
    {
        $filterState->getQuery()->where('is_studentID_confirmed', $negate ? '==': '!=', null);
    }
}
