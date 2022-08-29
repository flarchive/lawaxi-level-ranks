import app from 'flarum/admin/app';
import { extend } from 'flarum/common/extend';
import AdminNav from "flarum/admin/components/AdminNav";
import LinkButton from "flarum/common/components/LinkButton";

import withAttr from 'flarum/common/utils/withAttr';
import formatBytes from '../common/formatBytes';
import CardConfirmationPage from "./CardConfirmationPage";

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

  app.routes["card"] = {
    path: "/card",
    component: CardConfirmationPage,
  };

  extend(AdminNav.prototype, 'items', function (items) {
    items.add(
      'card_confirmation',
      <LinkButton href={app.route('card')} icon="fas fa-users" title={'confirm'}>
        {app.translator.trans('lawaxi-level-ranks.admin.studentID.title')}
      </LinkButton>,
      48
    );
  });

},100);
