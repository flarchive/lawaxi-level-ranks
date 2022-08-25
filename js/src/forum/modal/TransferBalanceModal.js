import Modal from 'flarum/common/components/Modal';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import Button from 'flarum/forum/components/Button';
import username from 'flarum/common/helpers/username';

export default class TransferBalanceModal extends Modal {
  static isDismissible = true;

  target = this.attrs.target;
  actor = this.attrs.actor;
  amount = Stream(0);

  className() {
    return 'TransferBalanceModal';
  }

  title() {
    return <p>{app.translator.trans('lawaxi-level-ranks.forum.transferBalance.title',{name: username(this.target), id:this.target.id()})}</p>;
  }


  content() {return(<div class="Modal-body">{this.fields().toArray()}</div>);
  }

  fields(){
    const items = new ItemList();

    items.add(
      'amount',
      <div>
        <label>{app.translator.trans('lawaxi-level-ranks.forum.transferBalance.amount',{balance: this.actor.balance()})}</label>
        <input
          className="FormControl"
          placeholder={app.translator.trans('lawaxi-level-ranks.forum.transferBalance.amount2')}
          bidi={this.amount}
        />
      </div>
      ,3);

    items.add(
      'submit',
      <div className="Form-group">
        {Button.component(
          {
            className: 'Button Button--primary',
            type: 'submit',
            loading: this.loading,
          },
          app.translator.trans('lawaxi-level-ranks.forum.transferBalance.submit')
        )}
      </div>,
      1
    );

    return items;
  }

  onsubmit() {
    const data = new FormData();
    data.append('amount', this.amount());

    app
      .request({
        method: 'POST',
        url: `${app.forum.attribute('apiUrl')}/users/${this.target.id()}/pay`,
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

}
