import app from 'flarum/admin/app';
import withAttr from 'flarum/common/utils/withAttr';
import formatBytes from '../common/formatBytes';

app.initializers.add('lawaxi-level-ranks', () => {

    app.extensionData.for('lawaxi-level-ranks')
      .registerSetting({
        label: app.translator.trans('lawaxi-level-ranks.admin.settings.address'),
        setting: 'lawaxi-level-ranks.address',
        type: 'string',
      })
      .registerSetting({
        label: app.translator.trans('lawaxi-level-ranks.admin.settings.payCode'),
        setting: 'lawaxi-level-ranks.payCode',
        type: 'string',
      })
      .registerSetting({
        label: app.translator.trans('lawaxi-level-ranks.admin.settings.studentID_example'),
        setting: 'lawaxi-level-ranks.studentID_example',
        type: 'string',
      })
      .registerSetting(function () {
        const maxSize = this.setting('lawaxi-level-ranks.studentID_maxSize', 666);

        return (
          <div className="Form-group">
            <label>{app.translator.trans('lawaxi-level-ranks.admin.settings.studentID_maxSize')}</label>
            <div className="ProfileCover-size-input">
              <input type="number" className="FormControl" value={maxSize()} oninput={withAttr('value', maxSize)} />
              <input className="FormControl" value={formatBytes(maxSize() * Math.pow(2, 10))} disabled />
            </div>
          </div>
        );
      })
      .registerPermission(
        {
          icon: 'fas fa-image',
          label: app.translator.trans('lawaxi-level-ranks.admin.permission.view_studentID'),
          permission: 'viewStudentID',
        },
        'moderate'
      );

  /*extendEditUserModal(app);

  extend(UserListPage.prototype, 'columns', function (columns) {

    columns.add(
      'studentIDConfirmation',
      {
        name: app.translator.trans('lawaxi-level-ranks.forum.settings.sc_admin_title'),
        content: (user) => {
          return specialButton(user) ? app.translator.trans('lawaxi-level-ranks.forum.settings.sc_admin') : '';
        },
      },
      -100
    );
  });

  function specialButton(user){
    if(!user.studentID())
      return false;
    else if((user.is_studentID_confirmed() || 0) === 0)
      return true;
    return false;
  }*/

});
