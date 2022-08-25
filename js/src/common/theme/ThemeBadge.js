import Badge from 'flarum/forum/components/Badge';

export default class ThemeBadge extends Badge {
  static initAttrs(attrs) {
    super.initAttrs(attrs);
    attrs.type = 'theme';
  }
}
