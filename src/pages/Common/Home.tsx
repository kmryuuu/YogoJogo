import imageBox from "@/assets/images/image-slide1.png";
import CarouselItem from "@/components/Carousel/CarouselItem";

const Home = () => {
  return (
    <div>
      <div className="flex h-80 w-full items-center bg-primary">
        <div className="mx-auto flex w-full max-w-screen-lg items-center justify-between">
          <div className="flex flex-col text-white">
            <p className="text-2xl font-bold leading-normal">
              혼자 살지만 <br />
              이것도 저것도 다 먹고 싶을땐?
            </p>
            <p className="text-md mt-8 font-normal leading-relaxed">
              요고조고에서 소량 구매로 <br />
              다채로운 식탁을 즐겨보세요!
            </p>
          </div>
          <img src={imageBox} className="h-60 w-60" />
        </div>
      </div>
      <div className="mx-auto max-w-screen-lg">
        <CarouselItem
          title="지금 많이 구매해요! 👀"
          subtitle="요새 뭐가 핫할까?"
          category="fruits"
        />
        <CarouselItem
          title="1인 가구 BEST ✨"
          subtitle=" 혼밥에 딱 맞는 재료들을 모아봤어요"
          category="vegetables"
        />
        <CarouselItem
          title="신선한 제철 음식 🍑"
          subtitle="지금이 가장 맛있을 때!"
          category="seasonal"
        />
      </div>
    </div>
  );
};

export default Home;
