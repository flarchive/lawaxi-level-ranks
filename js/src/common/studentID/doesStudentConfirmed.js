export default function doesStudentConfirmed(user){
  if(!user) return true;
  return (user.is_studentID_confirmed() || 0) !== 0;
}
