import type Mithril from 'mithril';

import app from 'flarum/admin/app';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import User from 'flarum/common/models/User';
import Model from 'flarum/common/Model';
import Button from 'flarum/common/components/Button';
import ItemList from 'flarum/common/utils/ItemList';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';
import AdminPage from 'flarum/admin/components/AdminPage';

type ColumnData = {
  /**
   * Column title
   */
  name: Mithril.Children;
  /**
   * Component(s) to show for this column.
   */
  content: (user: User) => Mithril.Children;
};

/**
 * Admin page which displays a paginated list of all users on the forum.
 */
export default class CardConfirmationPage extends AdminPage {
  /**
   * Number of users to load per page.
   */
  private numPerPage: number = 50;

  /**
   * Current page number. Zero-indexed.
   */
  private pageNumber: number = 0;

  /**
   * Total number of forum users.
   *
   * Fetched from the active `AdminApplication` (`app`), with
   * data provided by `AdminPayload.php`, or `flarum/statistics`
   * if installed.
   */
  userCount: number = app.data.modelStatistics.users.total;

  /**
   * Get total number of user pages.
   */
  private getTotalPageCount(): number {
    if (this.userCount === -1) return 0;

    return Math.ceil(this.userCount / this.numPerPage);
  }

  /**
   * This page's array of users.
   *
   * `undefined` when page loads as no data has been fetched.
   */
  private pageData: User[] | undefined = undefined;

  /**
   * Are there more users available?
   */
  private moreData: boolean = false;

  private isLoadingPage: boolean = false;

  /**
   * Component to render.
   */
  content() {
    if (typeof this.pageData === 'undefined') {
      this.loadPage(0);

      return [
        <section class="UserListPage-grid UserListPage-grid--loading">
          <LoadingIndicator containerClassName="LoadingIndicator--block" size="large" />
        </section>,
      ];
    }

    const columns = this.columns().toArray();

    return [
      <section
        class={classList(['UserListPage-grid', this.isLoadingPage ? 'UserListPage-grid--loadingPage' : 'UserListPage-grid--loaded'])}
        style={{ '--columns': columns.length }}
        role="table"
        // +1 to account for header
        aria-rowcount={this.pageData.length + 1}
        aria-colcount={columns.length}
        aria-live="polite"
        aria-busy={this.isLoadingPage ? 'true' : 'false'}
      >
        {/* Render columns */}
        {columns.map((column, colIndex) => (
          <div class="UserListPage-grid-header" role="columnheader" aria-colindex={colIndex + 1} aria-rowindex={1}>
            {column.name}
          </div>
        ))}

        {/* Render user data */}
        {this.pageData.map((user, rowIndex) =>
          columns.map((col, colIndex) => {
            const columnContent = col.content && col.content(user);

            return (
              <div
                class={classList(['UserListPage-grid-rowItem', rowIndex % 2 > 0 && 'UserListPage-grid-rowItem--shaded'])}
                data-user-id={user.id()}
                data-column-name={col.itemName}
                aria-colindex={colIndex + 1}
                // +2 to account for 0-based index, and for the header row
                aria-rowindex={rowIndex + 2}
                role="cell"
              >
                {columnContent || app.translator.trans('core.admin.users.grid.invalid_column_content')}
              </div>
            );
          })
        )}

        {/* Loading spinner that shows when a new page is being loaded */}
        {this.isLoadingPage && <LoadingIndicator size="large" />}
      </section>,
      <nav class="UserListPage-gridPagination">
        <Button
          disabled={this.pageNumber === 0}
          title={app.translator.trans('core.admin.users.pagination.back_button')}
          onclick={this.previousPage.bind(this)}
          icon="fas fa-chevron-left"
          className="Button Button--icon UserListPage-backBtn"
        />
        <span class="UserListPage-pageNumber">
          {app.translator.trans('core.admin.users.pagination.page_counter', {
            current: this.pageNumber + 1,
            total: this.getTotalPageCount(),
          })}
        </span>
        <Button
          disabled={!this.moreData}
          title={app.translator.trans('core.admin.users.pagination.next_button')}
          onclick={this.nextPage.bind(this)}
          icon="fas fa-chevron-right"
          className="Button Button--icon UserListPage-nextBtn"
        />
      </nav>,
    ];
  }

