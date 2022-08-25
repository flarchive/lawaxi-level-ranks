import doesStudentConfirmed from "../../common/studentID/doesStudentConfirmed";
import Alert from 'flarum/common/components/Alert';
import StudentIDEditorModal from "../modal/StudentIDEditorModal";
import Component from 'flarum/common/Component';
import Button from 'flarum/forum/components/Button';

export default function alertStudentConfirm(app) {
  const user = app.session.user;
  if (doesStudentConfirmed(user)) {
    return;
  }

  class ContainedAlert extends Alert {
    view(vnode) {
      const vdom = super.view(vnode);
      return {...vdom, children: vdom.children};
    }
  }

  class AButton extends Component {
    view() {
      return (
        <Button class="Button Button--link" onclick={() => app.modal.show(StudentIDEditorModal, {user})}>
          {app.translator.trans('lawaxi-level-ranks.forum.student_confirmation.alert_button')}
        </Button>
      );
    }
  }

  m.mount($('<div/>').insertBefore('#content')[0], {
    view: () => (
      <ContainedAlert dismissible={false} controls={[<AButton />]}>
        {
          (!user.studentID()) ?
            <div className="container">【账号激活步骤2】请尽快完成导航栏-头像-设置-学号认证(通过学生卡)，您可以阅读<a
              href="https://lawaxi.net/d/184">《总法》</a>了解本站针对个人信息保护的相关规定。</div>
            :
            <div className="container">【账号激活步骤3】您的学生卡登记已经提交，尚未通过审核，请耐心等待，如非开学季等注册频繁时段，请联系猫人<a
              href="mailto:lawaxilawaxi@gmail.com">lawaxilawaxi@gmail.com</a>。</div>
        }
      </ContainedAlert>
    ),
  });


}
