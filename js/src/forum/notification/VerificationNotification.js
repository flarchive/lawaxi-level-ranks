import app from 'flarum/forum/app';
import Notification from 'flarum/forum/components/Notification';

export default class VerificationNotification extends Notification {
  icon() {
    return 'fas fa-carrot';
  }

  href() {
    return app.route.user(this.attrs.notification.subject());
  }

  content() {
    return app.translator.trans('lawaxi-level-ranks.notification.verification.content');
  }
}
