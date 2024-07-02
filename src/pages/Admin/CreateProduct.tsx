import CategoryButton from "@/components/Admin/CategoryButton";

const categories = [
  { id: "season", name: "제철상품" },
  { id: "fruit", name: "과일" },
  { id: "vagetable", name: "채소" },
  { id: "meat", name: "축산・정육" },
  { id: "seafood", name: "수산・해산" },
];

const CreateProduct = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <form className="w-full max-w-2xl rounded-lg bg-white">
        <h2 className="mb-8 text-lg">상품 등록</h2>

        <div className="mb-6 flex items-center">
          <label className="w-32 text-base font-medium">카테고리</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <CategoryButton
                key={category.id}
                id={category.id}
                name={category.name}
                label={category.name}
              />
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
            className="w-32 rounded-lg border border-slate-300 p-3 text-sm"
          />
        </div>

        <div className="mb-6 flex items-start">
          <label htmlFor="image" className="w-32 text-base font-medium">
            상품이미지
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="file"
              id="image"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = e.target.files;
                if (files) {
                  console.log(files);
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              <label
                htmlFor="image"
                className="flex h-20 w-20 cursor-pointer items-center justify-center rounded-lg border border-slate-300"
              >
                <span className="text-2xl">+</span>
              </label>
              <div className="relative h-20 w-20 rounded-lg border border-slate-300 bg-gray-200"></div>
              <div className="relative h-20 w-20 rounded-lg border border-slate-300 bg-gray-200"></div>
              <div className="relative h-20 w-20 rounded-lg border border-slate-300 bg-gray-200"></div>
              <div className="relative h-20 w-20 rounded-lg border border-slate-300 bg-gray-200"></div>
            </div>
          </div>
        </div>

        <div className="mb-6 flex items-start">
          <label htmlFor="description" className="w-32 text-base font-medium">
            상품 설명
          </label>
          <textarea
            id="description"
            className="h-32 w-full max-w-lg rounded-lg border border-slate-300 p-3 text-sm"
          ></textarea>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="w-full max-w-xs rounded-lg bg-primary py-3 font-bold text-white"
          >
            등록
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
