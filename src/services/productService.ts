import { db, storage } from "@/utils/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  getDoc,
  doc,
  deleteDoc,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  DocumentData,
  QueryDocumentSnapshot,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Product } from "@/interface/interface";

// firebase 커서 기반의 페이지 네이션
export interface FetchProductsResult {
  products: Product[];
  nextCursor: QueryDocumentSnapshot<DocumentData> | null;
}

const PAGE_SIZE = 10;

export const fetchProducts = async ({
  category,
  sortOption,
  pageParam = null,
}: {
  category: string;
  sortOption?: string;
  pageParam?: QueryDocumentSnapshot<DocumentData> | null;
}): Promise<FetchProductsResult> => {
  let productQuery = query(collection(db, "products"));

  if (category && category !== "allproducts") {
    productQuery = query(productQuery, where("category", "==", category));
  }

  switch (sortOption) {
    case "lowest":
      productQuery = query(productQuery, orderBy("price", "asc"));
      break;
    case "highest":
      productQuery = query(productQuery, orderBy("price", "desc"));
      break;
    default:
      productQuery = query(productQuery, orderBy("createdAt", "desc"));
      break;
  }

  if (pageParam) {
    productQuery = query(productQuery, startAfter(pageParam));
  }

  productQuery = query(productQuery, limit(PAGE_SIZE));

  try {
    const productSnapshot = await getDocs(productQuery);
    const lastVisible =
      productSnapshot.docs[productSnapshot.docs.length - 1] || null;
    const products = productSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        price:
          typeof data.price === "string"
            ? parseFloat(data.price.replace(/,/g, ""))
            : data.price,
      } as Product;
    });

    return { products, nextCursor: lastVisible };
  } catch (error) {
    console.error("Error fetching products: ", error);
    return { products: [], nextCursor: null };
  }
};

export const getProduct = async (id: string): Promise<Product> => {
  const productDoc = await getDoc(doc(db, "products", id));
  if (productDoc.exists()) {
    return productDoc.data() as Product;
  }
  throw new Error("Product not found");
};

export const addProduct = async (product: Partial<Product>) => {
  await addDoc(collection(db, "products"), product);
};

export const updateProduct = async (id: string, product: Partial<Product>) => {
  const productRef = doc(db, "products", id);
  await updateDoc(productRef, product);
};

export const deleteProduct = async (id: string) => {
  const productRef = doc(db, "products", id);
  await deleteDoc(productRef);
};

export const uploadImages = async (images: File[]): Promise<string[]> => {
  const uploadPromises = images.map(async (image) => {
    const storageRef = ref(storage, `products/${image.name}`);
    await uploadBytes(storageRef, image);
    return getDownloadURL(storageRef);
  });

  return Promise.all(uploadPromises);
};
