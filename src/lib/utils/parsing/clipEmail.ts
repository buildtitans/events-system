export function clipEmail(email: string): string {
  if (!email) return "";
  const temp = [];
  const splitEmail = email.split("");
  for (let i = 0; i < splitEmail.length; i++) {
    if (i <= 13) temp.push(splitEmail[i]);
  }
  const clipped = temp.join("");
  return clipped + "...";
}
