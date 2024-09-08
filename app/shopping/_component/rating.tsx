import { useState } from "react";
import { Star, StarHalf, StarOff } from "lucide-react";

const Rating = ({
  value,
  max = 5,
  onChange,
}: {
  value: any;
  max?: number;
  onChange: any;
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (newValue: any) => {
    onChange(newValue);
  };

  const handleMouseEnter = (newValue: any) => {
    setHoverValue(newValue);
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  const stars = Array.from({ length: max }, (_, index) => {
    const actualIndex = index + 1;
    const isSelected = actualIndex <= (hoverValue || value);
    const isHalfSelected =
      hoverValue % 1 !== 0 && actualIndex === Math.floor(hoverValue);
    return (
      <div
        key={index}
        className="cursor-pointer"
        onClick={() => handleClick(actualIndex)}
        onMouseEnter={() => handleMouseEnter(actualIndex)}
        onMouseLeave={handleMouseLeave}
      >
        {isSelected ? (
          isHalfSelected ? (
            <StarHalf className="w-6 h-6 text-yellow-500" />
          ) : (
            <Star className="w-6 h-6 text-yellow-500" />
          )
        ) : (
          <StarOff className="w-6 h-6 text-gray-300" />
        )}
      </div>
    );
  });

  return <div className="flex items-center">{stars}</div>;
};

export default Rating;
