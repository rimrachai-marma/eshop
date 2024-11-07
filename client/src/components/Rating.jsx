import StarFullIcon from "../assets/icons/StarFullIcon";
import StarHalfIcon from "../assets/icons/StarHalfIcon";
import StarOutlineIcon from "../assets/icons/StarOutlineIcon";

const Rating = ({ value, text, className, fill }) => {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <span style={{ display: "flex", alignItems: "center" }}>
        {value >= 1 ? (
          <StarFullIcon className={className} style={{ fill }} />
        ) : value >= 0.5 ? (
          <StarHalfIcon className={className} style={{ fill }} />
        ) : (
          <StarOutlineIcon className={className} style={{ fill }} />
        )}
      </span>
      <span style={{ display: "flex", alignItems: "center" }}>
        {value >= 2 ? (
          <StarFullIcon className={className} style={{ fill }} />
        ) : value >= 1.5 ? (
          <StarHalfIcon className={className} style={{ fill }} />
        ) : (
          <StarOutlineIcon className={className} style={{ fill }} />
        )}
      </span>
      <span style={{ display: "flex", alignItems: "center" }}>
        {value >= 3 ? (
          <StarFullIcon className={className} style={{ fill }} />
        ) : value >= 2.5 ? (
          <StarHalfIcon className={className} style={{ fill }} />
        ) : (
          <StarOutlineIcon className={className} style={{ fill }} />
        )}
      </span>
      <span style={{ display: "flex", alignItems: "center" }}>
        {value >= 4 ? (
          <StarFullIcon className={className} style={{ fill }} />
        ) : value >= 3.5 ? (
          <StarHalfIcon className={className} style={{ fill }} />
        ) : (
          <StarOutlineIcon className={className} style={{ fill }} />
        )}
      </span>
      <span style={{ display: "flex", alignItems: "center" }}>
        {value >= 5 ? (
          <StarFullIcon className={className} style={{ fill }} />
        ) : value >= 4.5 ? (
          <StarHalfIcon className={className} style={{ fill }} />
        ) : (
          <StarOutlineIcon className={className} style={{ fill }} />
        )}
      </span>
      <span style={{ marginLeft: "5px" }}>{text}</span>
    </div>
  );
};

Rating.defaultProps = {
  fill: "#f8e825",
};

export default Rating;
