import {extend} from 'flarum/common/extend';
import EditUserModal from 'flarum/common/components/EditUserModal';
import Stream from 'flarum/common/utils/Stream';
import User from 'flarum/common/models/User';
import Model from 'flarum/common/Model';
import getAllThemes from "../common/theme/getAllThemes";
import doesHaveTheme from "../common/theme/doesHaveTheme";
import ThemeBadge from "../common/theme/ThemeBadge";

export default function (app) {

  User.prototype.verification = Model.attribute('verification');
  User.prototype.theme = Model.attribute('theme');
  User.prototype.hastheme = Model.attribute('hastheme');
  User.prototype.vip = Model.attribute('vip');
  User.prototype.balance = Model.attribute('balance');
  User.prototype.studentID = Model.attribute('studentID');
  User.prototype.is_studentID_confirmed = Model.attribute('is_studentID_confirmed');



  extend(EditUserModal.prototype, 'oninit', function () {
    this.verification = Stream(this.attrs.user.verification());
    this.theme = Stream(this.attrs.user.theme() || 1) ;
    this.hastheme = {};
    this.studentID = Stream(this.attrs.user.studentID()  || (app.forum.attribute('lawaxi-level-ranks.studentID_example') || "https://lawaxi.net/assets/cardExample.jpg"))
    this.is_studentID_confirmed = Stream(this.attrs.user.is_studentID_confirmed() || 0);
    this.donate = Stream(0);
    this.themes = getAllThemes();

    this.themes
      .forEach((theme) => {
        this.hastheme[theme.id()] = Stream(doesHaveTheme(theme.id(), this.attrs.user));
      });
  });

  extend(EditUserModal.prototype, 'fields', function (items) {
    items.add(
      'verification',
      <div className="Form-group">
        <label>{app.translator.trans('lawaxi-level-ranks.forum.userUtil.verification')}</label>
        <input
          className="FormControl"
          placeholder={app.translator.trans('lawaxi-level-ranks.forum.userUtil.verification2')}
          bidi={this.verification}
        />
      </div>,
      3
    );
    items.add(
      'theme',
      <div className="Form-group">
        <label>{app.translator.trans('lawaxi-level-ranks.forum.userUtil.currentTheme')}</label>
        <input
          className="FormControl"
          placeholder={app.translator.trans('lawaxi-level-ranks.forum.userUtil.currentTheme2')}
          bidi={this.theme}
        />
      </div>,
      2
    );


    items.add(
      'ownedtheme',
      <div className="Form-group EditUserModal-ownedtheme">
        <label>{app.translator.trans('lawaxi-level-ranks.forum.userUtil.hasTheme')}</label>
        <div>
          {
            this.themes
              .map((theme) => {
                return(
                  <label className="checkbox">
                    <input
                      type="checkbox"
                      bidi={this.hastheme[theme.id()]}
                    />
                    {ThemeBadge.component({
                      icon: (theme.icon() || app.translator.trans('lawaxi-level-ranks.forum.theme.defaultIcon')),
                      color: (theme.icon_color() || app.translator.trans('lawaxi-level-ranks.forum.theme.defaultIconColor'))
                    })}
                    {theme.title() || app.translator.trans('lawaxi-level-ranks.forum.theme.defaultTitle')}
                  </label>
                );
              })
          }
        </div>
      </div>,
      1);

    //学号认证
    items.add(
      'studentID',
      <div className="Form-group">
        <label>{app.translator.trans('lawaxi-level-ranks.forum.settings.sc1')}</label>
        <img class="FormControl_Image" src={this.studentID()} />
        <label className="checkbox">
          <input
            className="FormControl"
            placeholder={app.translator.trans('20220424')}
            bidi={this.is_studentID_confirmed}
          />
        </label>
      </div>,
      30
    );

    //手动充值
    items.add(
      'donate',
      <div className="Form-group">
        <label>{app.translator.trans('lawaxi-level-ranks.forum.userUtil.vip',{balance: this.attrs.user.balance() || 0, vip: this.attrs.user.vip() || 0 })}</label>
        <input
          className="FormControl"
          placeholder={app.translator.trans('lawaxi-level-ranks.forum.userUtil.vip2')}
          bidi={this.donate}
        />
      </div>,
      31
    );
  });

  extend(EditUserModal.prototype, 'data', function (data) {
    if (this.verification() !== this.attrs.user.verification()) {
      data.verification = this.verification();
    }
    if (this.theme() !== this.attrs.user.theme()) {
      data.theme = this.theme();
    }
    if (this.is_studentID_confirmed() !== this.attrs.user.is_studentID_confirmed()) {
      data.is_studentID_confirmed = this.is_studentID_confirmed();
    }
    if((this.donate() || 0) !== 0){
      data.donate = this.donate();
    }

    let a = [];
    Object.keys(this.hastheme)
      .forEach((id) => {
        if(this.hastheme[id]()){
          a.push(id);
        }
      });
    if(a.join(',') !== this.attrs.user.hastheme()){
      data.hastheme = a.join(',');
    }
  });
}
