
import { useState, useEffect } from 'react';
import TeamAPI from '../0. API/TeamAPI';
import styled from 'styled-components';
import { Link } from "react-router-dom";
import SignUpModal from './SignUpModal';

// import 'bootstrap/dist/css/bootstrap.min.css';

const MessageList = () => {
  const localId = window.localStorage.getItem("userId");


  const [messageList, setMessageList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  let inputMessage;
  // 테스트중

  // const namesList = window.localStorage.getItem("userId");
  // const [namesList , setNamesList ] = useState([]);


  let receiverId = 'dleldi';

  const Styled = styled.div`
  overflow: scroll;
  &::-webkit-scrollbar{
    /*가로 스크롤 넓이*/
    width: 8px;
    /*세로 스크롤 넓이*/
    height: 8px;
    
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.4);
  }
  &::-webkit-scrollbar-thumb{
    background-color: rgba(0,0,0,0.3);
    border-radius:6px;
  }
  height: 500px;
  `;

  useEffect(() => {
    const messageData = async () => {
      setLoading(true);
      try {
        const response = await TeamAPI.messageStorage(localId);
        console.log("응답 메시지 : " + response);
        setMessageList(response.data);
        console.log("content[0] : " + response.data[0].content);
        console.log("postReceiver[0] : " + response.data[0].postReceiver);
        console.log("postTime[0] : " + response.data[0].postTime);

        window.localStorage.setItem("namesList", response.data);
      } catch (e) {
        console.log(e);
      }

      setLoading(false);
    };
    messageData();
  }, []);

  // 여기부터는 모달 테스트
  const [signUpModalOn, setSignUpModalOn] = useState(false);

  // const testArray = messageList.map(message => message);
  // console.log("testArray : " + testArray);
  // window.localStorage.setItem("userName", memberInfo.name);

  // 여기까지 모달 테스트

  const onClickSendMessage = async () => {
    console.log("쪽지 보내기 눌렀어요.");
    inputMessage = prompt("쪽지 내용을 작성하세요.", "");
    let id = localId;
    console.log("id : " + id);
    try {
      if (inputMessage !== "") {
      const messageReg = await TeamAPI.messageReg(id, receiverId, inputMessage);
      console.log("\n\n보내는 사람(localId) : " + id);
      console.log("받는 사람(receiverId) : " + receiverId);
      console.log("쪽지 내용(inputMessage) : " + inputMessage);
      alert("쪽지 보내기 성공!")

    } else {
      console.log("!!쪽지 내용 없음!!");
      alert("쪽지 내용을 작성하세요..^^")
    }

    } catch (e) {
      console.log(e);
      alert("쪽지 보내기 실패!")
    }

  }

  const onClickMessage = (postReceiver, content) => {
    console.log("postReceiver : " + postReceiver);
    setName(postReceiver);

    console.log("content : " + content);
    setContent(content);

    setSignUpModalOn(true);

  }

  const onClickDelete = () => {
    let arryaids = [];
    let boxs = document.getElementsByClassName("checkboxs");
    console.log("boxs : " + boxs);
    console.log("boxs.length : " + boxs.length);

    // let selectedMessage = [];
    for (let i = 0; i < boxs.length; i++) {
      var chkbox = boxs[i].rows;
      console.log("chkbox : " + chkbox);

      if (chkbox) boxs.deleteRow(i);
      // if(boxs[i] == true) 
    }
  }

  function checkAll(e) {
    let isChecked = e.target.checked;
    console.log("isChecked : " + isChecked); // true
    let boxs = document.getElementsByClassName("checkboxs");
    for (let i = 0; i < boxs.length; i++) {
      boxs[i].checked = isChecked;
    }
  }

  if (loading) {
    return <div>대기 중...</div>
  }

  return (
    <>
      <SignUpModal modalName={name} modalContent={content} show={signUpModalOn} onHide={() => setSignUpModalOn(false)} />
      <div className='Login-Container'>
        {/* 모달 테스트 중 */}

        <div className='outbox'>
          <div className='name'>Post Box</div>
          <Styled>
            <table className='tableContainer'>

              <tr className='tr1'>
                <th className='th1'><input type="checkbox" onClick={checkAll} /></th>
                <th>보낸 사람(NAME)</th>
                <th>내용(CONTENT)</th>
                <th className='th3'>시간(DATETIME)</th>
              </tr>
              {messageList && messageList.map(message => (
                <tr key={message.postTime}>
                  <td><input type="checkbox" className="checkboxs" /></td>
                  <td>{message.postReceiver}</td>
                  <td onClick={() => onClickMessage(message.postReceiver, message.content)}>{message.content}</td>
                  <td>{message.postTime}</td>
                </tr>
              ))}
            </table>
          </Styled>
          <button className='w-btn-neon2' onClick={onClickSendMessage}>{receiverId}</button>
          <button className='w-btn-neon2' onClick={onClickDelete}>삭제하기</button>
          <span>
            <Link  to="/home" className="link-box">
              <img className="link-img" alt="HOME" />
              <span> HOME으로 이동 </span>
            </Link>
          </span>
        </div>
      </div>
    </>
  );
}
export default MessageList;