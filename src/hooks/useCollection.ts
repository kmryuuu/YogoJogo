import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebase";

const useCollection = <T>(collectionName: string) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        // T타입의 빈 배열 선언, fetchData 함수 내에서 데이터를 저장
        const dataList: T[] = [];
        querySnapshot.forEach((doc) => {
          // T 타입 단언 -> T 타입의 객체
          // 불러온 데이터를 원하는 객체의 타입과 동일하게 맞추기 위해 해당 타입의 객체를 배열에 추가
          dataList.push(doc.data() as T);
          console.log(doc.data());
        });
        setData(dataList);
      } catch (err) {
        setError("An unexpected error occurred");
      }
      setLoading(false);
    };

    fetchData();
  }, [collectionName]);

  return { data, loading, error };
};

export default useCollection;