  /**
   * Build an item list of columns to show for each user.
   *
   * Each column in the list should be an object with keys `name` and `content`.
   *
   * `name` is a string that will be used as the column name.
   * `content` is a function with the User model passed as the first and only argument.
   *
   * See `UserListPage.tsx` for examples.
   */
  columns(): ItemList<ColumnData> {
    const columns = new ItemList<ColumnData>();

    columns.add(
      'id',
      {
        name: app.translator.trans('core.admin.users.grid.columns.user_id.title'),
        content: (user: User) => user.id() ?? '',
      },
      100
    );

    columns.add(
      'username',
      {
        name: app.translator.trans('core.admin.users.grid.columns.username.title'),
        content: (user: User) => {
          const profileUrl = `${app.forum.attribute('baseUrl')}/u/${user.slug()}`;

          return (
            <a
              target="_blank"
              href={profileUrl}
              title={extractText(app.translator.trans('core.admin.users.grid.columns.username.profile_link_tooltip', { username: user.username() }))}
            >
              {user.username()}
            </a>
          );
        },
      },
      90
    );

    columns.add(
      'studentID',
      {
        name: app.translator.trans('lawaxi-level-ranks.admin.studentID.columns_image'),
        content: (user: User) => (
          <img class={"CardImage"} src={user.studentID()}/>
        ),
      },
      80
    );


    this.studentID = 0;

    columns.add(
      'studentID_input',
      {
        name: app.translator.trans('lawaxi-level-ranks.admin.studentID.columns_input'),
        content: (user: User) => (
          <input
            className="FormControl"
            placeholder={app.translator.trans('lawaxi-level-ranks.admin.studentID.placeholder')}
            bidi={this.studentID}
            onfocusout = {() => {
              user.save({is_studentID_confirmed: this.studentID}, { errorHandler: this.onerror.bind(this) });
            }}
          />
        ),
      },
      70
    );

    return columns;
  }

  headerInfo() {
    return {
      className: 'CardConfirmationPage',
      icon: 'fas fa-users',
      title: app.translator.trans('lawaxi-level-ranks.admin.studentID.title'),
      description: app.translator.trans('lawaxi-level-ranks.admin.studentID.description'),
    };
  }

  /**
   * Asynchronously fetch the next set of users to be rendered.
   *
   * Returns an array of Users, plus the raw API payload.
   *
   * Uses the `this.numPerPage` as the response limit, and automatically calculates the offset required from `pageNumber`.
   *
   * @param pageNumber The page number to load and display
   */
  async loadPage(pageNumber: number) {
    User.prototype.studentID = Model.attribute('studentID');
    User.prototype.is_studentID_confirmed = Model.attribute('is_studentID_confirmed');

    if (pageNumber < 0) pageNumber = 0;

    app.store
      .find<User[]>('users', {
        filter: {
          studentID: 'shit',
          is_studentID_confirmed: 'fuck',
        },
        page: {
          limit: this.numPerPage,
          offset: pageNumber * this.numPerPage,
        },
      })
      .then((apiData) => {
        // Next link won't be present if there's no more data
        this.moreData = !!apiData.payload?.links?.next;

        let data = apiData;

        // @ts-ignore
        delete data.payload;
        this.pageData = data;
        this.pageNumber = pageNumber;
        this.isLoadingPage = false;

        m.redraw();
      })
      .catch((err: Error) => {
        console.error(err);
        this.pageData = [];
      });
  }

  nextPage() {
    this.isLoadingPage = true;
    this.loadPage(this.pageNumber + 1);
  }

  previousPage() {
    this.isLoadingPage = true;
    this.loadPage(this.pageNumber - 1);
  }
}
