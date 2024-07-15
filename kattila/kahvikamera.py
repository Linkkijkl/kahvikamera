import cv2
import subprocess
import time

def send_image_to_server(imgPath):
    try:
        subprocess.run(['scp', imgPath,'root@kattila.cafe:~/kahvikamera/web/static/images/'], capture_output=True)
    except subprocess.CalledProcessError as e:
        print(f'An error occured: {str(e)}')

# Whitebalances outgoing image, writes image to 'kahvi.jpg'
def publication_postprocess(img: cv2.typing.MatLike) -> cv2.typing.MatLike:

    # Rotate
    img = rotate(img, cv2.ROTATE_90_COUNTERCLOCKWISE)
    
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
    (w, h), bl = cv2.getTextSize(text = timestamp,
                                 fontFace = fontFace,
                                 fontScale = fontScale,
                                 thickness = thickness)
    outboundImg = cv2.putText(img = outboundImg,
                              text = timestamp,
                              org = (originOffest,originOffest+h),
                              fontFace = fontFace,
                              fontScale = fontScale,
                              color = (255,255,255),
                              thickness = thickness)

    return outboundImg

def capture_camera() -> cv2.typing.MatLike:
    try:
        cam = cv2.VideoCapture(0)

        if not cam.isOpened():
            raise IOError("Cannot open webcam")
        
        (ret, capImg) = cam.read()
        return capImg
    
    finally:
        cam.release()

def main():
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
