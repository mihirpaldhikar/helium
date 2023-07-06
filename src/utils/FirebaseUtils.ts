import { signInWithEmailAndPassword, signOut } from "@firebase/auth";
import {
  firebaseAuth,
  firebaseStorage,
  firestore,
} from "@/configs/FirebaseConfig";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
  uploadString,
} from "@firebase/storage";
import { generateRandomString, getObjectPath } from "@/utils/SharedUtils";
import { Blob } from "@mihirpaldhikar/polaris";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from "@firebase/firestore";
import { ImageContent } from "@mihirpaldhikar/polaris/dist/cjs/types/interfaces";
import Blog from "@/interfaces/Blog";

export async function signIn(email: string, password: string) {
  await signInWithEmailAndPassword(firebaseAuth, email, password);
}

export async function logout() {
  await signOut(firebaseAuth);
}

export async function uploadImage(
  image: File,
  blobId: string,
): Promise<string> {
  const imageId = generateRandomString(30);
  const imageRef = ref(firebaseStorage, `images/${blobId}/${imageId}.png`);
  const uploader = await uploadBytesResumable(imageRef, image);
  return await getDownloadURL(uploader.ref);
}

export async function uploadBlob(blob: Blob) {
  const blobRef = ref(firebaseStorage, `blobs/${blob.id}/blob.json`);
  const uploader = await uploadString(blobRef, JSON.stringify(blob));
  return await getDownloadURL(uploader.ref);
}

export async function uploadBlogHTML(
  html: string,
  blobId: string,
): Promise<string> {
  const htmlRef = ref(firebaseStorage, `blobs/${blobId}/output.html`);
  const uploader = await uploadString(htmlRef, html);
  return await getDownloadURL(uploader.ref);
}

export async function uploadBlog(blob: Blob, html: string) {
  await createBlogEntry(
    blob,
    await uploadBlob(blob),
    await uploadBlogHTML(html, blob.id),
  );
}

export async function createBlogEntry(
  blob: Blob,
  blobURL: string,
  htmlUrl: string,
) {
  await setDoc(doc(firestore, "blogs", blob.id), {
    blogId: blob.id,
    heroImage: (blob.contents[0].content as ImageContent).url,
    title: blob.contents[2].content as string,
    slug: (blob.contents[2].content as string)
      .toLowerCase()
      .replaceAll(" ", "-"),
    blobURI: blobURL,
    htmlURI: htmlUrl,
  });
}

export async function getBlogs(): Promise<Blog[]> {
  const blogs: Blog[] = [];
  const blogsQuery = query(collection(firestore, "blogs"));
  const querySnapshot = await getDocs(blogsQuery);
  querySnapshot.forEach((p) => {
    blogs.push(p.data() as Blog);
  });
  return blogs;
}

export async function getBlog(blogId: string): Promise<Blog | null> {
  const blogRef = doc(firestore, "blogs", blogId);
  const querySnapshot = await getDoc(blogRef);
  if (querySnapshot.exists()) {
    return querySnapshot.data() as Blog;
  }
  return null;
}

export async function deleteBlogEntry(blogId: string) {
  await deleteDoc(doc(firestore, "blogs", blogId));
}

export async function deleteBlobImages(blob: Blob) {
  for (const block of blob.contents) {
    if (block.type === "image" && block.role === "image") {
      const imageData = block.content as ImageContent;
      const imageRef = ref(firebaseStorage, getObjectPath(imageData.url));
      await deleteObject(imageRef);
    }
  }
}

export async function deleteRawBlob(blobURL: string) {
  const blobRef = ref(firebaseStorage, getObjectPath(blobURL));
  await deleteObject(blobRef);
}

export async function deleteBlobHTML(htmlURL: string) {
  const htmlRef = ref(firebaseStorage, getObjectPath(htmlURL));
  await deleteObject(htmlRef);
}

export async function deleteBlog(blob: Blob) {
  const blobMetaData = await getBlog(blob.id);
  if (blobMetaData === null) return;
  await deleteBlobImages(blob);
  await deleteRawBlob(blobMetaData.blobURI);
  await deleteBlobHTML(blobMetaData.htmlURI);
  await deleteBlogEntry(blob.id);
}
