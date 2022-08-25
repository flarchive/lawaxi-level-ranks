import Component from 'flarum/common/Component';

export default class FramePostUser extends Component {

  oninit(vnode) {
    super.oninit(vnode);
  }

  view() {
    const user = this.attrs.user;
    let theme = app.store.getById('themes',(user.attribute('theme') || 1));

    //囿于数据库调用的异步性
    if(theme === undefined)
    {
      app.themeList.load().then(() => m.redraw())
      return null;
    }

    if((theme.frame() || '') !== ''){
      return (
        <img class="Avatar-Frame" src={app.forum.attribute("lawaxi-level-ranks.address")+"assets/frames/frame_"+theme.frame()} alt="" />
      );
    }return null;
  }
}
