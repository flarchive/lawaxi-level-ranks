<?php

namespace Lawaxi\LevelRanks\Theme\Serializers;
use Flarum\Api\Serializer\AbstractSerializer;

class ThemesSerializer extends AbstractSerializer
{
    /**
     * {@inheritdoc}
     */
    protected $type = 'themes';

    /**
     * {@inheritdoc}
     */
    protected function getDefaultAttributes($themes)
    {
        return [
            'id'              => $themes->id,
            'title'           => $themes->title,
            'price'           => $themes->price,
            'icon'            => $themes->icon,
            'icon_color'      => $themes->icon_color,
            'frame'           => $themes->frame,
            'favicon'         => $themes->favicon,
            'color_p'         => $themes->color_p,
            'color_s'         => $themes->color_s,
        ];
    }

}
