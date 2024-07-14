import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { useInfiniteProducts } from "@/hooks/useProducts";

interface CarouselItemProps {
  title: string;
  subtitle: string;
  category: string;
}

const CarouselSection = ({ title, subtitle, category }: CarouselItemProps) => {
  const { data } = useInfiniteProducts(category, "createdAt");
  const products = data?.pages.flatMap((page) => page.products) || [];
  const limitedProducts = products.slice(0, 10);

  const [emblaRef] = useEmblaCarousel({
    loop: false,
    slidesToScroll: "auto",
  });

  return (
    <section className="mt-20">
      <div>
        <p className="text-lg font-bold">{title}</p>
        <span className="text-sm text-gray-700">{subtitle}</span>
      </div>
      <div className="embla mt-4">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {limitedProducts.map((product) => (
              <div key={product.id} className="embla__slide">
                <Link to={`/product/${product.id}`}>
                  <div className="rounded-md">
                    <div className="relative aspect-square w-full">
                      <img
                        src={product.images[0]}
                        className="absolute left-0 top-0 h-full w-full rounded-md object-cover"
                        alt={product.title}
                      />
                    </div>
                    <h3 className="text-md mb-1 mt-3 font-normal">
                      {product.title}
                    </h3>
                    <p className="text-lg font-bold">
                      {product.price.toLocaleString()}원
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CarouselSection;
