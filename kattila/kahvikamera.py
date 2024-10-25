import cv2
import subprocess
import time
from typing import Any


def send_image_to_server(imgPath: str):
    try:
        subprocess.run(['scp', '-P', '5001', '-o', 'StrictHostKeyChecking no', imgPath,'kahvi@linkkijkl.fi:/data/'], capture_output=True)
    except subprocess.CalledProcessError as e:
        print(f'An error occured: {str(e)}')


def publication_postprocess(img: cv2.typing.MatLike) -> cv2.typing.MatLike:
    # Rotate
    img = cv2.rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)

    # Whitebalancing
    wb = cv2.xphoto.createSimpleWB()
    outboundImg = wb.balanceWhite(img)

    # Add timestamp
    fontFace = cv2.FONT_HERSHEY_SIMPLEX
    fontScale = 2
    thickness = 3
    timestamp = time.strftime('%H:%M:%S')
    originOffest = 10
    # Get text height for aligning top left
    size = cv2.getTextSize(text = timestamp,
                                 fontFace = fontFace,
                                 fontScale = fontScale,
                                 thickness = thickness)
    outboundImg = cv2.putText(img = outboundImg,
                              text = timestamp,
                              org = (originOffest,originOffest+size[0][1]),
                              fontFace = fontFace,
                              fontScale = fontScale,
                              color = (255,255,255),
                              thickness = thickness)
    return outboundImg


def capture_camera() -> cv2.typing.MatLike:
    cam: cv2.VideoCapture = cv2.VideoCapture(0)
    cap = cam.read()
    cam.release()
    return cap[1]


def describe_camera() -> int:
    props: dict[Any, Any] = {}
    cam: cv2.VideoCapture = cv2.VideoCapture(0)
    print(f"Camera Backend: {cam.getBackendName()}")
    for (prop_name, prop_value) in props:
        print(f"Setting {prop_name}: {prop_value}")
    cam.release()
    return len(props)


def main():
    describe_camera()
    while True:
        try:
            newImg = capture_camera()
            outboundImg = publication_postprocess(newImg)
            cv2.imwrite('kahvi.jpg', outboundImg)
            send_image_to_server('kahvi.jpg')

        except Exception as ex:
            print(ex)

        finally:
            time.sleep(5)


if __name__ == '__main__':
    main()
