interface messageProps {
    children : JSX.Element | JSX.Element[],
}

function Message({children}: messageProps) : JSX.Element | null {
    return (
        <div style={{display:"block"}}>
          {children}
        </div>
      );
}

export default Message