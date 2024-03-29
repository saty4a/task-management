import React from "react";

const ProgressBar = ({bgColor, progress}) => {
    const containerStyles = {
        height: 20,
        width: '100%',
        backgroundColor: "#e0e0de",
        borderRadius: 50,
      }
    
    const fillerStyles = {
        height: "100%",
        width: `${progress}%`,
        backgroundColor: bgColor,
        borderRadius: 'inherit',
        textAlign: 'right',
        transition: 'width 1s ease-in-out',
    }

    const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold'
    }

    return(
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles} className="px-3">
                    {progress}
                </span>
            </div>

        </div>
    )
}

export default ProgressBar;