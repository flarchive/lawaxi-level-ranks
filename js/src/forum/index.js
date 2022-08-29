import app from 'flarum/forum/app';
import {extend, override} from 'flarum/common/extend';
import PostUser from 'flarum/forum/components/PostUser';
import LevelBar from './components/LevelBar';
import VerificationNotification from "./notification/VerificationNotification";
import NotificationGrid from 'flarum/forum/components/NotificationGrid';
import UserPage from 'flarum/forum/components/UserPage';
import SettingsPage from 'flarum/forum/components/SettingsPage';
import UserCard from 'flarum/forum/components/UserCard';
import FramePostUser from "./components/FramePostUser";
import Themes from "../common/models/Themes";
import HeaderSecondary from 'flarum/components/HeaderSecondary';
import HeaderPrimary from 'flarum/components/HeaderPrimary';
import Button from 'flarum/forum/components/Button';
import ForumApplication from 'flarum/forum/ForumApplication';
import ThemeChooseModal from "./modal/ThemeChooseModal";
import StudentIDEditorModal from "./modal/StudentIDEditorModal";
import ThemeListState from "../common/states/ThemeListState";
import alertStudentConfirm from "./components/alertStudentConfirm";
import SignUpModal from 'flarum/forum/components/SignUpModal';
import doesStudentConfirmed from "../common/studentID/doesStudentConfirmed";
import extendEditUserModal from "./extendEditUserModal";
import FrameAvatarEditor from "./components/FrameAvatarEditor";
import TransferBalanceModal from "./modal/TransferBalanceModal";

app.initializers.add('lawaxi-level-ranks', (app) => {


    //注册新的Theme(Model)
    app.store.models.themes = Themes;
    app.themeList = new ThemeListState();

  extendEditUserModal(app);


  extend(PostUser.prototype, 'view', function (view) {
    const user = this.attrs.post.user();
    if (!user) return;
    view.children.push(LevelBar.component({user}));
    view.children.push(FramePostUser.component({user}));
  });


  extend(UserCard.prototype, 'view', function (view) {
    const user = this.attrs.user;
    if (!user) return;
    if(view.children[0]!==null){
      if(view.children[0].children[0]!==null){
        if(view.children[0].children[0].children[1]!=null){
			view.children[0].children[0].children[1].children.push(FrameAvatarEditor.component({user}));
        }
      }
    }
  })

    //Notification
    app.notificationComponents.verification = VerificationNotification;
    extend(NotificationGrid.prototype, 'notificationTypes', (items) => {
      items.add('verification', {
        name: 'verification',
        icon: app.translator.trans('lawaxi-level-ranks.forum.settings.vn_icon'),
        label: app.translator.trans('lawaxi-level-ranks.forum.settings.vn_label'),
      });
    });

  //UserCard 个人卡片
  extend(UserCard.prototype, 'infoItems', function (items) {
    let user = this.attrs.user;

    if ((user.attribute('verification') || "") !=="") {
      items.add('verification',
        <div class="UserVerification">
          <div class="UserVerification-content">
            <i aria-hidden="true" class="icon fas fa-crow Badge-icon">{app.translator.trans('lawaxi-level-ranks.forum.verification.display', {ver: user.attribute('verification') })}</i></div>
        </div>,0);
    }

    //届
    if((user.attribute('team') || '0') !== '0'){
      items.add('team',
        <span>{app.translator.trans('lawaxi-level-ranks.forum.team.display', {team: user.attribute('team') })}</span>,80);
    }
  });

  //学号认证按钮
  extend(SettingsPage.prototype, 'accountItems', function (items) {
    let user = this.user;
    if(!doesStudentConfirmed(user))
    {
      items.add(
        'studentID',
        <Button className="Button"  style="color: #d83e3e;" href={() => app.modal.show(StudentIDEditorModal, { user })}>
          {app.translator.trans(`lawaxi-level-ranks.forum.settings.studentID_button`)}
        </Button>
      );
    }
  });


  //UserPage 个人页面
  extend(UserPage.prototype, 'navItems', function (items) {
    const user = this.user;
    //items.get('discussions').priority = 110;

    //转账
    if(app.session.user && app.session.user !== user) {
      items.add(
        'transferBalance',
        <Button class={'TButton'} onclick={() => app.modal.show(TransferBalanceModal, {target: user, actor: app.session.user})}
                    icon="fas fa-credit-card">
          {app.translator.trans('lawaxi-level-ranks.forum.settings.transferBalance')}
        </Button>,
        1
      );
    }
  });

  //HeaderSecondary 导航栏按钮
  extend(HeaderSecondary.prototype, 'items', function (items) {
    if (app.session.user) {
      items.add(
        'theme',
        Button.component(
          {
            active: false,
            icon: 'fas fa-leaf',
            className: 'Button Button--flat',
            onclick: () => {
              if (app.session.user) {
                app.modal.show(ThemeChooseModal,this.attrs);
              }
            },
          },
          app.translator.trans('lawaxi-level-ranks.forum.chooseModal.header')
        ),
        9
      );

    }
  });


  //注：HeaderSecondary在页面加载前，HeaderSecondary在页面加载后
  extend(HeaderPrimary.prototype, 'items', function (items) {
    //提前加载(异步)
    app.themeList.load(['id']);
  });

  extend(ForumApplication.prototype, 'mount', function (view) {
    alertStudentConfirm(this);
  });


  extend(SignUpModal.prototype, 'fields', function (fields) {
    fields.add(
      'notice',
      <p>提示：每个账号在注册后都需经过邮箱验证和学号(学生卡)验证才可使用，注册即表明您同意<a href="https://lawaxi.net/d/184">《总法》</a>及其他社区规范内容。</p>
    );
  });
});

