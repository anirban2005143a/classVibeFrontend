import React, { useState, useEffect, useRef } from 'react'
import triangle from '../assets/triangle.png'
import colorWheel from '../assets/colorWheel.png'

const canvas = () => {

    let prevMouseX, prevMouseY, snapshot,
        isDrawing = false,
        selectedTool = "brush",
        brushWidth = 5,
        selectedColor = "#000";

    const canvas = useRef()

    //function to set canvas
    const setCanvasBackground = () => {
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.current.width, canvas.current.height);
        ctx.fillStyle = selectedColor;
    }

    //function to start drawing
    const startDraw = (e) => {
        console.log("start")
        const ctx = canvas.current.getContext("2d");
        isDrawing = true;
        prevMouseX = e.offsetX;
        prevMouseY = e.offsetY;
        ctx.beginPath();
        ctx.lineWidth = brushWidth;
        ctx.strokeStyle = selectedColor;
        ctx.fillStyle = selectedColor;
        snapshot = ctx.getImageData(0, 0, canvas.current.width, canvas.current.height);
    }

    //function to draw
    const drawing = (e) => {
        const ctx = canvas.current.getContext("2d");
        if (isDrawing) {
            console.log(e.offsetX, e.offsetY)
            ctx.putImageData(snapshot, 0, 0);

            if (selectedTool === "brush" || selectedTool === "eraser") {
                ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor;
                ctx.lineTo(e.offsetX, e.offsetY);
                ctx.stroke();
            }
            //  else if(selectedTool === "rectangle"){
            //     drawRect(e);
            // } else if(selectedTool === "circle"){
            //     drawCircle(e);
            // } else {
            //     drawTriangle(e);
            // }
        };

    }

    //function to set brush width
    const setBrushWidth = (e) => {
        e.preventDefault()
        brushWidth = e.target.value
    }

    //function to save img
    const saveImg = (e) => {
        e.preventDefault()
        const link = document.createElement("a");
        link.download = `${Date.now()}.jpg`;
        link.href = canvas.current.toDataURL();
        link.click();
    }

    //function to clear canvas
    const clearCanvas = (e) => {
        e.preventDefault()
        ctx.clearRect(0, 0, canvas.current.width, canvas.current.height); // clearing whole canvas
        setCanvasBackground();
    }

    window.addEventListener("load", () => {
        setCanvasBackground();
    });

    useEffect(() => {
        const colorBtnArr = Array.from(document.getElementsByClassName('colorBtn'))
        if (colorBtnArr) {
            colorBtnArr.forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault()
                    selectedColor = window.getComputedStyle(btn).getPropertyValue("background-color");
                })
            })
        }

        const toolArr = Array.from(document.querySelectorAll('.tool'))
        if (toolArr) {
            toolArr.forEach((tool) => {
                tool.addEventListener('click', (e) => {
                    e.preventDefault()
                    selectedTool = btn.id;
                })
            })
        }
    }, [])


    useEffect(() => {
        if (canvas.current) {
            canvas.current.addEventListener("mousedown", startDraw);
            canvas.current.addEventListener("mousemove", drawing);
            canvas.current.addEventListener("mouseup", () => isDrawing = false);
        }
    }, [])

    return (
        <div className="canvas">
            <div className="controlSection d-flex justify-content-center align-items-center">
                <div className=" mx-2 shapes d-flex justify-content-between align-items-center">
                    <div className="triangle mx-1" style={{ width: "25px", height: "25px", cursor: "pointer" }}><img src={triangle} className="w-100 h-100 object-fit-cover" /></div>
                    <div className="circle mx-2" style={{ width: "25px", height: "25px", cursor: "pointer" }}><i className="fs-3 fa-regular fa-circle"></i></div>
                    <div className="square mx-2" style={{ width: "25px", height: "25px", cursor: "pointer" }}><i className="fs-3 fa-regular fa-square"></i></div>
                </div>
                <div className=" mx-2 brushAndSize d-flex justify-content-between align-items-center">
                    <div id='brush' className="tool mx-2" style={{ width: "25px", height: "25px", cursor: "pointer" }} onClick={saveImg}><i className=" fs-4 fa-solid fa-paintbrush"></i></div>
                    <div id='eraser' className="tool mx-2" style={{ width: "25px", height: "25px", cursor: "pointer" }} onClick={saveImg}><i className=" fs-3 fa-solid fa-eraser"></i></div>
                    <div id='clear' className="mx-2" style={{ width: "25px", height: "25px", cursor: "pointer" }} onClick={clearCanvas}><i className="fa-solid fa-trash"></i></div>
                    <div id='saveImg' className="mx-2" style={{ width: "25px", height: "25px", cursor: "pointer" }} onClick={saveImg} ><i className="fa-solid fa-download"></i></div>
                    <div className="slider"><input type="range" min={1} max={30} onChange={setBrushWidth} /></div>
                </div>
                <div className=" mx-2 colors d-flex justify-content-between align-items-center">
                    <div className="colorBtn mx-1 rounded-circle red" style={{ cursor: "pointer", width: "25px", height: "25px", backgroundColor: "red" }}></div>
                    <div className="colorBtn mx-1 rounded-circle orange" style={{ cursor: "pointer", width: "25px", height: "25px", backgroundColor: "orange" }}></div>
                    <div className="colorBtn mx-1 rounded-circle yellow" style={{ cursor: "pointer", width: "25px", height: "25px", backgroundColor: "yellow" }}></div>
                    <div className="colorBtn mx-1 rounded-circle green" style={{ cursor: "pointer", width: "25px", height: "25px", backgroundColor: "green" }}></div>
                    <div className="colorBtn mx-1 rounded-circle cyan" style={{ cursor: "pointer", width: "25px", height: "25px", backgroundColor: "cyan" }}></div>
                    <div className="colorBtn mx-1 rounded-circle blue" style={{ cursor: "pointer", width: "25px", height: "25px", backgroundColor: "blue" }}></div>
                    <div className="colorBtn mx-1 rounded-circle violet" style={{ cursor: "pointer", width: "25px", height: "25px", backgroundColor: "violet" }}></div>
                    <div className="colorBtn mx-1 rounded-circle brown" style={{ cursor: "pointer", width: "25px", height: "25px", backgroundColor: "brown" }}></div>
                    <div className="colorBtn mx-1 rounded-circle black" style={{ cursor: "pointer", width: "25px", height: "25px", backgroundColor: "black" }}></div>
                    <div className=" mx-1 rounded-circle chooseColor position-relative" style={{ width: "25px", height: "25px", backgroundColor: "black" }}>
                        <input type="color" className="opacity-0" id='selectedColor' style={{ width: 0, height: 0 }} onChange={(e) => {
                            e.preventDefault()
                            e.currentTarget.parentElement.querySelector('label').style.backgroundImage = 'none'
                            e.currentTarget.parentElement.querySelector('label').style.backgroundColor = `${e.currentTarget.value}`
                        }} />
                        <label htmlFor="selectedColor" style={{ cursor: "pointer", backgroundImage: `url(${colorWheel})`, backgroundSize: "cover" }} className=" position-absolute top-0 start-0 w-100 h-100 rounded-circle"></label>
                    </div>
                </div>
            </div>
            <div className=" my-3 drawingSection w-100 overflow-hidden d-flex justify-content-center" style={{ height: `${window.innerHeight * 0.95}px` }}>
                <canvas ref={canvas} className="h-100 bg-danger-subtle rounded-4" style={{ width: "90%" }}></canvas>
            </div>
        </div>
    )
}

export default canvas