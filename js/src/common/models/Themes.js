import Model from 'flarum/common/Model';
import mixin from 'flarum/utils/mixin';

export default class Themes extends mixin(Model, {
  id: Model.attribute('id'),
  title: Model.attribute('title'),
  price: Model.attribute('price'),
  icon: Model.attribute('icon'),
  icon_color: Model.attribute('icon-color'),
  frame: Model.attribute('frame'), //头像框文件名，不加frame前缀
  favicon: Model.attribute('favicon'),
  color_p: Model.attribute('color-p'),
  color_s: Model.attribute('color-s')
}) {}
