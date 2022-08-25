import getAllThemes from "../../common/theme/getAllThemes";
import Modal from 'flarum/common/components/Modal';
import ItemList from 'flarum/common/utils/ItemList';
import Button from 'flarum/forum/components/Button';
import doesHaveTheme from "../../common/theme/doesHaveTheme";

export default class ThemeChooseModal extends Modal {
  static isDismissible = true;

  className() {
    return 'ThemeChooseModal';
  }

  title() {
    return <p>{app.translator.trans('lawaxi-level-ranks.forum.chooseModal.title')}</p>;
  }


  content() {return(<div class="Modal-body">{this.fields().toArray()}</div>);
  }

  fields(){
    const items = new ItemList();
    const themes = getAllThemes();

    items.add(
      'themelist',
      <div>
        <label style="display: block;">
          {app.translator.trans('lawaxi-level-ranks.forum.chooseModal.top', {id: app.session.user.id() , balance: app.session.user.balance()})}
        </label>
        {
          themes
            .map((theme) => {
              return(Button.component(
                {
                  active: false,
                  icon: (theme.icon() || app.translator.trans('lawaxi-level-ranks.forum.theme.defaultIcon')),
                  className: 'Button Button--flat' +(
                    theme.id() === app.session.user.theme() ? ' CurrentTheme' :
                    (doesHaveTheme(theme.id(),app.session.user) ? ' OwnedTheme' : ' NownedTheme')),
                  disabled: !(doesHaveTheme(theme.id(),app.session.user) || theme.price()>=0),
                  onclick: () => {
                    app.session.user.save(doesHaveTheme(theme.id(),app.session.user) ? {theme: theme.id()} : {buyTheme: theme.id()}, { errorHandler: this.onerror.bind(this) })
                      .then(() => window.location.reload(), this.loaded.bind(this));
                  },
                },
                doesHaveTheme(theme.id(),app.session.user)?
                  app.translator.trans('lawaxi-level-ranks.forum.theme.showFormat2', {title: getThemeTitle(theme), price: theme.price()}) :
                  app.translator.trans('lawaxi-level-ranks.forum.theme.showFormat1', {title: getThemeTitle(theme), price: theme.price()})
              ));
            }
            )}

        <label style="display: block; padding-top: 50px; padding-bottom: 10px;">
          {app.translator.trans('lawaxi-level-ranks.forum.chooseModal.bottom', {id: app.session.user.id(), balance: app.session.user.balance()})}
        </label>
        <img src={app.forum.attribute("lawaxi-level-ranks.payCode")} />
      </div>,0);

    return items;
  }

  onsubmit() {
  }

}

function switchPrice(price){
  if(price === -1)
    return '非卖'
  if(price === -2)
    return '一周目纪念'
  if(price === -3)
    return '二周年纪念';
  else
    return price+'元';
}

function getThemeTitle(theme){
  return theme.title() || app.translator.trans('lawaxi-level-ranks.forum.theme.defaultTitle',{id:theme.id()})
}
