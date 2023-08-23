import * as React from "react";
import * as fabric from "fabric";
import { Box, Flex } from "@chakra-ui/react";
import { useTimer } from "@layerhub-io/use-timer";
import { centerArtboard } from "./canvas-utils";
import { MdGraphicEq, MdPlayCircle, MdPause } from "react-icons/md";
import Video from "./video";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { commonCanvasConfig, commonControlConfig } from "./constants";
import { formatTime } from "./utils";

const TIME_SCALE = 1;
const TIME_CHANGE = 1000 * TIME_SCALE;

function App() {
  const [maxDuration, setMaxDuration] = React.useState(100);
  const { start, time, setTime, pause, status } = useTimer();
  const canvasRef = React.useRef<fabric.Canvas>();

  React.useEffect(() => {
    const { clientWidth, clientHeight } = document.getElementById(
      "sm-canvas"
    ) as HTMLDivElement;

    const canvas = new fabric.Canvas("canvas", {
      height: clientHeight,
      width: clientWidth,
      ...commonCanvasConfig,
    });

    const artboard = new fabric.Rect({
      left: 0,
      top: 0,
      fill: "#ffffff",
      width: 1200,
      height: 1200,
      evented: false,
      selectable: false,
    });
    canvas.add(artboard);

    centerArtboard(canvas, artboard);
    canvasRef.current = canvas;
    addVideo();

    return () => {
      canvas.dispose();
    };
  }, []);

  const addVideo = React.useCallback(async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const artboard = canvas.getObjects("rect")[0];

      const center = artboard.getCenterPoint();
      const video = await Video.fromURL(
        "https://ik.imagekit.io/uonadbo34e6/videos/video_m2R2IZG8B.mp4",
        {
          crossOrigin: "anonymous",
          top: center.y,
          left: center.x,
          originX: "center",
          originY: "center",
          ...commonControlConfig,
        }
      );
      const duration = video.getElement().duration;
      setMaxDuration(duration * TIME_CHANGE);
      canvas.add(video);
    }
  }, [canvasRef.current]);

  React.useEffect(() => {
    if (time >= maxDuration) {
      setTime(maxDuration);
      return pause();
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getObjects().forEach((obj) => {
      if (obj instanceof Video) {
        obj.getElement().currentTime = time / TIME_CHANGE;
      }
    });

    setTimeout(() => {
      canvas.requestRenderAll();
    }, 100);
  }, [time, maxDuration]);

  return (
    <Flex
      sx={{
        height: "100vh",
        flexDirection: "column",
        backgroundColor: "#1A202C",
        overflow: "hidden",
      }}
    >
      <Flex sx={{ flex: 1 }}>
        <Box sx={{ flex: 1 }} id="sm-canvas">
          <canvas id="canvas" />
        </Box>
      </Flex>
      <Flex sx={{ height: "80px", borderTop: "1px solid #2D3748" }}>
        <Flex
          sx={{
            height: "80px",
            width: "60px",
            fontSize: "24px",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            onClick={
              status === "STOPPED" || status === "PAUSED" ? start : pause
            }
            sx={{
              fontSize: "26px",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255, 255, 255, 0.04)",
              padding: "0.75rem",
              borderRadius: "0.375rem",
              cursor: "pointer",
              color: "#ffffff",
            }}
          >
            {status === "RUNNING" ? <MdPause /> : <MdPlayCircle />}
          </Box>
        </Flex>
        <Flex sx={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Slider
            max={maxDuration}
            aria-label="slider-timer"
            value={time}
            onChange={(v) => setTime(v)}
          >
            <SliderTrack bg="red.100">
              <SliderFilledTrack bg="tomato" />
            </SliderTrack>
            <SliderThumb boxSize={5}>
              <Box color="tomato" as={MdGraphicEq} />
            </SliderThumb>
          </Slider>
        </Flex>
        <Flex
          sx={{
            width: "80px",
            alignItems: "center",
            justifyContent: "center",
            color: "#CBD5E0",
            display: "flex",
          }}
        >
          <Box>{formatTime(time)}</Box>
        </Flex>
      </Flex>
    </Flex>
  );
}

export default App;
