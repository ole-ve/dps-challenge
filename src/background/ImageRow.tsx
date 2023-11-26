import "./ImageRow.css";

const ImageRow = () => {
  const randomOpacity = () => Math.random() * 0.15 + 0.05;
  const randomSpeed = () => Math.random() * 20 + 30; // Random speed between 5 and 10 seconds
  const randomDirection = () => Math.random() > 0.5 ? "slide-left" : "slide-right"; // Random direction

  const imageSrc = "assets/TUM.png";
  const imageAlt = "Moving Image";

  const renderImageSet = (keyOffset = 0) => (
    <div className="image-set">
      {[...Array(20)].map((_, index) => (
        <img
          key={index + keyOffset}
          src={imageSrc}
          alt={imageAlt}
          style={{ opacity: randomOpacity() }}
        />
      ))}
    </div>
  );

  const numberOfRows = 22;

  return (
    <div className="image-rows">
      {[...Array(numberOfRows)].map((_, rowIndex) => (
        <div
          key={rowIndex}
          className={`image-row ${randomDirection()}`}
          style={{ animationDuration: `${randomSpeed()}s` }}
        >
          {renderImageSet()}
          {renderImageSet(5)} {/* Offset keys for the second set */}
        </div>
      ))}
    </div>
  );
};

export default ImageRow;
