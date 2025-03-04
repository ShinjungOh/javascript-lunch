## 🎯 기능 요구 사항
> 점심 식사 스팟 목록을 관리하는 앱을 만든다.


- 음식점 목록 페이지를 화면과 같이 구성한다.
- 음식점 목록에서 우측 상단의 추가 버튼을 눌러 모달 창을 띄우면, 새로운 음식점을 추가할 수 있다.
    - 음식점의 카테고리, 이름, 거리(도보 이동 시간), 설명, 참고 링크를 입력해서 추가할 수 있다.
    - 카테고리, 거리는 셀렉트 박스, 이름/설명/참고 링크는 텍스트 인풋을 사용한다.
    - 카테고리, 이름, 거리는 입력 필수.
        - 카테고리는 "한식", "중식", "일식", "아시안", "양식", "기타" 중 하나를 선택한다.
        - 거리는 캠퍼스로부터 도보로 걸리는 시간(분). 5, 10, 15, 20, 30 중 하나를 선택한다.
    - 설명, 참고 링크는 옵션. 입력하지 않아도 음식점을 추가할 수 있어야 한다.
    - 입력값이 잘못되었을 때 사용자에게 알려주는 방식은 자유롭게 구현한다.
- 새로고침 시 이전에 추가한 새로운 음식점 정보는 초기화된다.
