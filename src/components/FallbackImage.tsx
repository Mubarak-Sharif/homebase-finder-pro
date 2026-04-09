import { useState } from "react";

interface FallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string;
}

const FallbackImage = ({ src, alt, fallback = "/placeholder.svg", className, ...props }: FallbackImageProps) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc || fallback}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
};

export default FallbackImage;
