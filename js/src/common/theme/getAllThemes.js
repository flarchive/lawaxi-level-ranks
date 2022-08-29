import app from 'flarum/common/app';

export default function getTheme() {
  return app.store.all('themes');
}
