export function generateRandomString(length: number): string {
  let randomString = "";
  const characters: string =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    randomString += characters.charAt(
      Math.floor(Math.random() * charactersLength),
    );
    counter += 1;
  }
  return randomString;
}

export function getObjectPath(objectURL: string): string {
  const url = new URL(objectURL);
  console.log(url.pathname);
  return url.pathname
    .replace(`/v0/b/${process.env.NEXT_PUBLIC_STORAGE_BUCKET}/o/`, "")
    .replaceAll("%2F", "/");
}
