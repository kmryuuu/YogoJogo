import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/utils/firebase";

const useCollection = <T>(collectionName: string, orderByField: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, collectionName), orderBy(orderByField));
        const querySnapshot = await getDocs(q);
        const dataList = querySnapshot.docs.map((doc) => ({
          ...(doc.data() as T),
          id: doc.id,
        }));
        setData(dataList);
      } catch (err) {
        setError("An unexpected error occurred");
      }
      setLoading(false);
    };

    fetchData();
  }, [collectionName, orderByField]);

  return { data, loading, error };
};

export default useCollection;
