import Component from 'flarum/common/Component';
import Tooltip from 'flarum/common/components/Tooltip';

export default class LevelBar extends Component {
    oninit(vnode) {
        super.oninit(vnode);
    }

    view() {
        const user = this.attrs.user;
        let pointsText = '图样';

        let expComments = (user.commentCount() - user.discussionCount()) * 64,
            expDiscussions = user.discussionCount() * 89;

        let expTotal = expComments + expDiscussions,
            expLevel = Math.floor(expTotal/2022)+1,
            expPercent = 100*(expTotal-2022*(expLevel-1))/2022;

        if(expLevel>9){
            pointsText = '见得多了';
        }
        else if(expLevel>4){
            pointsText = '似董非董';
        }

        return (
            <Tooltip text={expTotal.toString() + ' 点人生经验'}>
                <div class="PostUser-level">
                    <span class="PostUser-text">
                        <span class="PostUser-levelText">{pointsText}</span>
                        &nbsp;
                        <span class="PostUser-levelPoints">{expLevel}</span>
                    </span>
                    <div class="PostUser-bar PostUser-bar--empty"></div>
                    <div class="PostUser-bar" style={'width: ' + expPercent + '%;'}></div>
                </div>
            </Tooltip>
        );
    }
}
