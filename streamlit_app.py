import streamlit as st
import requests
import base64
from io import BytesIO
from PIL import Image

API_ENDPOINT = "http://localhost:3001/api/face"
TARGET_URL = "https://example.com"  # 65세 미만 이동할 웹 URL

st.title("AI 얼굴 나이 인식 키오스크")

# 카메라 입력
img_file = st.camera_input("얼굴을 찍어주세요")

if img_file is not None:
    # 이미지 base64 변환
    img = Image.open(img_file)
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

    # API 요청
    with st.spinner("나이 분석 중..."):
        try:
            res = requests.post(API_ENDPOINT, json={"imageBase64": img_str, "frameCount": 1})
            data = res.json()

            if data.get("face_detected"):
                age = data.get("age")
                st.success(f"추정 나이: {age} 세")

                if age is not None and age < 65:
                    st.markdown(f"[👉 이동하기]({TARGET_URL})", unsafe_allow_html=True)
                else:
                    st.subheader("메뉴를 선택하세요")
                    col1, col2 = st.columns(2)
                    with col1:
                        if st.button("🍽 먹고 가기"):
                            st.success("먹고 가기를 선택하셨습니다.")
                    with col2:
                        if st.button("🥡 포장"):
                            st.success("포장을 선택하셨습니다.")
            else:
                st.error("얼굴이 감지되지 않았습니다. 다시 시도해주세요.")

        except Exception as e:
            st.error(f"API 요청 오류: {e}")
