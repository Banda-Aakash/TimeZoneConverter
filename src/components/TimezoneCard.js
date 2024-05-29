import React, { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { FaTimes } from "react-icons/fa";

const style = {
  padding: "0px",
  marginTop: "0.5rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
  borderRadius: "8px"
};

const TimezoneCard = ({ timezone, index, handleRemove, handleTimeChange, formatTime, renderMarks, moveCard }) => {
  const ref = useRef(null);
  const [isSliderInteracting, setIsSliderInteracting] = useState(false);

  const [{ isDragging }, drag] = useDrag({
    type: "CARD",
    item: { type: "CARD", index },
    canDrag: !isSliderInteracting, // Disable dragging when interacting with the slider
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [, drop] = useDrop({
    accept: "CARD",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);
      item.index = hoverIndex;
    }
  });

  const handleSliderInteraction = (event) => {
    setIsSliderInteracting(true);
    event.stopPropagation();
  };

  const handleSliderRelease = () => {
    setIsSliderInteracting(false);
  };

  drag(drop(ref));
  const opacity = isDragging ? 0 : 1;

  return (
    <div style={{ ...style, opacity }} ref={ref}>
      <div className="card mb-4" style={{ background:'linear-gradient(45deg, #ffffff,#ADD8E6)'}}>
        <div className="card-body" style={{ padding: '30px' }}>
          <button className="btn btn" onClick={() => handleRemove(index)} style={{color:'red', position: 'absolute', top: '5px', right: '5px'}}>
            <FaTimes />
          </button>
          <h5 className="card-title">{timezone.label}</h5>
          <input
            type="range"
            min={0}
            max={1439}
            value={timezone.currentTime}
            className="form-range"
            onChange={(event) => handleTimeChange(index, event)}
            onMouseDown={handleSliderInteraction}
            onTouchStart={handleSliderInteraction}
            onMouseUp={handleSliderRelease}
            onTouchEnd={handleSliderRelease}
            style={{ marginBottom: '1rem' }}
          />
          <div style={{ position: 'relative', width: '100%', marginBottom: '1rem' }}>
            {renderMarks()}
          </div>
          <h6 className="card-text text-center" style={{marginTop:'50px'}}>Selected Time: {formatTime(timezone.currentTime)}</h6>
        </div>
      </div>
    </div>
  );
};

export default TimezoneCard;