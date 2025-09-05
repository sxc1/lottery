interface CircleNumberProps {
    numberValue: number,
    textColor: string,
    backgroundColor: string
}

export default function CircleNumber({ numberValue, textColor, backgroundColor }: CircleNumberProps) {
    return (
      <div
        style={{
          width: "40px",
          height: "40px",
          border: "2px solid black",
          borderRadius: "50%",
          backgroundColor: backgroundColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: textColor,
          fontWeight: "bold",
          fontSize: "16px",
        }}
      >
        {String(numberValue).padStart(2, "0")}
      </div>
    );
  }