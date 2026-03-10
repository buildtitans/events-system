export function clipEmail(email: string): string {
  const temp = [];
  const splitEmail = email.split("");
  for (let i = 0; i < splitEmail.length; i++) {
    if (i <= 10) temp.push(splitEmail[i]);
  }
  const clipped = temp.join("");
  return clipped;
}
