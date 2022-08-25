//1为默认主题

export default function doesHaveTheme(id, user){
  return id===1 ? true : (user.hastheme() || '1').toString().split(",").includes(id.toString());
}
