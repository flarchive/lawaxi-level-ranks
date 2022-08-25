import Modal from 'flarum/common/components/Modal';
import ItemList from 'flarum/common/utils/ItemList';
import Stream from 'flarum/common/utils/Stream';
import Button from 'flarum/forum/components/Button';
import username from 'flarum/common/helpers/username';
import doesHaveTheme from "../../common/theme/doesHaveTheme";

export default class TransferBalanceModal extends Modal {
  static isDismissible = true;

  target = null;
  actor = null;
  amount = Stream(0);

  oninit(vnode) {
    super.oninit(vnode);

    this.target = this.attrs.target;
    this.actor = this.attrs.actor;
  }


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
      <div className="Form-balanceTransfer">
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
    /*const data = new FormData();
    data.append('target', this.target);
    data.append('actor', this.actor);
    data.append('amount', this.amount());

    app
      .request({
        method: 'POST',
        url: `${app.forum.attribute('apiUrl')}/users/${this.target.id()}/pay`,
        serialize: (raw) => raw,
        body: data,
      })
      .then(this.success.bind(this), this.failure.bind(this));*/

    this.target.save({payAmount: this.amount()}, { errorHandler: this.onerror.bind(this) })
      .then(() => window.location.reload(), this.loaded.bind(this));
  }

  /*
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
  }*/

}
