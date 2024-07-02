interface CategoryButtonProps {
  id: string;
  name: string;
  label: string;
}

const CategoryButton = ({ id, name }: CategoryButtonProps) => {
  return (
    <div className="text-sm">
      <input type="radio" id={id} name="category" className="peer hidden" />
      <label
        htmlFor={id}
        className="cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-primary text-slate-400 peer-checked:bg-primary peer-checked:text-white"
      >
        {name}
      </label>
    </div>
  );
};

export default CategoryButton;
