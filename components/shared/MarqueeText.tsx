export const MarqueeText = ({
  className,
  text1,
}: {
  className?: string;
  text1?: string;
}) => {
  return (
    <div
      className={`marquee-wrapper  mt-12 lg:text-[80px] md:text-[60px] text-[40px] ${className}`}
    >
      <div className={`marquee-inner`}>
        <div className={`marquee-content`}>
          <span className="mx-4">{text1}</span>
        </div>
      </div>
    </div>
  );
};
