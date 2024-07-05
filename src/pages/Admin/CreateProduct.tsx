import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { db, storage } from "@/utils/firebase";
import { collection, addDoc, updateDoc, getDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { Product } from "@/interface/interface";
import { useNavigate, useParams } from "react-router-dom";

interface PreviewImage {
  id: string;
  file: File;
  url: string;
}

const categories = [
  { id: "season", name: "제철상품" },
  { id: "fruit", name: "과일" },
  { id: "vagetable", name: "채소" },
  { id: "meat", name: "축산・정육" },
  { id: "seafood", name: "수산・해산" },
];

const CreateProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { register, handleSubmit, reset } = useForm<Product>();
  const [selectedImages, setSelectedImages] = useState<PreviewImage[]>([]);

  // 상품 데이터 불러오기 (수정 시)
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        const productDoc = await getDoc(doc(db, "products", id));
        if (productDoc.exists()) {
          const productData = productDoc.data() as Product;
          // form value 재설정
          reset(productData);
          // 이미지 초기값
          const initialImages = productData.images.map((url, index) => ({
            id: `${index}`,
            file: new File([], ""),
            url,
          }));
          setSelectedImages(initialImages);
        }
      };
      fetchProduct();
    }
  }, [id, reset]);

  // 이미지 선택
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const filesArray = Array.from(e.target.files || []);

    if (selectedImages.length + filesArray.length > 4) {
      alert("최대 4개의 이미지만 업로드할 수 있습니다.");
      return;
    }

    // 이미지 미리보기
    filesArray.forEach((selectedFile) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImages((prevImages) => [
          ...prevImages,
          {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file: selectedFile,
            url: reader.result as string,
          },
        ]);
      };
      reader.readAsDataURL(selectedFile);
    });
    e.target.value = "";
  };

  // 이미지 삭제
  const handleDeleteImage = (id: string) => {
    const deleteImage = selectedImages.filter((image) => image.id !== id);
    setSelectedImages(deleteImage);
  };

  // 상품 등록, 수정
  const onSubmit = async (data: Product) => {
    try {
      // 기존 이미지 URL과 새로 업로드된 이미지 URL 병합
      const existingUrls = selectedImages
        .filter((img) => !img.file.name)
        .map((img) => img.url);

      const newUploadPromises = selectedImages
        .filter((img) => img.file.name)
        .map(async (image) => {
          const storageRef = ref(storage, `products/${image.file.name}`);
          await uploadBytes(storageRef, image.file);
          return getDownloadURL(storageRef);
        });

      const newImageUrls = await Promise.all(newUploadPromises);
      const imageUrls = [...existingUrls, ...newImageUrls];

      // 상품 정보 저장
      const product: Partial<Product> = {
        ...data,
        images: imageUrls,
        createdAt: id ? data.createdAt : new Date(),
        updatedAt: new Date(),
      };

      if (id) {
        // 상품 수정
        const productRef = doc(db, "products", id);
        await updateDoc(productRef, product);
        alert("상품이 수정되었습니다.");
      } else {
        // 새 상품 등록
        await addDoc(collection(db, "products"), product);
        alert("상품이 등록되었습니다.");
      }

      reset();
      setSelectedImages([]);
      navigate("/orders/inventory");
    } catch (error) {
      console.error("상품 등록 실패:", error);
      alert("상품 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <form
        className="w-full max-w-2xl rounded-lg bg-white"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="mb-8 text-lg">{id ? "상품 수정" : "상품 등록"}</h2>

        <div className="mb-6 flex items-center">
          <label className="w-32 text-base font-medium">카테고리</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <div key={category.id} className="text-sm">
                <input
                  type="radio"
                  id={category.id}
                  value={category.name}
                  {...register("category", { required: true })}
                  className="peer hidden"
                />
                <label
                  htmlFor={category.id}
                  className="cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-primary text-slate-400 peer-checked:bg-primary peer-checked:text-white"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6 flex items-center">
          <label htmlFor="title" className="w-32 text-base font-medium">
            상품명
          </label>
          <input
            type="text"
            id="title"
            {...register("title", { required: true })}
            className="w-full max-w-xs rounded-lg border border-slate-300 p-3 text-sm"
          />
        </div>

        <div className="mb-6 flex items-center">
          <label htmlFor="price" className="w-32 text-base font-medium">
            판매가
          </label>
          <div className="flex items-center">
            <input
              type="text"
              id="price"
              placeholder="0"
              {...register("price", { required: true })}
              className="w-32 rounded-lg border border-slate-300 p-3 text-sm"
            />
            <span className="ml-2">원</span>
          </div>
        </div>

        <div className="mb-6 flex items-center">
          <label htmlFor="quantity" className="w-32 text-base font-medium">
            수량
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            max="9999"
            placeholder="0"
            {...register("quantity", { required: true })}
            className="w-32 rounded-lg border border-slate-300 p-3 text-sm"
          />
        </div>

        <div className="mb-6 flex items-start">
          <label htmlFor="image" className="w-32 text-base font-medium">
            상품이미지
          </label>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-2">
              <input
                type="file"
                id="image"
                multiple
                className="hidden"
                onChange={handleImageSelect}
              />
              <label
                htmlFor="image"
                className="flex h-20 w-20 cursor-pointer items-center justify-center rounded border border-slate-300"
              >
                <span className="text-2xl">+</span>
              </label>
            </div>
            <div className="flex flex-wrap gap-2">
              {selectedImages.map((image, index) => (
                <div
                  key={image.id}
                  className="boder-slate-300 relative h-20 w-20 rounded border"
                >
                  <img
                    src={image.url}
                    alt={`${index}번째 이미지`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-0 flex h-6 w-6 -translate-y-1/2 translate-x-1/2 transform items-center justify-center rounded-full bg-slate-200 text-lg text-slate-400"
                    onClick={() => handleDeleteImage(image.id)}
                  >
                    x
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-start">
          <label htmlFor="description" className="w-32 text-base font-medium">
            상품 설명
          </label>
          <textarea
            id="description"
            {...register("desc", { required: true })}
            className="h-32 w-full max-w-lg rounded-lg border border-slate-300 p-3 text-sm"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full max-w-xs rounded-lg bg-primary py-3 font-bold text-white"
          >
            {id ? "수정" : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
