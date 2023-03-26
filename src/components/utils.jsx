export function Spacer({ size }) {
  size = `${size}rem`;
  return <div style={{ height: size, width: size }} />;
}

export function Padding({ size, children }) {
  size = `${size}rem`;
  return <div style={{ padding: size }}>{children}</div>;
}

export function Flex({
  children,
  direction = "row",
  justify = "flex-start",
  align = "center",
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: direction,
        justifyContent: justify,
        alignItems: align,
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}

export function Expanded({ children }) {
  return <div style={{ flex: 1 }}>{children}</div>;
}

export function Text({ children, size = 1, bold = false, color = "#000" }) {
  size = `${size}rem`;
  return (
    <p style={{ fontSize: size, fontWeight: bold ? "bold" : "normal", color }}>
      {children}
    </p>
  );
}

export function Divider() {
  return <div style={{ width: "0.5px", background: "#eee" }} />;
}
