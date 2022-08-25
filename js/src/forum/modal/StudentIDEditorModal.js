import app from 'flarum/forum/app';
import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/forum/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import formatBytes from '../../common/formatBytes';


export default class StudentIDEditorModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.maxSize = parseFloat(app.forum.attribute('lawaxi-level-ranks.studentID_maxSize') || 666);

    this.alertAttrs = {
      content: app.translator.trans('lawaxi-level-ranks.forum.student_confirmation.notice', { size: formatBytes(this.maxSize * Math.pow(2, 10)) }),
    };

    this.loading = false;
    this.cover =
      this.attrs.user.studentID() ||
      (app.forum.attribute('lawaxi-level-ranks.studentID_example') || "https://lawaxi.net/assets/cardExample.jpg");
    this.context = '';
  }

  content() {
    let attrs = {};
    let className = 'Modal-image CoverEditor-cover';

    if (this.cover) {
      attrs.style = { backgroundImage: `url(${this.cover})`};
      className += ' CoverEditor-card';
    }

    return [
      <div className={className} {...attrs}>
        {this.loading ? <LoadingIndicator /> : ''}
      </div>,

      <div className="Modal-body">
        <div className="Form">{this.fieldsItems().toArray()}</div>
      </div>,
    ];
  }

  className() {
    return 'Cover-modal Modal--small';
  }

  title() {
    return app.translator.trans('lawaxi-level-ranks.forum.student_confirmation.title');
  }

  fieldsItems() {
    const items = new ItemList();

    items.add('actions', this.controlItems().toArray());

    return items;
  }

  controlItems() {
    const items = new ItemList();

    items.add(
      'upload',
      <Button icon="fas fa-upload" className="Button" onclick={this.openPicker.bind(this)}>
        {app.translator.trans('core.forum.user.avatar_upload_button')}
      </Button>
    );
    return items;
  }

  openPicker() {
    const input = $('<input type="file">');

    input
      .appendTo('body')
      .hide()
      .click()
      .on('change', (e) => {
        this.upload($(e.target)[0].files[0]);
      });
  }

  upload(file) {
    if (this.loading) return;

    const data = new FormData();
    data.append('studentID', file);

    this.loading = true;
    this.context = 'added';
    m.redraw();

    app
      .request({
        method: 'POST',
        url: `${app.forum.attribute('apiUrl')}/users/${this.attrs.user.id()}/card`,
        serialize: (raw) => raw,
        body: data,
      })
      .then(this.success.bind(this), this.failure.bind(this));
  }

  success(response) {
    app.store.pushPayload(response);

    this.showAlert('success');
    this.loading = false;
    m.redraw();
    this.hide();
  }

  failure() {
    this.showAlert('error');
    this.loading = false;
    m.redraw();
  }

  showAlert(type) {
    this.alertAttrs.content = app.translator.trans(`lawaxi-level-ranks.forum.student_confirmation.feedback.${type}`);
    this.alertAttrs.type = type;
  }


}
