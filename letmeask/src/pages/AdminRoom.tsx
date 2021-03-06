import { useHistory, useParams } from "react-router-dom";

import logoImg from "../assets/images/logo.svg";
import deleteImg from "../assets/images/delete.svg";
import checkImg from "../assets/images/check.svg";
import answerImg from "../assets/images/answer.svg";

import { Button } from "../components/Button";
import { Question } from "../components/Question";
import { RoomCode } from "../components/RoomCode";
import { ModalComponent } from "../components/ModalComponent";

import { useRoom } from "../hooks/useRoom";


import "../styles/room.scss";
import { database } from "../services/firebase";
import { CSSProperties, useState } from "react";

type RoomParams = {
  id: string;
}

export function AdminRoom() {
  // const { user } = useAuth();
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

  const { title, questions } = useRoom(roomId);

  const [questionToDelete, setQuestionToDelete] = useState<string>('');
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [endRoomOpen, setEndRoomOpen] = useState<boolean>(false);

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date()
    })

    history.push("/");
  }

  async function handleDeleteQuestion(questionId: string) {
    if (!!questionToDelete) {
      await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
    }
  }

  async function handleCheckQuestionAsAnswered(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isAnswered: true
    });

  }

  async function handleHighlightQuestion(questionId: string) {
    await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
      isHighlighted: true
    });

  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId} />
            <Button isOutlined onClick={() => setEndRoomOpen(!endRoomOpen)
            }>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}

        </div>

        <div className="question-list">
          {questions.map(question => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
                isAswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                {!question.isAnswered && (
                  <>
                    <button
                      type="button"
                      onClick={() => handleCheckQuestionAsAnswered(question.id)}
                    >
                      <img src={checkImg} alt="Marcar pergunta como respondida" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHighlightQuestion(question.id)}
                    >
                      <img src={answerImg} alt="Dar destaque ?? pergunta" />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setDeleteModalOpen(!deleteModalOpen);
                    setQuestionToDelete(question.id)
                  }}
                >
                  <img src={deleteImg} alt="Remover pergunta" />
                </button>
              </Question>
            );
          })}
        </div>
      </main>
      <ModalComponent isOpen={endRoomOpen}>
        <div className="delete-img">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M29.66 18.3398L18.34 29.6598" stroke="#E73F5D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M29.66 29.6598L18.34 18.3398" stroke="#E73F5D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
            <path fill-rule="evenodd" clip-rule="evenodd" d="M24 42V42C14.058 42 6 33.942 6 24V24C6 14.058 14.058 6 24 6V6C33.942 6 42 14.058 42 24V24C42 33.942 33.942 42 24 42Z" stroke="#E73F5D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>

        <h2 className="title">
          Encerrar sala
        </h2>
        <p className="description">Tem certeza que voc?? deseja encerrar esta sala?</p>
        <div className="buttons">
          <button
            className="cancel"
            onClick={() => {
              setEndRoomOpen(false);
            }}
          >
            Cancelar
          </button>
          <button
            className="end-room"
            onClick={() => {
              setDeleteModalOpen(false);
              handleEndRoom();
            }}
          >
            Sim, encerrar
          </button>
        </div>
      </ModalComponent>


      <ModalComponent
        isOpen={deleteModalOpen}
      >

        <div className="delete-img">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 5.99988H5H21" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 5.99988V3.99988C8 3.46944 8.21071 2.96074 8.58579 2.58566C8.96086 2.21059 9.46957 1.99988 10 1.99988H14C14.5304 1.99988 15.0391 2.21059 15.4142 2.58566C15.7893 2.96074 16 3.46944 16 3.99988V5.99988M19 5.99988V19.9999C19 20.5303 18.7893 21.039 18.4142 21.4141C18.0391 21.7892 17.5304 21.9999 17 21.9999H7C6.46957 21.9999 5.96086 21.7892 5.58579 21.4141C5.21071 21.039 5 20.5303 5 19.9999V5.99988H19Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h2 className="title">
          Excluir pergunta
        </h2>
        <p className="description">Tem certeza que deseja excluir esta pergunta</p>
        <div className="buttons">
          <button
            className="cancel"
            onClick={() => {
              setDeleteModalOpen(false);
              setQuestionToDelete('');
            }}
          >
            Cancelar
          </button>
          <button
            className="delete"
            onClick={() => {
              setDeleteModalOpen(false);
              handleDeleteQuestion(questionToDelete);
            }}
          >
            Sim, excluir
          </button>
        </div>
      </ModalComponent>
    </div>
  );
}